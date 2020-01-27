/**
 * Copyright 2019 Carnegie Technologies
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file Responds to Gateway Config requests with data from environment variables
 */

import * as amqp from 'amqplib';
import * as express from 'express';

import { config } from './config';

export const gatewayManagement: express.Express = express();

let connection: amqp.Connection;
let channel: amqp.Channel;

const exchange = 'gw';
const bindingKey1: string = 'ct.iot.device.ns.gw.*.config.get';
const bindingKey2: string = 'ct.iot.device.gw.*.status';
let queueName: string = 'ct.iot.gatewayManagement-configGet';

const gwConfigResponse = {
    gwEui: config.get('gwEui'),
    loraRfPlan: config.get('loraRfPlan'),
    region: config.get('loraRegion'),
    channelPlanId: config.get('loraChannelPlanId')
};

async function connectAmqp(): Promise<void> {
    try {
        connection = await amqp.connect(config.get('amqpUri'));

        connection.on('close', (err: Error) => {
            connection = null;

            console.warn({
                message: 'Lost connection to amqp',
                error: (err instanceof Error) ? err : 'Unknown'
            });

            process.exit(1);
        });

        connection.on('error', (err: Error) => {
            console.error({
                message: 'Error occured in the amqp connection',
                error: (err instanceof Error) ? err : 'Unknown'
            });
        });

    }

    catch (error) {
        console.error({
            message: 'Unable to connect to amqp',
            error: error.message
        });

        process.exit(1);
    }
}

async function bootstrap(): Promise<void> {
    await connectAmqp();

    channel = await connection.createChannel();

    await channel.assertExchange(exchange, 'topic', { durable: true });

    const queueOk: amqp.Replies.AssertQueue = await channel.assertQueue(queueName);
    queueName = queueOk.queue;

    await channel.bindQueue(queueName, exchange, bindingKey1);
    await channel.bindQueue(queueName, exchange, bindingKey2);

    // tslint:disable no-magic-numbers
    await channel.consume(queueName, (msg: amqp.Message) => {
        const fields = msg.fields.routingKey.split('.');

        let bindingKey: string;
        switch (fields[3]) {
            case 'ns':
                bindingKey = `${msg.fields.routingKey}.accepted`;
                break;
            case 'gw':
                bindingKey = `ct.iot.device.gw.${fields[4]}.config.lora.update`;
                break;
            default:
                console.error('unknown binding key');
        }

        channel.ack(msg);
        channel.publish(
            exchange,
            bindingKey,
            Buffer.from(JSON.stringify(gwConfigResponse)));
    });
}
bootstrap().catch((error: Error) => {
    console.error({ message: 'Bootstrap promise threw an error', error });
    process.exit(1);
});

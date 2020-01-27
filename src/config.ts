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
 * @file Sets up the configuration
 */

import * as convict from 'convict';

interface GwConfig {
    env: string;
    port: number;
    gwEui: string;
    loraRfPlan: number;
    loraRegion: string;
    loraChannelPlanId: number;
}

export let config: convict.Config<GwConfig> = convict({
    port: {
        doc: 'The port the HTTP server will listen on',
        format: 'port',
        default: 8080,
        env: 'PORT'
    },
    amqpUri: {
        doc: 'AMQP Connection Uri',
        format: 'String',
        default: 'amqp://localhost',
        env: 'AMQP_URI'
    },
    gwEui: {
        doc: 'The EUI of the gateway',
        format: 'String',
        default: 'someEui',
        env: 'GW_EUI'
    },
    loraRfPlan: {
        doc: 'The LoRa RF plan to use. A number from 1-8, or use 0 to reject all requests',
        format: 'nat',
        default: 1,
        env: 'LORA_RF_PLAN'
    },
    loraRegion: {
        doc: 'Default value specifying the region the gateway is operating in',
        format: 'String',
        default: 'US902',
        env: 'LORA_REGION'
    },
    loraChannelPlanId: {
        doc: 'Default value specifying an ID for which set of channels to use. Use values 1 - 5',
        format: 'nat',
        default: 1,
        env: 'LORA_CHANNEL_PLAN_ID'
    }
});

config.validate({ allowed: 'strict' });

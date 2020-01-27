# Gateway Management Service

This service is used to provide configuration information for Carnegie Technologies' LoRa gateways.

The gateway requires this LoRa configuration information to function correctly and pass LoRa payloads
to/from the cloud. Please note that gateways also require additional on-device configuration to connect
to a cloud RabbitMQ and talk to this service.

This service listens for messages sent over RabbitMQ on the 'gw' exchange and responds with
Gateway Config messages when the gateway sends either a configuration get request or a status update.

The response messages are configurable via environment varirables.

## Usage

### Install from npm

With npm

```sh
npm install -g @carnegietech/ct-gateway-management
```

or with yarn

```sh
yarn global add @carnegietech/ct-gateway-management
```

After installing, ct-gateway-management can be run with

```sh
AMQP_URI=amqp://user:pass@localhost \
  GW_EUI=1234abcd56ef7890 \
  LORA_RF_PLAN=1 \
  LORA_REGION=US902 \
  LORA_CHANNEL_PLAN_ID=1 \
  ct-gateway-management
```

### Compile it yourself

Clone the repo and run

```sh
yarn install
yarn compile
```

After compiling, ct-gateway-management can be run with

```sh
yarn serve
```

## Configuration - Environment variables

* `AMQP_URI`: URI to access the RabbitMQ server e.g. amqp://user:pass@localhost

### Configuration of the Response
* `GW_EUI`: The EUI of the gateway e.g. 1234abcd56ef7890
* `LORA_RF_PLAN`: The LoRa RF plan to use. A number from 1-8, or use 0 to reject all requests
* `LORA_REGION`: Default value specifying the region the gateway is operating in e.g. US902
* `LORA_CHANNEL_PLAN_ID`: Default value specifying an ID for which set of channels to use. Use values 1 - 5

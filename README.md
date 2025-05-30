# READ ME

This is an IoT workshop. We are using ThingsBoard for rendering the frontend, and an external MQTT broker (EMQX) as the subscriber, because ThingsBoard does not support parallel usage of the same client credentials for both publishing and subscribing.

- Port 1883 is the internal MQTT broker of ThingsBoard.
- Port 1884 is the external MQTT broker (EMQX), which receives data forwarded from port 1883.

![thins board demo rule chain setup](/images/tb-flow-demo.png)

### Setup And Installation

1. Run `docker volume create mytb-data` and `docker volume create mytb-logs` to create volumes for ThingsBoard.
2. Navigate to the `./service-docker` directory and run `docker-compose up --build` to start ThingsBoard and the EMQX broker.
3. At the root of the project, run `npm install` to install dependencies.
4. Run `node pb.js` to test publishing messages to the ThingsBoard MQTT broker.
5. Run `node sub.js` to test subscribing to messages from the EMQX broker, which forwards data from the ThingsBoard MQTT broker.

### ThingsBoard Setup

1. Create a Device in ThingsBoard to receive data from the publisher (reference it using the device's Access Token).
2. After the publisher sends data, check the Latest Telemetry tab to verify that the data has been published to the topic `v1/devices/me/telemetry`.
3. Then, go to the `Rule Chains` menu and create a new rule chain as shown in the reference image.
4. In the MQTT node of the rule chain, configure the MQTT host, port, and topic to point to the EMQX broker.
5. Once configured, you will see the published data appear in EMQX.

![thins board demo rule chain setup](/images/tb-setup-rulechain.png)

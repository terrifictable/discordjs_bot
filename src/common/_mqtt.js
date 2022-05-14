const mqtt = require('mqtt')
const { mqtt_server, mqtt_user, mqtt_pass, mqtt_topic } = require("../resources/config.json")

const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${mqtt_server}:${port}`;

function mqtt_init() {
    const client = mqtt.connect(connectUrl, {
        clientId,
        clean: true,
        connectTimeout: 4000,
        username: mqtt_user,
        password: mqtt_pass,
        reconnectPeriod: 1000,
    });

    return client;
}

function subscribe(client, topic) {
    client.on('connect', () => {
        console.log('Connected')
        client.subscribe([topic], () => {
            console.log(`Subscribe to topic '${topic}'`);
        });
    });
}

function publish(client, topic, message) {
    client.on('connect', () => {
        client.publish(topic, message, { qos: 2, retain: false }, (error) => {
            if (error) {
                console.error(error);
            }
        });
    });
}

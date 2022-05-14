const { mqtt_server, mqtt_user, mqtt_pass } = require("../resources/config.json")
const fs = require("fs-extra");
const mqtt = require("mqtt");

const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${mqtt_server}:${port}`;


module.exports = {
    name: "messageCreate",
    once: false,
    execute (message) {
        const client = mqtt.connect(connectUrl, {
            clientId,
            clean: true,
            connectTimeout: 4000,
            username: mqtt_user,
            password: mqtt_pass,
            reconnectPeriod: 1000,
        });

        var users;
        try {
            users = JSON.parse(fs.readFileSync("./data/users.json"));
        } catch (e) {
            users = {};
        }

        var userMessages = 0;
        if (users[message.author.username + message.author.discriminator] != null && users[message.author.username + message.author.discriminator] != undefined) {
            userMessages = users[message.author.username + message.author.discriminator] + 1;
        }

        users[message.author.username + message.author.discriminator] = userMessages;

        fs.writeFileSync("./data/users.json", JSON.stringify(users));
        
        var msg = {
            "authorName": message.author.username,
            "authorDiscriminator": message.author.discriminator,
            "authorId": message.author.id,
            "bot": message.author.bot,
            "system": message.author.system,
            "content": message.content,
            "messageAmount": users[message.author.username + message.author.discriminator]
        };


        console.log(msg);

        client.on('connect', () => {
            client.publish("Discord/Blender/send", JSON.stringify(msg), { qos: 2, retain: false }, (error) => {
                if (error) {
                    console.error(error);
                }
            });

            client.end();
        });

    }
}

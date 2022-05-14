const { SlashCommandBuilder } = require('@discordjs/builders');
const { mqtt_init, publish } = require("../common/_mqtt.js");
const { topic } = require("../resources/config.json");

module.exports = {
    data: new SlashCommandBuilder()
            .setName('settext')
            .setDescription('Set Text for ESP to display')
            .addStringOption(
                option => option.setName('input')
                    .setDescription('Text to be displayed on ESP')
                    // .setRequired(true)
            ),
            
    async execute(interaction) {
        var client = mqtt_init();
        publish(client, topic, interaction.options.getString('input'));

        await interaction.reply("Sent message to MQTT");
    },
}

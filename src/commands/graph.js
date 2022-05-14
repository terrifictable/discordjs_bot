const { username, password, grafana } = require('../resources/config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const fse = require('fs-extra');
const fs = require('node:fs');


// !!! THIS REQUIRES "Grafana Image Renderer" PLUGIN TO BE INSTALLED ON Grafana SERVER !!!


module.exports = {
    data: new SlashCommandBuilder()
            .setName('graph')
            .setDescription('Returns an image of Grafana graph'),
            
    async execute(interaction) {
        var currUnixTime            = new Date().getTime();
        var graphStartUnixTime      = currUnixTime - 86400000;
        var url                     = `http://${grafana}/render/d-solo/y-0Qde_nz/airgiano-sdc30?orgId=1&from=${graphStartUnixTime}&to=${currUnixTime}&refresh=5s&panelId=2&width=2000&height=600&tz=Europe%2FBerlin`
        var auth                    = "Basic " + new Buffer.alloc((username + ":" + password).length, username + ":" + password).toString("base64"); // Grafana Username and Password authentication
        
        await interaction.deferReply(); // wait until the reply is edited, for interaction token something to not be invalid, incase this takes longer than 3 secs

        
        try { fse.removeSync("./data/image.jpg"); } // Remove old image
        catch (err) { "" } // catch (incase there is no image)


        const response = await fetch(url, { method: 'GET', headers: { "Authorization" : auth } }); // send request to grafana
        const buffer = await response.buffer(); // get image
        fs.writeFile(`./data/image.jpg`, buffer, () => { console.log("Grafana Graph saved") }); // save image


        const img = new MessageAttachment("./data/image.jpg"); // create a new attachment
        
        await interaction.editReply({ files: [img] }); // send attachment
    }
}

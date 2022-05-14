const { username, password } = require('../resources/config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const fetch = require('node-fetch');
const fse = require('fs-extra');
const fs = require('node:fs');


module.exports = {
    data: new SlashCommandBuilder()
            .setName('graph')
            .setDescription('Returns an image of Grafana graph'),
            
    async execute(interaction) {
        var currUnixTime            = new Date().getTime();
        var graphStartUnixTime      = currUnixTime - 86400000;
        var url                     = `http://192.168.2.132:3000/render/d-solo/y-0Qde_nz/airgiano-sdc30?orgId=1&from=${graphStartUnixTime}&to=${currUnixTime}&refresh=5s&panelId=2&width=2000&height=600&tz=Europe%2FBerlin`
        var auth                    = "Basic " + new Buffer.alloc((username + ":" + password).length, username + ":" + password).toString("base64");
        
        await interaction.deferReply();
        // await interaction.editReply(`Grafana Graph from ${new Date(graphStartUnixTime*1000)} to ${new Date(currUnixTime*1000)}`);

        // TODO
        try { fse.removeSync("./data/image.jpg"); }
        catch (err) { /* console.log(err) */ }

        const response = await fetch(url, { method: 'GET', headers: { "Authorization" : auth } });
        const buffer = await response.buffer();        
        fs.writeFile(`./data/image.jpg`, buffer, () => { console.log('finished downloading!') });


        const img = new MessageAttachment("./data/image.jpg");
        
        await interaction.editReply({ files: [img] }); 
    }
}

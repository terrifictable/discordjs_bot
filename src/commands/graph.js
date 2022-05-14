const { username, password } = require('../resources/config.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const fs = require('node:fs');


module.exports = {
    data: new SlashCommandBuilder()
            .setName('graph')
            .setDescription('Returns an image of Grafana graph'),
            
    async execute(interaction) {
        var currUnixTime            = new Date().getTime();
        var graphStartUnixTime      = currUnixTime - 86400;
        var url                     = `http://192.168.2.132:3000/render/d-solo/y-0Qde_nz/airgiano-sdc30?orgId=1&from=${graphStartUnixTime}&to=${currUnixTime}&refresh=5s&panelId=2&width=2000&height=600&tz=Europe%2FBerlin`
        var auth                    = "Basic " + new Buffer.alloc((username + ":" + password).length, username + ":" + password).toString("base64");
    
        // request.get({url : url, headers : { "Authorization" : auth } },
        //         function (error, response) {
        //             fs.writeFile("./image.png", response.body.Buffer(), () => { console.log("Image saved"); });
        //         }
        // );


        // TODO
        const response = await fetch(url, { method: 'GET', headers: { "Authorization" : auth } });
        const buffer = await response.buffer();
        fs.writeFile(`./image.jpg`, buffer, () => { console.log('finished downloading!') });

    
        await interaction.reply("graph");
    },
}

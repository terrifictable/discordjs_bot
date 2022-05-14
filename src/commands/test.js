const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
            .setName('test')
            .setDescription('Test Command to see if bot is working'),
            
    async execute(interaction) {
        await interaction.reply("Test!");
    },
}

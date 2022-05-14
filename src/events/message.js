module.exports = {
    name: "messageCreate",
    once: false,
    execute (message) {
        var msg = {
            "authorName": message.author.username,
            "authorDiscriminator": message.author.discriminator,
            "authorId": message.author.id,
            "bot": message.author.bot,
            "system": message.author.system,
            "content": message.content,
        };

        console.log(JSON.stringify(msg));
    }
}

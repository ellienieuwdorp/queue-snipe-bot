const { CommandoClient } = require("discord.js-commando");

module.exports = {
    client: new CommandoClient({
        commandPrefix: "!",
        owner: "124993035577720832",
    }),
    concatArray: function (arr) {
        let s = "";
        arr.forEach(function (v, n) {
            s = s + v;
            if (arr.length > n + 1) s = s + ", ";
        });
        return s;
    },
    // convert id to Discord user mentionable
    convertIdToTag: function (id) {
        return this.client.users.cache.get(id).toString();
    },
    // convert id to Discord channel nickname
    convertIdToNick: function (id) {
        return this.client.users.cache.get(id).tag;
    },
    // Returns true if the author of the message is privileged
    isAuthorizedMessage: function (message) {
        return (
            "member" in message &&
            (message.member.hasPermission("ADMINISTRATOR") ||
                message.member.roles.cache.find((r) => r.name === "Queue Snipe Admin"))
        );
    },
    // Shuffles a list using Fisher-Yates
    shuffle: function (array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    },
};

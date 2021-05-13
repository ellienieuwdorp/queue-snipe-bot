const { Command } = require("discord.js-commando");
const queue = require("./../../queue");
const util = require("./../../util");

module.exports = class ResetCommand extends Command {
    constructor(client) {
        super(client, {
            name: "reset",
            aliases: [],
            group: "admin",
            memberName: "reset",
            description: "Resets the player and captain lists.",
        });
    }
    hasPermission(message) {
        return util.isAuthorizedMessage(message);
    }
    run(message) {
        queue.mainQueue.resetQueue();
        message.reply("Player and captain lists have been reset.");
    }
};

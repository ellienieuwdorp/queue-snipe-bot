const util = require("./util.js");

class Player {
    constructor(user) {
        // @private
        this.discordUser_ = user;

        // @private
        this.isCaptain_ = false;
    }

    getDiscordUser() {
        return this.discordUser_;
    }

    setCaptain() {
        this.isCaptain_ = true;
    }

    unsetCaptain() {
        this.isCaptain_ = false;
    }

    isCaptain() {
        return this.isCaptain_;
    }

    shouldBeDistributed() {
        return !this.isCaptain_;
    }
}

class GameQueue {
    constructor() {
        // @private
        this.playerList_ = [];
    }

    /**
     * Tests if a used is a registered player.
     * @param {Discord.User} user
     */
    containsPlayer(user) {
        for (const player of this.playerList_) {
            if (player.getDiscordUser() === user) {
                return true;
            }
        }
        return false;
    }

    findPlayer(user) {
        for (const player of this.playerList_) {
            if (player.getDiscordUser() === user) {
                return player;
            }
        }

        // TODO should this throw an error?
        return null;
    }

    addPlayer(user) {
        if (this.containsPlayer(user)) {
            throw "Player(s) already present in queue.";
        }
        this.playerList_.push(new Player(user));
    }

    addPlayers(users) {
        for (const user of users) {
            this.addPlayer(user);
        }
    }

    removePlayer(user) {
        let index = -1;
        for (let i = 0; i < this.playerList_.length; i++) {
            if (this.playerList_[i].getDiscordUser() === user) {
                index = i;
                break;
            }
        }

        if (index === -1) {
            throw "Attemped to remove a player from the queue that's not in the queue.";
        }
        this.playerList_.splice(index, 1);
    }

    removePlayers(users) {
        for (const user of users) {
            this.removePlayer(user);
        }
    }

    setCaptain(user) {
        this.findPlayer(user).setCaptain();
    }

    setCaptains(users) {
        for (const user of users) {
            this.setCaptain(user);
        }
    }

    unsetCaptain(user) {
        this.findPlayer(user).unsetCaptain();
    }

    unsetCaptains(users) {
        for (const user of users) {
            this.unsetCaptain(user);
        }
    }

    resetQueue() {
        this.playerList_ = [];
    }

    getReadableCaptainList() {
        const s = [];
        for (const player of this.playerList_) {
            if (player.isCaptain()) {
                s.push(util.convertIdToTag(player.getDiscordUser().id));
            }
        }
        return util.concatArray(s);
    }

    getReadableNonCaptainList() {
        const s = [];
        for (const player of this.playerList_) {
            if (!player.isCaptain()) {
                s.push(util.convertIdToTag(player.getDiscordUser().id));
            }
        }
        return util.concatArray(s);
    }

    distribute(message) {
        const captains = new Map();
        const players = [];

        for (const player of this.playerList_) {
            if (player.isCaptain()) {
                captains.set(player.getDiscordUser(), []);
            } else {
                players.push(player.getDiscordUser());
            }
        }

        GameQueue.distributePlayers(message, captains, players, util.client);
    }

    static distributePlayers(message, captains, playerList, client) {
        captains.forEach(function (v) {
            if (v.length < 2) {
                console.log(playerList);
                v.push(...playerList.splice(Math.floor(Math.random() * playerList.length)));
            }
        });
        console.log(captains);
        if (playerList.length > 0) {
            this.distributePlayers(message, captains, playerList, client);
        } else {
            let mstr = "```";
            let i = 1;
            captains.forEach(function (v, k) {
                mstr = mstr + "Team " + i + ": " + util.convertIdToTag(k.id) + ", ";
                v.forEach(function (player, i) {
                    mstr = mstr + util.convertIdToTag(player.id);
                    if (i < v.length - 1) {
                        mstr = mstr + ",";
                    }
                    mstr = mstr + " ";
                });
                console.log(v);
                mstr = mstr + "\n";
                i++;
            });
            console.log(mstr);
            message.reply(mstr + "```");
        }
    }
}

module.exports = {
    mainQueue: new GameQueue(),
};

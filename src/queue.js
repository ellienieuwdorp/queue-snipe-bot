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
            return;
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

    /**
     * Generates teams and returns them as a list of player lists
     *
     * @param {Boolean} randomize If true randomizes the player list so that teams will be different
     */
    distribute(randomize) {
        if (randomize) {
            util.shuffle(this.playerList_);
        }

        const teams = [];

        // Generate one team for each captain
        for (const player of this.playerList_) {
            if (player.isCaptain()) {
                teams.push([player]);
            }
        }

        let currentTeam = 0;

        // Create more teams if needed
        if (teams.length * 3 < this.playerList_.length) {
            // Fill empty teams at the end first
            currentTeam = teams.length;

            const newTeams = Math.ceil(this.playerList_.length / 3.0) - teams.length;
            for (let i = 0; i < newTeams; i++) {
                teams.push([]);
            }
        }

        // Distribute non captains to teams
        for (const player of this.playerList_) {
            if (!player.isCaptain()) {
                teams[currentTeam].push(player);

                currentTeam++;
                if (currentTeam >= teams.length) {
                    currentTeam = 0;
                }
            }
        }

        console.log(teams);

        return teams;
    }
}

module.exports = {
    mainQueue: new GameQueue(),
};

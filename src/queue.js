const { CommandoClient } = require('discord.js-commando');
const util = require('./util.js');

class GameQueue {
    constructor() {
        this.playerList = [];
        this.captainList = [];
    }

    get playerList() {
        return this.playerList;
    }

    get captainList() {
        return this.captainList;
    }

    addPlayer(player) {
		if (this.isPlayerListFull()) {
			throw 'The queue is full.';
		}
		if (this.playerList.includes(player)) {
			throw 'Player(s) already present in queue.';
        }
		this.playerList = [...this.playerList, player];
    }

    addPlayers(players) {
		if (!this.isRoomForPlayers()) {
			throw 'Unable to add ' + players.length + ' players to the queue.';
		}
		players.each(player => this.addPlayer(player));
    }

	isPlayerListFull() {
		return this.playerList.length >= (this.captainList.length * 2);
    }
    
    isRoomForPlayers(amount) {
		if ((this.captainList.length * 2) - (this.playerList.length + amount)) {
			return false;
		}
		return true;
    }

    removePlayer(player) {
		const index = this.playerList.indexOf(player);
		if (index === -1) {
			throw 'Attemped to remove a player from the queue that\'s not in the queue.';
		}
		this.playerList.splice(index, 1);
    }

    addCaptain(captain) {
		if (this.captainList.includes(captain)) {
			throw 'Player(s) already present in captain list.';
		}
		this.captainList = [...this.captainList, captain];
    }

    addCaptains(captains) {
		if (captains.size > 0) {
			captains.each(captain => this.addCaptain(captain));
		}
    }
    
	removeCaptain(captain) {
		const index = this.captainList.indexOf(captain);
		if (index === -1) {
			throw 'Attemped to remove a player from the queue that\'s not in the queue.';
		}

		this.captainList.splice(index, 1);
    }
    
	removeCaptains(captains) {
		if (captains.size > 0) {
			captains.each(captain => this.removeCaptain(captain));
		}
    }
    
	removePlayers(players) {
		if (players.size > 0) {
			players.each(player => this.removePlayer(player));
		}
    }
    
	resetLists() {
		this.playerList = [];
		this.captainList = [];
    }
    
	getReadableCaptainList() {
		const s = [];
		this.captainList.forEach(captain => {
			s.push(this.convertIdToTag(captain.id));
		});
		return this.concatArray(s);
    }
    
	getReadablePlayerList() {
		const s = [];
		this.playerList.forEach(player => {
			s.push(this.convertIdToTag(player.id));
		});
		return this.concatArray(s);
    }
    
    distribute(message) {
		const captains = new Map();
		this.captainList.forEach(function(v) {
			captains.set(v, []);
		});
		this.distributePlayers(message, captains, this.playerList, this.client);
    }
    
	distributePlayers(message, captains, playerList, client) {
		captains.forEach(function(v) {
			if (v.length < 2) {
				console.log(playerList);
				v.push(
					...playerList.splice(Math.floor(Math.random() * playerList.length)),
				);
			}
		});
		console.log(captains);
		if (playerList.length > 0) {
			this.distributePlayers(message, captains, playerList, client);
		}
		else {
			let mstr = '```';
			let i = 1;
			captains.forEach(function(v, k) {
				mstr = (mstr + 'Team ' + i + ': ' + client.users.cache.get(k.id).tag) + ', ';
				v.forEach(function(player, i) {
					mstr = mstr + client.users.cache.get(player.id).tag;
					if (i < v.length - 1) {
						mstr = mstr + ',';
					}
					mstr = mstr + ' ';
				});
				console.log(v);
				mstr = mstr + '\n';
				i++;
			});
			console.log(mstr);
			message.reply(mstr + '```');
		}
    }
}

module.exports = {
    queue = new GameQueue()
};
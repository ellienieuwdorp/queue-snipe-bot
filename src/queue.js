const { CommandoClient } = require('discord.js-commando');
const util = require('./util.js');

class GameQueue {
    constructor() {
        this._playerList = [];
        this._captainList = [];
    }

    get playerList() {
        return this._playerList;
    }

    get captainList() {
        return this._captainList;
    }

    addPlayer(player) {
		if (this.isPlayerListFull()) {
			throw 'The queue is full.';
		}
		if (this._playerList.includes(player)) {
			throw 'Player(s) already present in queue.';
        }
		this._playerList = [...this._playerList, player];
    }

    addPlayers(players) {
		if (!this.isRoomForPlayers()) {
			throw 'Unable to add ' + players.length + ' players to the queue.';
		}
		players.each(player => this.addPlayer(player));
    }

	isPlayerListFull() {
		return this._playerList.length >= (this._captainList.length * 2);
    }
    
    isRoomForPlayers(amount) {
		if ((this._captainList.length * 2) - (this._playerList.length + amount)) {
			return false;
		}
		return true;
    }

    removePlayer(player) {
		const index = this._playerList.indexOf(player);
		if (index === -1) {
			throw 'Attemped to remove a player from the queue that\'s not in the queue.';
		}
		this._playerList.splice(index, 1);
    }

    addCaptain(captain) {
		if (this._captainList.includes(captain)) {
			throw 'Player(s) already present in captain list.';
		}
		this._captainList = [...this._captainList, captain];
    }

    addCaptains(captains) {
		if (captains.size > 0) {
			captains.each(captain => this.addCaptain(captain));
		}
    }
    
	removeCaptain(captain) {
		const index = this._captainList.indexOf(captain);
		if (index === -1) {
			throw 'Attemped to remove a player from the queue that\'s not in the queue.';
		}

		this._captainList.splice(index, 1);
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
    
	resetQueue() {
		this._playerList = [];
		this._captainList = [];
    }
    
	getReadableCaptainList() {
		const s = [];
		this._captainList.forEach(captain => {
			s.push(util.convertIdToTag(captain.id));
		});
		return util.concatArray(s);
    }
    
	getReadablePlayerList() {
		const s = [];
		this._playerList.forEach(player => {
			s.push(util.convertIdToTag(player.id));
		});
		return util.concatArray(s);
    }
    
    distribute(message) {
		const captains = new Map();
		this._captainList.forEach(function(v) {
			captains.set(v, []);
		});
		this.distributePlayers(message, captains, this._playerList, this.client);
    }
    
	static distributePlayers(message, captains, playerList, client) {
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
    main_queue: new GameQueue()
};
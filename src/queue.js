const util = require('./util.js');

class GameQueue {
	constructor() {
		// @private
		this.playerList_ = [];

		// @private
		this.captainList_ = [];
	}

	getPlayerList() {
		return this.playerList_;
	}

	getCaptainList() {
		return this.captainList_;
	}

	addPlayer(player) {
		if (this.isPlayerListFull()) {
			throw 'The queue is full.';
		}
		if (this.playerList_.includes(player)) {
			throw 'Player(s) already present in queue.';
		}
		this.playerList_ = [...this.playerList_, player];
	}

	addPlayers(players) {
		if (!this.isRoomForPlayers()) {
			throw 'Unable to add ' + players.length + ' players to the queue.';
		}
		players.each(player => this.addPlayer(player));
	}

	isPlayerListFull() {
		return this.playerList_.length >= (this.captainList_.length * 2);
	}

	isRoomForPlayers(amount) {
		if ((this.captainList_.length * 2) - (this.playerList_.length + amount)) {
			return false;
		}
		return true;
	}

	removePlayer(player) {
		const index = this.playerList_.indexOf(player);
		if (index === -1) {
			throw 'Attemped to remove a player from the queue that\'s not in the queue.';
		}
		this.playerList_.splice(index, 1);
	}

	removePlayers(players) {
		if (players.size > 0) {
			players.each(player => this.removePlayer(player));
		}
	}

	addCaptain(captain) {
		if (this.captainList_.includes(captain)) {
			throw 'Player(s) already present in captain list.';
		}
		this.captainList_ = [...this.captainList_, captain];
	}

	addCaptains(captains) {
		if (captains.size > 0) {
			captains.each(captain => this.addCaptain(captain));
		}
	}

	removeCaptain(captain) {
		const index = this.captainList_.indexOf(captain);
		if (index === -1) {
			throw 'Attemped to remove a player from the queue that\'s not in the queue.';
		}

		this.captainList_.splice(index, 1);
	}

	removeCaptains(captains) {
		if (captains.size > 0) {
			captains.each(captain => this.removeCaptain(captain));
		}
	}

	resetQueue() {
		this.playerList_ = [];
		this.captainList_ = [];
	}

	getReadableCaptainList() {
		const s = [];
		this.captainList_.forEach(captain => {
			s.push(util.convertIdToTag(captain.id));
		});
		return util.concatArray(s);
	}

	getReadablePlayerList() {
		const s = [];
		this.playerList_.forEach(player => {
			s.push(util.convertIdToTag(player.id));
		});
		return util.concatArray(s);
	}

	distribute(message) {
		const captains = new Map();
		this.captainList_.forEach(function(v) {
			captains.set(v, []);
		});
		GameQueue.distributePlayers(message, captains, this.playerList_, this.client);
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
	mainQueue: new GameQueue(),
};

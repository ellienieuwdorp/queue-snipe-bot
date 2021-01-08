const { CommandoClient } = require('discord.js-commando');

module.exports = {
	playerList: [],
	captainList: [],
	client: new CommandoClient({
		commandPrefix: '!',
		owner: '124993035577720832',
	}),
	getPlayerList: function() {
		return this.playerList;
	},
	getCaptainList: function() {
		return this.captainList;
	},
	addPlayer: function(player) {
		if (this.isPlayerListFull()) {
			throw 'The queue is full.';
		}
		this.playerList = [...this.playerList, player];
	},
	addPlayers: function(players) {
		if (!this.isRoomForPlayers()) {
			throw 'Unable to add ' + players.length + ' players to the queue.';
		}
		players.each(player => this.addPlayer(player));
	},
	isRoomForPlayers: function(amount) {
		if ((this.captainList.length * 2) - (this.playerList.length + amount)) {
			return false;
		}
		return true;
	},
	removePlayer: function(player) {
		const index = this.playerList.indexOf(player);
		if(index === -1) {
			throw 'Attemped to remove a player from the queue that\'s not in the queue.';
		}
		this.playerList.splice(index, 1);
	},
	addCaptain: function(captain) {
		this.captainList = [...this.captainList, captain];
	},
	addCaptains: function(captains) {
		if (captains.size > 0) {
			captains.each(captain => this.addCaptain(captain));
		}
	},
	removeCaptain: function(captain) {
		const index = this.captainList.indexOf(captain);
		if (index === -1) {
			throw 'Attemped to remove a player from the queue that\'s not in the queue.';
		}

		this.captainList.splice(index, 1);
	},
	removeCaptains: function(captains) {
		if (captains.size > 0) {
			captains.each(captain => this.removeCaptain(captain));
		}
	},
	removePlayers: function(players) {
		if (players.size > 0) {
			players.each(player => this.removePlayer(player));
		}
	},
	isPlayerListFull: function() {
		return this.playerList.length >= (this.captainList.length * 2);
	},
	resetLists: function() {
		this.playerList = [];
		this.captainList = [];
	},
	getReadableCaptainList: function() {
		const s = [];
		this.captainList.forEach(captain => {
			s.push(this.convertIdToTag(captain.id));
		});
		return this.concatArray(s);
	},
	getReadablePlayerList: function() {
		const s = [];
		this.playerList.forEach(player => {
			s.push(this.convertIdToTag(player.id));
		});
		return this.concatArray(s);
	},
	concatArray: function(arr) {
		let s = '';
		arr.forEach(function(v, n) {
			s = s + v;
			if (arr.length > n + 1) s = s + ', ';
		});
		return s;
	},
	// convert id to Discord user mentionable
	convertIdToTag: function(id) {
		return this.client.users.cache.get(id).toString();
	},
	// convert id to Discord channel nickname
	convertIdToNick: function(id) {
		return this.client.users.cache.get(id).tag;
	},
	distribute: function(message) {
		const captains = new Map();
		this.captainList.forEach(function(v) {
			captains.set(v, []);
		});
		this.distributePlayers(message, captains, this.playerList, this.client);
	},
	distributePlayers: function(message, captains, playerList, client) {
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
	},
};
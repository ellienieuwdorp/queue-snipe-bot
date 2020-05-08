# community-queues
Discord bot intended to simplify queue sniping in Apex Legends using a system of party leaders.

## Setup instructions
1. ```yarn install```
2. Add discord bot token to ```.env```
3. ```yarn start```

## Contributing
For any lovelies from the server who would like to contribute, the general idea of the application is as follows:

Using a command, mods will be able to add and remove team captains.

Using a command, users should be able to join the list of players. The length of this list should not be able to exceed the amount of team captains times 2 as this will be the amount of free spots available.

Using a command, mods should be able to distribute the queued players among the team captains randomly. Ideally this will when done also somewhat fancily (potentially using markdown tables) print the results to chat somewhere.

Using a command, mods should be able to clear the list of players.

Using a command, mods should be able to clear the list of team captains.

Using a command, mods should be able to remove players from the player list.

That's the basics for now, based on how this works in practise we can consider adding things like auto-moving users to voice channels, or maybe even a TTS countdown by the bot, or maybe none of this will be necessary :)
Any and all feedback is welcome, and feel free to make a pull request!
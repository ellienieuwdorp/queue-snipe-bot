# community-queues

Discord bot intended to simplify queue sniping in Apex Legends using a system of party leaders.

## Refactor TO-DO
### Absolutely necessary
* Implement permission for admin commands (done)
### Important
* Make sure duplicates can't be added to the queue as in captains and players or vice versa (player can't be added to captains if they're a player, cant be added to captains if player)
### Afterwards
* Better error handling (to be expanded)
* Automated testing
* Remove envy and just use native environment vars

## Manual setup instructions

1. `npm install`
2. Add discord bot token to `.env`
3. `npm start`

## Docker setup instructions
If you'd like to run the bot in a docker container, you can do so using docker or docker-compose

### docker-compose (recommended)
1. Clone the repository: `git clone https://github.com/luuknieuwdorp/community-queues.git`
2. `cd community-queues`
3. Change the YOUR_BOT_TOKEN environment variable in `docker-compose.yml` to your Discord bot token.
4. `docker-compose up -d`

### docker
1. Clone the repository: `git clone https://github.com/luuknieuwdorp/community-queues.git`
2. `cd community-queues`
3. Build the docker image, where IMAGE_NAME is the name you can specify for the built docker image: `docker build -t IMAGE_NAME .`
4. Run the docker image: `docker run -d IMAGE_NAME --env BOT_TOKEN=YOUR_BOT_TOKEN`

Run `docker ps` or `docker logs CONTAINER_NAME` to check the status/logs of the container.

## Contributing

### Coding standards

We are using the google style guide, see: https://google.github.io/styleguide/jsguide.html

We are using https://prettier.io for automated code formatting. Refer to https://prettier.io/docs/en/editors.html to integrate it in to your editor of choice.

### Project info

For anyone from the server or elsewhere who would like to contribute, the general idea of the application is as follows:

- Using a command, mods will be able to add and remove team captains.

- Using a command, users should be able to join the list of players. The length of this list should not be able to exceed the amount of team captains times 2 as this will be the amount of free spots available.

- Using a command, mods should be able to distribute the queued players among the team captains randomly. Ideally this will when done also somewhat fancily (potentially using markdown tables) print the results to chat somewhere.

- Using a command, mods should be able to clear the list of players.

- Using a command, mods should be able to clear the list of team captains.

- Using a command, mods should be able to remove players from the player list.

That's the basics for now, based on how this works in practise we can consider adding things like auto-moving users to voice channels, or maybe even a TTS countdown by the bot, or maybe none of this will be necessary :)
Any and all feedback is welcome, and feel free to make a pull request or make an issue to discuss any changes or additions.

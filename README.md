Telegram Queue Bot
===

Telegram Bot for creating randomized queue from students list from group TI-81

By Alex Solomaha ([@CyanoFresh](https://t.me/cyanofresh))

### Features

- [x] randomized queue (c.o.)
- [x] authentication - only specified chat_ids can manage queues
- [x] stickers - reply with stickers (triggered by name or random) for fun
- [x] persistence - save and load queues from json database file
- [x] webhooks - CPU and network optimizations
- [ ] edit group list according to chat (so not only TI-81 list can be used)
- [ ] current queue status (which number is last)

### Installation

1. Clone repo
2. Configure environmental variables (look `.env.example`)
3. `npm start`

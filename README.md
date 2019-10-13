Telegram Queue Bot
===

Telegram Bot for creating randomized queue from students list from group TI-81

By Alex Solomaha ([@CyanoFresh](https://t.me/cyanofresh))

### Features

- [x] Randomized Queue
- [x] Authorization - only specified chat_ids can manage queues
- [x] Stickers - reply with stickers (triggered by name or random) for fun (java = держи жабу)
- [x] Persistence - save and load queues from json database file
- [x] WebHooks - CPU and network optimizations
- [ ] User list corresponds to chat (not only TI-81 students list can be used)
- [ ] /done command for users

### Installation

1. Clone repo && cd to it
2. Configure environmental variables:
    * For development: `cp .env.example`
    * For production: see `.env.example` for available parameters
3. `npm start`

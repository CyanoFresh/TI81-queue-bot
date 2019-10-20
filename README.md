Telegram Queue Bot
===

Telegram Bot for creating randomized queue from students list from group TI-81

You can find bot here: [@ti81_queue_bot](https://t.me/ti81_queue_bot)

By Alex Solomaha ([@CyanoFresh](https://t.me/cyanofresh))

Feel free to contribute :)

## Features

- [x] Randomized Queue
- [x] Persistence - save and load queues from json database file
- [x] Stickers - reply with stickers (triggered by name or random) for fun (java = держи жабу)
- [x] Authentication by chat_id for admin and users commands
- [x] Telegram WebHooks - CPU and network optimization
- [x] /done command for users
- [x] Use Telegram's inline buttons for navigation
- [ ] Better architecture - separate index.js into smaller files
- [ ] Use `telegraf/micro` for lambda-like services
- [ ] KPI rozklad parser
- [ ] Universal students list

You can help by submitting a PR

## Installation

1. Clone repo && cd to it
2. Configure environmental variables:
    * For development: `cp .env.example`
    * For production: see `.env.example` for available parameters
3. `npm start`

### Nginx and Webhooks

1. Configure environmental variables for webhooks: domain and port
2. Configure domain in nginx
3. Obtain a certificate from Let's Encrypt
4. Configure nginx for the bot. Example config:

    ```conf
   server {
       if ($host = tg.solomaha.com) {
           return 301 https://$host$request_uri;
       } # managed by Certbot

       listen 80;
       server_name tg.solomaha.com;
       
       return 404; # managed by Certbot
   }

   server {
       server_name tg.solomaha.com;

       location / {
           proxy_pass http://127.0.0.1:4000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_cache_bypass $http_upgrade;
       }
   
       listen 443 ssl; # managed by Certbot
       ssl_certificate /etc/letsencrypt/live/tg.solomaha.com/fullchain.pem; # managed by Certbot
       ssl_certificate_key /etc/letsencrypt/live/tg.solomaha.com/privkey.pem; # managed by Certbot
       include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
       ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
   }
    ```

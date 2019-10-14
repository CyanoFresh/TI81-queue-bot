Telegram Queue Bot
===

Telegram Bot for creating randomized queue from students list from group TI-81

By Alex Solomaha ([@CyanoFresh](https://t.me/cyanofresh))

Feel free to contribute :)

## Features

- [x] Randomized Queue
- [x] Authorization - only specified chat_ids can manage queues
- [x] Stickers - reply with stickers (triggered by name or random) for fun (java = держи жабу)
- [x] Persistence - save and load queues from json database file
- [x] WebHooks - CPU and network optimizations
- [x] /done command for users
- [x] Use Telegram's inline buttons for navigation
- [ ] User list corresponds to chat (not only TI-81 students list can be used)

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
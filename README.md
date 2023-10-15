# AI Telegram bot with power of ChatGPT

This project was written to organize communication between ChatGPT and Telegram users.
There is still a lot of work to be done, so I would be glad if you want to fork my project and update it!

#### Stack

- Node(18x)
- Typescript
- GRPC
- Postgres
- Redis
- TypeORM
- Telegraf

____

## Requirements and prerequisites

- Docker with compose plugin
- Correctly configured .env file
- Almost any unix system (tested on ubuntu)

____

1. Run this:
   ``` bash
       cp .env.example .env
   ```
2. Edit .env:
    - Add bot, ChatGPT and yookassa tokens
    - Set bot name, add support url if you want to
    - Proper configuration
3. Finally, build the application:
   ```bash
   docker compose up -d --build
   ```

_It's recommended to use Alpine versions on Node.js_

## To use in dev purposes or without containerizing

```bash
ln -s .env client
ln -s .env microservices/subscription_service
```

Then ensure you'd created all required instances(Redis and Postgres), added correct paths in env

```
yarn start:dev # In client/ and microservices/subscription_service/
```

## About GRPC communication:

The proto files have been moved to a separate [repo](https://github.com/kopetann/ai_tg_bot_proto) (as all services use
the same protos)

# AI Telegram bot with power of ChatGPT
That project was written to organize communication between ChatGPT and Telegram users
There is much stuff to do, so i will be glad if you want to fork my project and update it!

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
_It's recommended to use Alpine versions on NodeJS_

# Making protos
*Note*: Protos are built by default, but if you want to add something feel free to edit:)

- First-steps

~~~ bash
npm install -g grpc-tools
~~~

``` bash
grpc_tools_node_protoc --proto_path=./proto --ts_proto_opt=useOptionals=repeated --ts_proto_opt=addNestjsRestParameter=true --ts_proto_opt=removeEnumPrefix=members --ts_proto_opt=returnObservable=true --ts_proto_opt=initializeFieldsAsUndefined=false --ts_proto_opt=unrecognizedEnum=false --ts_proto_opt=stringEnums=true --ts_proto_opt=fileSuffix=.pb --ts_proto_opt=nestJs=true --ts_proto_out=./proto/build --grpc_out=/proto/build --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` ./proto/subscription_service.proto
```
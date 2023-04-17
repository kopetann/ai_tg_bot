# Making protos
-----------------------

- First-steps

~~~ bash
npm install -g grpc-tools
~~~

``` bash
grpc_tools_node_protoc --proto_path=./proto --ts_proto_opt=useOptionals=repeated --ts_proto_opt=addNestjsRestParameter=true --ts_proto_opt=removeEnumPrefix=members --ts_proto_opt=returnObservable=true --ts_proto_opt=initializeFieldsAsUndefined=false --ts_proto_opt=unrecognizedEnum=false --ts_proto_opt=stringEnums=true --ts_proto_opt=fileSuffix=.pb --ts_proto_opt=nestJs=true --ts_proto_out=./proto/build --grpc_out=/proto/build --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin` ./proto/subscription_service.proto

```
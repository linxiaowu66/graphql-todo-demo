## demo介绍
该demo是学习graphql基础的，里面包含了使用基础包graphql-js实现功能，以及apollo-graphql实现功能，以及使用apollo-graphql实现发布订阅功能

## 项目技术栈

1. 使用create-react-app创建前端代码

    1.1 使用apollo全家桶完善一个带有TODO功能的页面

    1.2 使用RR4带有路由功能

    1.3 未使用的功能有：graphql的缓存功能、mock数据的功能、性能的测试

2. 使用apollo-server-express启动服务器

    2.1 使用MongoDB做数据库存储

    2.2 支持数据修改通知功能

    2.3 有playgroundf功能，可以辅助测试接口

    2.4 不具备完整的线上运行要求，只推荐在本地调试使用


## 项目启动

graphql-js: `node express-graphql.js`

apollo-graphql(不带订阅功能): `node apollo-graphql.js`

apollo-graphql(带订阅功能):

```
cd client && npm install && npm run build
cd server && node apollo-graphql-pubsub.js

```

## 基础知识

为了看懂这3个demo,可以参考我的系列文章:

1. []()


2. []()

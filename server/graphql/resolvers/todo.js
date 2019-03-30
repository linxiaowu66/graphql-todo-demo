const R = require('ramda')
const {
  withFilter,
  PubSub
} = require('graphql-subscriptions')
const TODOS_CHANGED = 'TODOS_CHANGED';

const ACTIONS = {
  CREATE: 'ACTIONS_CREATE',
  UPDATE: 'ACTIONS_UPDATE',
  DELETE: 'ACTIONS_DELETE',
  TOGGLE_ALL: 'ACTIONS_TOGGLE_ALL',
}
const pubsub = new PubSub()

// 将pubsub放在context下，不知道为啥这里的subscribe拿不到这个context?

// I export my querys and mutations to join with the other resolvers
module.exports = {
  Subscription: {
    todoChanged: {
      resolve: R.prop('action'),
      subscribe: withFilter(
        (obj, args, context) => {
          return pubsub.asyncIterator(TODOS_CHANGED)
        },
        (payload, variables) => payload.clientID !== variables.filter,
      ),
    }
  },
  Query: {
    todos: async (root, {}, {
      models: {
        todolist
      }
    }) => {
      return await todolist.find().sort({ updateTime: 1});
    }
  },

  Mutation: {
    createTodo: async (root, {
      title
    }, {
      models: {
        todolist
      },
      clientID
    }) => {
      const id = require('uuid/v4')()
      console.log('....>>>', id)
      let newItem = new todolist({
        title,
        complete: false,
        id,
        updateTime: Date.now()
      });

      await newItem.save()

      const item = await todolist.findById(newItem._id);
      pubsub.publish(TODOS_CHANGED, {
        action: { payload: [item], type: ACTIONS.CREATE },
        clientID,
      });

      return item
    },
    updateTodo: async (root, {
      payload
    }, {
      models: {
        todolist
      },
      clientID
    }) => {
      const { id, complete, title } = payload


      if (title) {
        await todolist.updateOne({ id }, {
          id,
          title,
          updateTime: Date.now()
        })
      } else {
        await todolist.updateOne({ id }, {
          complete,
          updateTime: Date.now()
        })
      }
      const item = await todolist.findOne({ id })

      pubsub.publish(TODOS_CHANGED, {
        action: { payload: [item], type: ACTIONS.UPDATE },
        clientID,
      });

      return item
    },
    toggleAll: async (root, {
      complete
    }, {
      models: {
        todolist
      }, clientID
    }) => {
      const list = await todolist.find()

      const notMatchStatusList = list.filter(item => item.complete !== complete)

      await Promise.all(notMatchStatusList.map(it => todolist.updateOne({ id: it.id }, { id: it.id, complete, updateTime: Date.now() })))

      pubsub.publish(TODOS_CHANGED, {
        action: {
          payload: [{ complete }],
          type: ACTIONS.TOGGLE_ALL,
        },
        clientID,
      });

      return { complete }
    },
    deleteTodos: async (root, { ids }, {
      models: {
        todolist,
      },
      clientID
    }) => {
      await Promise.all(ids.map(id => todolist.deleteOne({ id })))
      pubsub.publish(TODOS_CHANGED, {
        action: {
          payload: ids.map(id => ({ id })),
          type: ACTIONS.DELETE,
        },
        clientID,
      });
      return ids
    }
  }
}

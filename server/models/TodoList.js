const moongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const Schema = moongoose.Schema;

const TodoSchema =  new Schema({
    title: {
      type: String,
      required: [true, 'title is necessary']
    },
    complete: {
      type: Boolean,
      require: true
    },
    id: {
      type: String,
      require: true
    },
    updateTime: {
      type: Date,
      required: true
    }
});


TodoSchema.plugin(uniqueValidator, { message: '{PATH} it must be unique' });

exports.todolist = moongoose.model('todolist', TodoSchema);

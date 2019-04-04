import React, {  } from 'react'
import { Switch, Route } from 'react-router-dom'
import { compose } from 'react-apollo'
import TodoList from '../TodoList'
import TodoListFooter from '../../components/Footer'
import TodoTextInput from '../../components/Input'
import routes from '../../routes'
import { withTodos, withToggleAll, withCreateTodo, withDeleteTodos } from '../../graphql'

class Layout extends React.Component {

  static propTypes = {
    // viewer: PropTypes.object.isRequired,
    // children: PropTypes.element.isRequired,
  }

  // constructor(props) {
  //   super(props)
  // }
  componentDidMount() {
    const clientID = window.localStorage.getItem('Linxiaowu66-Client-ID');
    this.props.subscribeTodoChanged(clientID)
  }

  _handleTextInputSave = (text) => {
    if (text.length !== 0) this.props.createTodo({ title: text });
  }

  _handleDeleteCompletedItems = (items) => {
    this.props.deleteTodos(items)
  }
  _handleMarkAll = (numRemainingTodos) => {
    const newStatus = numRemainingTodos !== 0

    this.props.toggleAll(newStatus)
  }

  render () {
    const todos = this.props.todos.todos || []
    console.log(todos)
    const numRemainingTodos = todos.filter((x) => !x.complete).length
    return (
      <div>
        <section className='todoapp'>
          <header className='header'>
            <h1>
              todos
            </h1>
            <span>
              <input
                type='checkbox'
                checked={numRemainingTodos === 0}
                className='toggle-all'
                readOnly
              />
              <label onClick={() => this._handleMarkAll(numRemainingTodos)} />
            </span>

            <TodoTextInput
              autoFocus
              className='new-todo'
              onSave={this._handleTextInputSave}
              placeholder='What needs to be done?'
            />
          </header>

          <Switch>
            {routes.map((route, index) => (
              <Route
                key={index}
                onClick={() => alert(1)}
                path={route.path}
                exact
                render={(props) => <TodoList {...props} todoList={todos} />}
              />
            ))}
          </Switch>

          <TodoListFooter
            allTodoList={todos}
            deleteCompletedItems={this._handleDeleteCompletedItems}
          />
        </section>
        <footer className='info'>
          <p>
            Double-click to edit a todo
          </p>
          <p>
            Created by the <a href='https://github.com/linxiaowu66'>
              linxiaowu66
            </a>
          </p>
          <p>
            Part of <a href='http://todomvc.com'>TodoMVC</a>
          </p>
        </footer>
      </div>
    )
  }
}

export default compose(withTodos, withCreateTodo, withToggleAll, withDeleteTodos)(Layout);

import React, {  } from 'react'
import TodoItem from '../../components/Item'

export default class TodoList extends React.Component {

  // static propTypes = {
  //   viewer: PropTypes.object.isRequired,
  //   params: PropTypes.object.isRequired,
  // }

  renderTodos () {
    const { pathname } = this.props.location

    const todoList = pathname === '/' ?
      this.props.todoList : pathname === '/active' ?
        this.props.todoList.filter(item => !item.complete) : this.props.todoList.filter(item => item.complete)
    return todoList
      .map((item) =>
        <TodoItem
          key={item.id}
          todo={item}
        />
      )
  }

  render () {
    return (
      <section className='main'>
        <ul className='todo-list'>
          {this.renderTodos()}
        </ul>
      </section>
    )
  }
}

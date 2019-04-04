import { Link, withRouter } from 'react-router-dom'
import React, {  } from 'react'

class TodoListFooter extends React.Component {

  static propTypes = {
    // viewer: PropTypes.object.isRequired,
  }

  _handleRemoveCompletedTodosPress = () => {
    const completedTodos = this.props.allTodoList.filter((x) => x.complete)

    this.props.deleteCompletedItems(completedTodos)
  }

  render () {
    const numRemainingTodos = this.props.allTodoList.filter((x) => !x.complete).length
    const numCompletedTodos = this.props.allTodoList.filter((x) => x.complete).length
    const { pathname } = this.props.location
    return (
      <footer className='footer'>
        <span className='todo-count'>
          <strong>{numRemainingTodos}</strong> item{numRemainingTodos === 1 ? '' : 's'} left
        </span>
        <ul className='filters'>
          <li>
            <Link to='/' className={ pathname === '/' ? 'selected' : '' } >All</Link>
          </li>
          <li>
            <Link to='/active' className={ pathname === '/active' ? 'selected' : '' }>Active</Link>
          </li>
          <li>
            <Link to='/completed' className={ pathname === '/completed' ? 'selected' : '' }>Completed</Link>
          </li>
        </ul>
        {numCompletedTodos > 0 &&
          <span onClick={this._handleRemoveCompletedTodosPress} className='clear-completed'>
            Clear completed
          </span>
        }
      </footer>
    )
  }
}

export default withRouter(TodoListFooter)

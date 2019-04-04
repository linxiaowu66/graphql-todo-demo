import React, {  } from 'react'
import classnames from 'classnames'
import { compose } from 'react-apollo'
import TodoTextInput from './Input'
import { withEditTodo, withToggleTodo, withDeleteTodos } from '../graphql'

class TodoItem extends React.Component {

  static propTypes = {
    // todo: PropTypes.object.isRequired,
    // viewer: PropTypes.object.isRequired,
  }

  state = {
    isEditing: false,
  }

  _handleCompleteChange = (e) => {
    const complete = e.target.checked
    this.props.toggleTodo({ id: this.props.todo.id, complete })
  }

  _handleDestroyClick = () => {
    this._removeTodo()
  }

  _handleLabelDoubleClick = () => {
    this._setEditMode(true)
  }

  _handleTextInputCancel = () => {
    this._setEditMode(false)
  }

  _handleTextInputDelete = () => {
    this._setEditMode(false)
    this._removeTodo()
  }

  _handleTextInputSave = (title) => {
    this._setEditMode(false)
    this.props.editTodo({ id: this.props.todo.id, title })
  }

  _removeTodo () {
    this.props.deleteTodos([this.props.todo])
  }

  _setEditMode = (shouldEdit) => {
    this.setState({isEditing: shouldEdit})
  }

  renderTextInput () {
    return (
      <TodoTextInput
        className='edit'
        commitOnBlur
        initialValue={this.props.todo.text}
        onCancel={this._handleTextInputCancel}
        onDelete={this._handleTextInputDelete}
        onSave={this._handleTextInputSave}
      />
    )
  }

  render () {
    return (
      <li
        className={classnames({
          completed: this.props.todo.complete,
          editing: this.state.isEditing,
        })}>
        <div className='view'>
          <input
            checked={this.props.todo.complete}
            className='toggle'
            onChange={this._handleCompleteChange}
            type='checkbox'
          />
          <label onDoubleClick={this._handleLabelDoubleClick}>
            {this.props.todo.title}
          </label>
          <button
            className='destroy'
            onClick={this._handleDestroyClick}
          />
        </div>
        {this.state.isEditing && this.renderTextInput()}
      </li>
    )
  }
}

export default compose(withEditTodo, withToggleTodo, withDeleteTodos)(TodoItem);

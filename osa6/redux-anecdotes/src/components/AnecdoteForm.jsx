import {createAnecdote} from "../reducers/anecdoteReducer.js"
import { useDispatch } from 'react-redux'
import { setNotify, emptyNotify} from "../reducers/notificationReducer.js";

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = (event) => {
      event.preventDefault()
      const content = event.target.anecdote.value
      event.target.anecdote.value = ''
      dispatch(createAnecdote(content))

      dispatch(setNotify(`You added ${content}`))
      setTimeout(() => {
            dispatch(emptyNotify())
            }, 5000)

     event.target.anecdote.value = ''
    }

    return (
      <div>
          <h2>create new</h2>
          <form onSubmit={addAnecdote}>
            <div>
                <input name="anecdote"/>
            </div>
            <button type="submit">create</button>
          </form>
      </div>
    )
}

export default AnecdoteForm
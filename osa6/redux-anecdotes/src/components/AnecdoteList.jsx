import {useDispatch, useSelector} from 'react-redux'
import {voteAnecdote} from "../reducers/anecdoteReducer.js";
import Filter from "./Filter.jsx";
import { setNotify, emptyNotify} from "../reducers/notificationReducer.js";

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const vote = (id) => {
        dispatch(voteAnecdote(id))
        const votedAnecdote = anecdotes.find(element => element.id === id)
        dispatch(setNotify(`You voted ${votedAnecdote.content}`))
        setTimeout(() => {
            dispatch(emptyNotify())
            }, 5000)
  }

   const filteredAnecdotes = anecdotes.filter(anecdote =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase()))


  return (
      <div>
      <Filter />
      {filteredAnecdotes
          .sort((a, b) => b.votes - a.votes)
          .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
      </div>
  )
}

export default AnecdoteList
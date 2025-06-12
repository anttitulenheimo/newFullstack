import { useState } from 'react'


const Button = (props) => {
  return (
    <button onClick={props.handleClick}>
      {props.text}
    </button>
  )
}


const Statistics = ({anecdotes, votesArray}) => {

  const maxVotes = votesArray.indexOf(Math.max(...votesArray))

  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[maxVotes]}</p>
      <p>has {votesArray[maxVotes]} votes</p>
    </div>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const generateRandomIndex = () => {
    const randomIndex = Math.floor(Math.random() * anecdotes.length)
    console.log(randomIndex)
    setSelected(randomIndex)
  }

  const [selected, setSelected] = useState(0)
  const [votesArray, setVotesArray] = useState(Array(anecdotes.length).fill(0))

  const voteCounter = () => {
    const updatedVotes = [...votesArray]
    updatedVotes[selected] += 1
    setVotesArray(updatedVotes)
    console.log(votesArray)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p> {anecdotes[selected]}</p>
      <p>has {votesArray[selected]} votes</p>
      <Button
        handleClick={voteCounter}
        text='vote'
      />
      <Button
        handleClick={generateRandomIndex}
        text='next anecdote'
      />
      <Statistics
        anecdotes={anecdotes}
        votesArray={votesArray}
      />
    </div>
  )
}

export default App
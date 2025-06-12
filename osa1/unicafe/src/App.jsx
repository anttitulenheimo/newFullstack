import { useState } from 'react'

const StatisticLine = ( {input, value} ) => {
    return (
        <tr>
            <td>{input}</td>
            <td>{value}</td>
        </tr>
    )
}


const Statistics = ({good, neutral, bad}) => {

    const total = good + neutral + bad
    const average = (good + bad * -1)/ total
    const positive = good / total * 100

    if (total === 0) {
        return (
            <div>
                <p>no feedback given</p>
            </div>
        )
    }

    return (
        <div>
            <h1>statistics</h1>
            <table>
                <tbody>
                    <StatisticLine input={'good'} value={good}></StatisticLine>
                    <StatisticLine input={'neutral'} value={neutral}></StatisticLine>
                    <StatisticLine input={'bad'} value={bad}></StatisticLine>
                    <StatisticLine input={'average'} value={average}></StatisticLine>
                    <StatisticLine input={'positive'} value={positive}></StatisticLine>
                </tbody>
            </table>
        </div>
    )
}

const Button = ( {input, handlerFunction}) => {
    return(
        <button onClick={handlerFunction}>{input}</button>
    )
}



const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGoodClick = () => {
      setGood(good + 1)
  }

  const handleNeutralClick = () => {
      setNeutral(neutral + 1)
  }

  const handleBadClick = () => {
      setBad(bad + 1)
  }



  return (
    <div>
        <div>
          <h1>give feedback</h1>
          <Button input={'good'} handlerFunction={handleGoodClick}></Button>
          <Button input={'neutral'} handlerFunction={handleNeutralClick}></Button>
          <Button input={'bad'} handlerFunction={handleBadClick}></Button>
        </div>
            <Statistics good={good} neutral={neutral} bad={bad}/>
        <div>

        </div>
    </div>

  )
}

export default App
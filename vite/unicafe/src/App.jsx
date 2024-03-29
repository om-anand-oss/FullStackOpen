import { useState } from 'react'

const Title = ({ title }) => <h1>{title}</h1>

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const StatisticLine = ({ value, text }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({ good, neutral, bad }) => {
  const all = good + neutral + bad;
  const average = (good - bad) / all;
  const positive = 100 * good / all;
  if (all === 0)
    return <><div>No feedback given</div></>
  return (
    <table>
      <tbody>
        <StatisticLine value={good} text="good" />
        <StatisticLine value={neutral} text="neutral" />
        <StatisticLine value={bad} text="bad" />
        <StatisticLine value={all} text="all" />
        <StatisticLine value={average} text="average" />
        <StatisticLine value={positive + ' %'} text="positive" />
      </tbody>
    </table>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Title title='give feedback' />
      <Button handleClick={() => { setGood(good + 1) }} text='good' />
      <Button handleClick={() => { setNeutral(neutral + 1) }} text='neutral' />
      <Button handleClick={() => { setBad(bad + 1) }} text='bad' />
      <Title title='statistics' />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
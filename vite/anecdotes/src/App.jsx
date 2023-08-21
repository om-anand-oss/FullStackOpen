import { useState } from 'react'

const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>

const Display = ({ anecdote, votes }) => {
  return (
    <>
      <div>{anecdote}</div>
      <div>has {votes} votes</div>
    </>
  )
}

const Title = ({title}) => {
  return (
    <>
    <h1>{title}</h1>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [selected, setSelected] = useState(0)
  const [highestVotedAnecdote, setHighestVotedAnecdote] = useState(0)
  const [points, setPoints] = useState(new Uint32Array(anecdotes.length))

  const setRandomAnecdote = () => {
    let anecdoteIndex = Math.floor(Math.random() * anecdotes.length)
    // console.log(anecdoteIndex, selected)
    setSelected(anecdoteIndex)
  }

  const incrementPoint = () => {
    const newPoints = [...points]
    newPoints[selected] += 1
    setPoints(newPoints)

    if (newPoints[selected] > newPoints[highestVotedAnecdote]) {
      setHighestVotedAnecdote(selected)
    }
  }

  return (
    <div>
      <Title title='Anecdote of the day' />
      <Display anecdote={anecdotes[selected]} votes={points[selected]} />
      <Button handleClick={incrementPoint} text='vote' />
      <Button handleClick={setRandomAnecdote} text='next anecdote' />
      <Title title='Anecdote with most votes' />
      <Display anecdote={anecdotes[highestVotedAnecdote] } votes={points[highestVotedAnecdote]} />
    </div>
  )
}

export default App
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Parameters from './Parameters'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div className='Container'>
        <h2>Pont Aerien : Calcul Optimal</h2>
        <Parameters></Parameters>
      </div>
    </>
  )
}

export default App

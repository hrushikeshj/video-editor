import { useState } from 'react'
import reactLogo from './assets/react.svg'
import Poc from './poc/Poc'
import './App.css';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Poc/>
    </div>
  )
}

export default App

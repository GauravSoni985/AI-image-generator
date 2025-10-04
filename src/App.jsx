import { useState } from 'react'
import ImageGenerator from "./components/ImageGenerator";
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <ImageGenerator />
    </>
  )
}

export default App

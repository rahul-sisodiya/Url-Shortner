import { useState } from 'react'
// import './App.css'
import UrlShortner from "./components/UrlShortner.jsx";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <UrlShortner/>
    </>
  )
}

export default App

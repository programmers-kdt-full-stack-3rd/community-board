import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import TestMain from './component/TestMain/TestMain'
import User from './component/User/User'
import Board from './component/Board/Board'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestMain />}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/board" element={<Board/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

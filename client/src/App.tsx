import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import TestMain from './component/TestMain/TestMain'
import User from './component/User/User'
import Posts from './component/Posts/Posts'
import Tests from './component/TestMain/Tests'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestMain />}/>
        <Route path="/user" element={<User/>}/>
        <Route path="/test" element={<Tests/>}/>
        <Route path="/posts" element={<Posts/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App

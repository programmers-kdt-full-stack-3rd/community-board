import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import TestMain from "./component/TestMain/TestMain";
import User from "./page/User/User";
import Posts from "./component/Posts/Posts";
import Tests from "./component/TestMain/Tests";
import Login from "./page/User/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TestMain />} />
        <Route path="/user" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test" element={<Tests />} />
        <Route path="/posts" element={<Posts />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import User from "./page/User/User";
import Posts from "./component/Posts/Posts";
import Tests from "./component/TestMain/Tests";
import Login from "./page/User/Login";
import PostInfoPage from './page/Posts/PostInfoPage';
import Join from "./page/User/Join";
import Main from "./page/Main/Main";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/user" element={<User />} />
        <Route path="/login" element={<Login />} />
        <Route path="/join" element={<Join />} />
        <Route path="/test" element={<Tests />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/post/:id" element={<PostInfoPage />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

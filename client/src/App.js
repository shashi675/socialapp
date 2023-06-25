
import Home from "./pages/home/Home";
import Navbar from "./components/navbar/Navbar";
import Leftbar from './components/leftbar/Leftbar';
import Rightbar from './components/rightbar/Rightbar';
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Profile from './pages/profile/Profile';
import UpdateProfile from './pages/updateProfile/UpdateProfile';
import Friends from './components/friends/Friends';
import Followers from './components/followers/Followers';
import Frequests from './components/friendRequests/Frequests';
import ForgotPass from './pages/forgotPass/ForgotPass';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import './style.scss';
import './app.scss';
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { AuthContext } from "./context/authContext";
import Search from "./components/search/Search";


function App() {
  
  const { darkMode } = useContext(DarkModeContext);
  const { currentUser } = useContext(AuthContext);
  
  const Layout = () => {
    return (
      <div className={`theme-${darkMode ? "dark" : "light"}`}>
        <Navbar />
        <div style={{display: "flex"}} className="layout">
          <Leftbar />
          <div style={{flex: 6}}>
            <Outlet />
          </div>
          <Rightbar />
        </div>
      </div>
    )
  }


  const ProtectedRoute = ({ children }) => {
    if(!currentUser) {
      return <Navigate to='/login' />;
    }
    return children;
  }

  return (
    <div>
    <Router>
        <Routes>
          <Route path='/' element={ <ProtectedRoute><Layout /></ProtectedRoute> }>
            <Route path='/' element={ <Home /> } />
            <Route path='/profile/:id' element={ <Profile /> } />
            <Route path='/updateProfile/:id' element={ <UpdateProfile />} />
            <Route path='/friends' element={<Friends />} />
            <Route path='/followers' element={<Followers />} />
            <Route path='/frequests' element={<Frequests />} />
            <Route path='/search' element={<Search />} />
            {/* <Route path='/search/:text' element={<Search />} /> */}

          </Route>
          <Route path='/login' element={ <Login /> } />
          <Route path='/register' element={ <Register />} />
          <Route path='/resetPass' element={ <ForgotPass />} />
        </Routes>
    </Router>
    </div>
  );
}

export default App;

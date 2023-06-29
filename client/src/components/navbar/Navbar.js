
import './navbar.scss';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import WbSunnyOutlinedIcon from '@mui/icons-material/WbSunnyOutlined';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { DarkModeContext } from '../../context/darkModeContext';
import { AuthContext } from '../../context/authContext';


const Navbar = () => {
    
    const imgUrl = process.env.REACT_APP_IMG_URL;

    const { toggle, darkMode } = useContext(DarkModeContext);
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();


  return (
    <div className='navbar'>
        <div className='left'>
            <Link to='/' style={{ textDecoration:'none' }}>
                <span>SocialApp.</span>
            </Link>
            {darkMode ? <WbSunnyOutlinedIcon onClick={toggle} /> : <DarkModeOutlinedIcon onClick={toggle} />}
            <SearchOutlinedIcon onClick={() => navigate('/search')} />
        </div>
        <div className='right'>
            <div className='user'>
                {currentUser.profilePic !== null && <img src={ imgUrl + currentUser.profilePic } alt=''/>}
                <span>{ currentUser.name }</span>
            </div>
            <button onClick={logout}>logout</button>
        </div>
    </div>
  )
}

export default Navbar

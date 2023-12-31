
import './leftbar.scss';

import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQueries } from '@tanstack/react-query';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const Leftbar = () => {

  const { currentUser } = useContext(AuthContext);
  const url = process.env.REACT_APP_BACKEND_URL;
  const imgUrl = process.env.REACT_APP_IMG_URL;

  const [myFollowers, meFollowing] = useQueries({
    queries: [
      {
        queryKey: ['followers'],
        queryFn: async () => 
          await axios.get(url + "/follower/getMyFollowersDetails?token="+currentUser.token)
          .then((res) => res.data )
        },
      {
        queryKey: ['following'],
        queryFn: async () => 
          await axios.get(url + "/follower?token="+currentUser.token)
          .then((res) => res.data )
        }
      ]
    })
    
  let cnt = 0;
  myFollowers.data?.forEach(follower => {
    if(meFollowing.data?.includes(follower.userId) === false){
      cnt++;
    }
  });

  return (
    <div className='leftbar'>
      <div className='menu'>
        <div className='user'>
          {currentUser.profilePic !== null ? 
            <img src={ imgUrl + currentUser.profilePic} alt='' /> :
            <img src={'/images/defaultProfilePic.png'} alt='' />
          }
          <span>{ currentUser.name }</span>
        </div>
        <div className='item'>
          <Link to={`/profile/${currentUser.uId}`}>
            {currentUser.profilePic !== null ? 
              <img src={ imgUrl + currentUser.profilePic} alt='' /> :
              <img src={'/images/defaultProfilePic.png'} alt='' />
            }
            <span>profile</span>
          </Link>
        </div>
        <div className='item'>
          <Link to={`/friends`}>
            <GroupOutlinedIcon />
            <span>friends</span>
          </Link>
        </div>
        <div className='item'>
          <Link to={`/followers`}>
            <Diversity3Icon />
            <span>followers</span>
          </Link>
        </div>
        <div className='item'>
          <Link to={`/frequests`}>
            <GroupAddIcon />
            <span>follow requests</span>
            {cnt !== 0 && <span className='fol-count'>{cnt}</span>}
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Leftbar

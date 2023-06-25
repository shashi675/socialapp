
import './rightbar.scss';

import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';


const Rightbar = () => {

  const url = process.env.REACT_APP_BACKEND_URL;
  const { currentUser } = useContext(AuthContext);

  const { data: unFollowers } = useQuery(['unfollowers'], async () => {
    const res = await axios.get(url + "/follower/unfollowers?token=" + currentUser.token);
    return res.data;
  });


  const queryClient = useQueryClient();

  const mutation = useMutation((userId) => {
    return axios.post(url + "/follower?token="+currentUser.token, {
    "followedUId": userId
  });
  },  {
      onSuccess: () => {
        // invalidate and refetch:
        queryClient.invalidateQueries("unfollowers");
      },
  })

  const handleClick = (userId) => {
    console.log(userId);
    mutation.mutate(userId);
  }

  return (
    <div className='rightbar'>
      <div className='container'>

        <div className='item'>
          <span>Suggested for You</span>
            {
              unFollowers?.length === 0 ? <div style={{"marginTop": "20px"}}>no users to follow</div> :
               unFollowers?.map(userInfo => {
                return (
                  <div className='user' key={userInfo.userId}>
                    <div className='userInfo'>
                      <img src={"../uploads/" + userInfo.profilePic} alt='' />
                      <Link to={`/profile/${userInfo.userId}`} style={{ textDecoration: "none", color: "inherit"}}>
                          <span className='name'>
                              {userInfo.name}
                          </span>
                      </Link>
                    </div>
                    <div className='divBtns'>
                      <button onClick={() => handleClick(userInfo.userId)}>Follow</button>
                    </div>
                  </div>
                )
              })
            }
        </div>

        {/* <div className='item'>
          <span>Latest activities</span>
          <div className='user'>
            <div className='userInfo'>
              <img src={profilePic} alt='' />
              <p>
                <span>John Doe </span>
                liked your post
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className='user'>
            <div className='userInfo'>
              <img src={profilePic} alt='' />
              <p>
                <span>John Doe </span>
                liked your post
              </p>
            </div>
            <span>1 min ago</span>
          </div>
          <div className='user'>
            <div className='userInfo'>
              <img src={profilePic} alt='' />
              <p>
                <span>John Doe </span>
                liked your post
              </p>
            </div>
            <span>1 min ago</span>
          </div>
        </div>

        <div className='item'>
          <span>Online Friends</span>
          <div className='user'>
            <div className='userInfo'>
              <img src={profilePic} alt='' />
              <div className='online'></div>
              <span>John Doe </span>
            </div>
          </div>
          <div className='user'>
            <div className='userInfo'>
              <img src={profilePic} alt='' />
              <div className='online'></div>
              <span>John Doe </span>
            </div>
          </div>
          <div className='user'>
            <div className='userInfo'>
              <img src={profilePic} alt='' />
              <div className='online'></div>
              <span>John Doe </span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default Rightbar

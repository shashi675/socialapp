import './profile.scss';

import PlaceIcon from '@mui/icons-material/Place';
import LanguageIcon from '@mui/icons-material/Language';
import { EmailOutlined } from '@mui/icons-material';
import Posts from '../../components/posts/Posts';
import { useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';


const Profile = () => {

  const imgUrl = process.env.REACT_APP_IMG_URL;
  const url = process.env.REACT_APP_BACKEND_URL;
  const { currentUser } = useContext(AuthContext);
  const userId = parseInt(useLocation().pathname.split("/")[2]);
  const navigate = useNavigate();

  const [profileUser, followers] = useQueries({
    queries:[
        {
            queryKey: ['profileUser', userId],
            queryFn: async () => {
            return await axios.get(url + "/users/find?uId="+userId+"&token="+currentUser.token)
              .then((res) => res.data )
            },
        },
        {
            queryKey: ['followerss'],
            queryFn: async () =>
            await axios.get(url + "/follower?token="+currentUser.token)
              .then( (res) => res.data  )
        }
    ]
});


const queryClient = useQueryClient();

const mutation = useMutation((isFollowed) => {
  if(isFollowed) 
  return axios.delete(url + "/follower?token="+currentUser.token+"&followedUId="+userId);
  else 
  return axios.post(url + "/follower?token="+currentUser.token, {
    "followedUId": userId
  });
}, {
  onSuccess: () => {
    // invalidate and refetch:
    queryClient.invalidateQueries("followerss");
  },
})


const handleUpdate = () => {
  return navigate(`/updateProfile/${userId}`);
}


const handleFollow = async () => {
  mutation.mutate(followers.data.includes(userId));
}


  return (
    profileUser.isLoading ? "loading..." :
    ( <div className='profile'>
        <div className='images'>
          {profileUser.data.coverPic !== null && <img src={imgUrl + profileUser.data.coverPic} alt='cover' className='cover' />}
          {profileUser.data.profilePic !== null && <img src={imgUrl + profileUser.data.profilePic} alt='profile' className='profilePic' />}
        </div>
        <div className='profileContainer'>
          <div className='userInfo'>
            <span className='name'>{profileUser.data.name}</span>
            <div className='userDetail'>
              <div className='left'>
                <div className='item'>
                  <PlaceIcon />
                  <span>{profileUser.data.city}</span>
                </div>
                <div className='item'>
                  <LanguageIcon />
                  <span>{profileUser.data.language}</span>
                </div>
              </div>
              <div className='right'>
                <EmailOutlined onClick={() => window.location = "mailto:" + profileUser.data.email} />
              </div>
            </div>
            { userId === currentUser.uId ? 
            <button onClick={handleUpdate}>update</button> :
            <button onClick={handleFollow}>{!followers.isLoading && followers.data.includes(profileUser.data.uId) ? "unfollow" : "follow" }</button> }
          </div>
          {(currentUser.uId === userId) ?  <Posts profileOpen={true}/> : ""}
        </div>
      </div>
    )
  )
}

export default Profile

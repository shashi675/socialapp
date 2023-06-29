
import './frequests.scss';

import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';


const Frequests = ({ followers, following }) => {
  const imgUrl = process.env.REACT_APP_IMG_URL;
  const url = process.env.REACT_APP_BACKEND_URL;
  const { currentUser } = useContext(AuthContext);

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

  const queryClient = useQueryClient();

  const mutationFollow = useMutation(async (userId) => {
    return await axios.post(url + "/follower?token="+currentUser.token, {
          followedUId: userId
        })
  }, {
    onSuccess: () => {
      // invalidate and refetch:
      queryClient.invalidateQueries("unfollowers");
    }
  })

  const mutationUnfollow = useMutation(async (userId) => {
    return await axios.delete(url + "/follower?token="+currentUser.token+"&followerUId="+userId);
  }, {
    onSuccess: () => {
      // invalidate and refetch:
      queryClient.invalidateQueries("unfollowers");
    }
  })

  const handleFollow = (userId) => {
    mutationFollow.mutate(userId);
  }

  const handleUnfollow = (userId) => {
    mutationUnfollow.mutate(userId);
  }


  return (
    <div className="frequests">
      <span>Follow requests</span>
        {myFollowers.data?.length === 0 ? <span className='message'>ooops!, you don't have any follow requests</span> : myFollowers.data?.map( follower => {
          if(meFollowing.data?.includes(follower.userId) === false)
            return (
              <div key={follower.userId} className="item">
                <Link to={`/profile/${follower.userId}`} >
                  {follower.profilePic !== null && <img src={imgUrl + follower.profilePic} />}
                  <span>{follower.name}</span>
                </Link>
                <div>
                  <button onClick={ () => handleFollow(follower.userId)}>follow back</button>
                  <button onClick={() => handleUnfollow(follower.userId)}>Dissmiss</button>
                </div>
              </div>
          )
        })}
    </div>
  )
}

export default Frequests

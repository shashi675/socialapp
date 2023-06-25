
import './friends.scss';

import { useContext } from "react"
import { AuthContext } from "../../context/authContext"
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Link } from 'react-router-dom';

const Friends = () => {

  const url = process.env.REACT_APP_BACKEND_URL;
  const { currentUser } = useContext(AuthContext);

  const [friends, unFollowers] = useQueries({
    queries:[
        {
          queryKey: ['friends'],
          queryFn: async () =>
          await axios.get(url + "/follower/getFollowingUserDetails?token="+currentUser.token)
              .then((res) => res.data )
        },
        {
            queryKey: ['unfollowers'],
            queryFn: async () =>
            await axios.get(url + "/follower/unfollowers?token="+currentUser.token)
                .then((res) => res.data )
        }
      ]
  });

  const queryClient = useQueryClient();

  const mutationFollow = useMutation(async (userId) => {
      return await axios.delete(url + "/follower?token="+currentUser.token+"&followedUId="+userId);
  }, {
    onSuccess: () => {
      // invalidate and refetch:
      queryClient.invalidateQueries("friends");
  },
  })

  const mutationUnFollow = useMutation(async (userId) => {
    return await axios.post(url + "/follower?token="+currentUser.token, {
        followedUId: userId
      })
  }, {
      onSuccess: () => {
        // invalidate and refetch:
        queryClient.invalidateQueries("unfollowers");
    }
  })

  const handleFollow = (userId) => {
    mutationFollow.mutate(userId);
  }

  const handleUnFollow = (userId) => {
    mutationUnFollow.mutate(userId);
  }

  return (
    <div className='friend-page'>
      <div className="friends">
        <span>Your friends</span>
        {friends.data?.length === 0 ? <span className='message'>ooops!, you have no friends</span> :friends.data?.map( friend => {
          return (
            <div key={friend.userId} className="item">
              <Link to={`/profile/${friend.userId}`} >
                <img src={"../uploads/" + friend.profilePic} />
                <span>{friend.name}</span>
              </Link>
              <button onClick={ () => handleFollow(friend.userId)}>unfollow</button>
            </div>
          )
        })}
      </div>

      {unFollowers.data?.length !==0 ?
        <div className='friends'>
          <span  className='message2'>you may know</span>
          {unFollowers.data?.map( user => {
            return (
              <div key={user.userId} className='item'>
                <Link to={`/profile/${user.userId}`}>
                  <img src={'../uploads/' + user.profilePic} />
                  <span>{user.name}</span>
                </Link>
                <button onClick={ () => handleUnFollow(user.userId)}>follow</button>
              </div>
            )
          })}
        </div> :
        ""
      }
    </div>
  )
}

export default Friends

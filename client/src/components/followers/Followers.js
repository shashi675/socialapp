
import './followers.scss';

import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import { AuthContext } from "../../context/authContext"
import axios from "axios";
import { Link } from "react-router-dom";



const Followers = () => {
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

    const mutation = useMutation(async (userId) => {
      if(meFollowing.data.includes(userId))
        return await axios.delete(url + "/follower?token="+currentUser.token+"&followedUId="+userId);
      else 
        return await axios.post(url + "/follower?token="+currentUser.token, {
          followedUId: userId
        })
    }, {
        onSuccess: () => {
        // invalidate and refetch:
        queryClient.invalidateQueries("friends");
    },
    })

    const handleClick = (userId) => {
        mutation.mutate(userId);
    }

  return (
    <div className="followers">
        <span>Your followers</span>
        {myFollowers.data?.length === 0 ? <span className='message'>ooops!, you have no followers</span> : myFollowers.data?.map( follower => {
          return (
            <div key={follower.userId} className="item">
              <Link to={`/profile/${follower.userId}`} >
                {follower.profilePic !== null && <img src={imgUrl + follower.profilePic} alt='profile' />}
                <span>{follower.name}</span>
              </Link>
              <button onClick={ () => handleClick(follower.userId)}>{meFollowing.data?.includes(follower.userId) ? "unfollow" : "follow"}</button>
            </div>
          )
        })}
      </div>
  )
}

export default Followers

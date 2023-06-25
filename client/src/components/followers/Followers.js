
import './followers.scss';

import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query"
import { useContext } from "react"
import { AuthContext } from "../../context/authContext"
import axios from "axios";
import { Link } from "react-router-dom";



const Followers = () => {

    const { currentUser } = useContext(AuthContext);

    const [myFollowers, meFollowing] = useQueries({
      queries: [
        {
          queryKey: ['followers'],
          queryFn: async () => 
            await axios.get("http://localhost:3001/api/follower/getMyFollowersDetails?token="+currentUser.token)
              .then((res) => res.data )
        },
        {
          queryKey: ['following'],
          queryFn: async () => 
            await axios.get("http://localhost:3001/api/follower?token="+currentUser.token)
              .then((res) => res.data )
        }
      ]
    })
      
    const queryClient = useQueryClient();

    const mutation = useMutation(async (userId) => {
      if(meFollowing.data.includes(userId))
        return await axios.delete("http://localhost:3001/api/follower?token="+currentUser.token+"&followedUId="+userId);
      else 
        return await axios.post("http://localhost:3001/api/follower?token="+currentUser.token, {
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
        {myFollowers.data?.length === 0 ? <sapn className='message'>ooops!, you have no followers</sapn> : myFollowers.data?.map( follower => {
          return (
            <div key={follower.userId} className="item">
              <Link to={`/profile/${follower.userId}`} >
                <img src={"../uploads/" + follower.profilePic} />
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

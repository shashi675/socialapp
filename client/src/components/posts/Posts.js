
import Post from '../post/Post';
import SharePost from '../sharePost/SharePost';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';
import { useContext } from 'react';

const Posts = ({profileOpen}) => {

    const url = "http://localhost:3001/api";
    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery(['posts'], async () =>
        axios.get(url + "/posts?token="+currentUser.token)
            .then((res) => res.data )
    );
    
    if(profileOpen) {
        return (
            <div className='posts'>
                { isLoading ? "loading..." : 
                error ? "something went wrong" :
                data.map((post) => {
                    if(post.postUId === currentUser.uId)
                        return <Post key={post.pId} post={post} profileOpen={profileOpen} />
                })}
            </div>
        )
    }
    else {
        return (
            <div className='posts'>
                <SharePost />
                { isLoading ? "loading..." : 
                error ? "something went wrong" :
                data.map((post) => {
                    return <Post key={post.pId} post={post} />
                })}
            </div>
        )
    }
}

export default Posts;

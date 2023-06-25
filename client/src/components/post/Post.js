
import './post.scss';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import { Link } from 'react-router-dom';
import Comments from '../comments/Comments';
import { useContext, useState } from 'react';
import moment from 'moment';
import { useMutation, useQueries, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { AuthContext } from '../../context/authContext';

const Post = ({ post, profileOpen }) => {

    const [commentOpen, setCommentOpen] = useState(false);
    const { currentUser } = useContext(AuthContext);

    const [likes, comments] = useQueries({
        queries:[
            {
                queryKey: ['likes', post.pId],
                queryFn: async () =>
                await axios.get("http://localhost:3001/api/likes?postId="+post.pId)
                    .then((res) => res.data )
            },
            {
                queryKey: ['comments', post.pId],
                queryFn: async () =>
                await axios.get("http://localhost:3001/api/comments?postId="+post.pId)
                    .then((res) => res.data )
            }
        ]
    });


    const queryClient = useQueryClient();

    const mutationLikes = useMutation((isLiked) => {
        if(isLiked) 
            return axios.delete("http://localhost:3001/api/likes?postId="+post.pId+"&token="+currentUser.token);
        else 
            return axios.post("http://localhost:3001/api/likes", {
                token: currentUser.token,
                postId: post.pId
            });
    }, {
        onSuccess: () => {
            // invalidate and refetch:
            queryClient.invalidateQueries("likes");
        },
    })

    const mutationComments = useMutation((newComment) => {
        return axios.post("http://localhost:3001/api/comments?postId=" + post.pId, newComment);
    }, {
        onSuccess: () => {
            // invalidate and refetch:
            queryClient.invalidateQueries("comments");
        },
    })

    const mutationPosts = useMutation(async (postId) => {
        return await axios.delete("http://localhost:3001/api/posts?token="+currentUser.token+"&postId="+postId);
    }, {
        onSuccess: () => {
            // invalidate and refetch:
            queryClient.invalidateQueries("posts");
        },
    })

    const handleClick = async () => {
        mutationLikes.mutate(likes.data.includes(currentUser.uId));
    }

    const handleDelete = (postId) => {
        mutationPosts.mutate(postId);
    }

  return (
    <div className='post'>
        <div className='container'>
            <div className='user'>
                <div className='userInfoo'>
                    <img src={"../uploads/" + post.profilePic} alt='' />
                    <div className='details'>
                        <Link to={`/profile/${post.userId}`} style={{ textDecoration: "none", color: "inherit"}}>
                            <span className='name'>
                                {post.name}
                            </span>
                        </Link>
                        <span className='time'>{ moment(post.createdAt).fromNow() }</span>
                    </div>
                </div>
                { profileOpen && <button onClick={ () => handleDelete(post.pId)}>delete post</button>}
            </div>
            <div className='content'>
                <p>{post.descn}</p>
                <img src={"../uploads/" + post.img} alt='' />
            </div>
            <div className='interact'>
                <div className='item'>
                    { !likes.isLoading && 
                    (likes.data.includes(currentUser.uId)) ? <FavoriteOutlinedIcon style={{color:"red"}} onClick={handleClick} />: <FavoriteBorderOutlinedIcon onClick={handleClick} /> }
                    { !likes.isLoading &&  likes.data.length } likes

                </div>
                <div className='item' onClick={() => setCommentOpen(!commentOpen)}>
                    <MessageOutlinedIcon />
                    {!comments.isLoading && comments.data.length} comments
                </div>
            </div>
        </div>
        {commentOpen ? comments.isLoading ? "loading..." :
        <Comments comments={comments.data} mutationComments={mutationComments} /> : ""}
    </div>
  )
}

export default Post

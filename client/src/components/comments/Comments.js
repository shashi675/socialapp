
import { useContext, useState } from 'react';
import './comments.scss';
import { AuthContext } from '../../context/authContext';
import moment from 'moment';


const Comments = ({ comments, mutationComments }) => {

    const imgUrl = process.env.REACT_APP_IMG_URL;
    const { currentUser } = useContext(AuthContext);
    const [descn, setDescn] = useState("");

    const handleClick = async (e) => {
        e.preventDefault();
        mutationComments.mutate({
            "token": currentUser.token,
            descn
        });
        setDescn("");
    }

  return (
    <div className='comments'>
        <div className='writeComment'>
            {currentUser.profilePic !== null && <img src={imgUrl + currentUser.profilePic} alt='' />}
            <input type='text' placeholder='write your comment...' onChange={ (e) => setDescn(e.target.value) } value={ descn } />
            <button onClick={ handleClick }>Send</button>
        </div>
      { comments.map((comment) => {
        return (
            <div className='comment' key={ comment.cId }>
                <div className='infoo'>
                    {comment.profilePic !== null && <img src={imgUrl + comment.profilePic} alt='' />}
                    <div className='detail'>
                        <p>{comment.name}</p>
                        <span>{comment.descn}</span>
                    </div>
                </div>
                <span className='time'>{ moment(comment.createdAt).fromNow() }</span>
            </div>
        )
      })}
    </div>
  )
}

export default Comments;

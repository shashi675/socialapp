
import { useContext, useState } from 'react';
import './sharePost.scss';
import { AuthContext } from '../../context/authContext';
import AddPhotoAlternateOutlinedIcon from '@mui/icons-material/AddPhotoAlternateOutlined';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const SharePost = () => {

    const url = "http://localhost:3001/api";
    const { currentUser } = useContext(AuthContext);

    const [file, setFile] = useState(null);
    const [descn, setDescn] = useState("");

    const queryClient = useQueryClient();

    const mutation = useMutation((newPost) => {
        return axios.post(url + "/posts", newPost);
    }, {
        onSuccess: () => {
            // invalidate and refetch:
            queryClient.invalidateQueries("posts");
        },
    })

    const upload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(url + "/upload", formData);
            return res.data;
        } catch(err) {
            console.log(err);
        }
    }

    const hadnleClick = async (e) => {
        e.preventDefault();
        let imgUrl = "";
        if(file) imgUrl = await upload();
        mutation.mutate({ 
            "token": currentUser.token,
            descn,
            "img": imgUrl
        });
        setDescn("");
        setFile(null);
    }

  return (
    <div className='sharePost'>
        <div className='top'>
            <div className='left'>
                <div className='type-something'>
                    <img src={"../uploads/" + currentUser.profilePic} alt='' />
                    <input type='text' placeholder={`type your post ${currentUser.name}`} onChange={ e=> setDescn(e.target.value) } value={descn} />
                </div>
            </div>
            <div className='right'>
                {file && <img className='file-image' src={URL.createObjectURL(file)} alt='' />}
            </div>
        </div>
        <hr />
        <div className='share'>
            <div className='addImage'>
                <div className='image'>
                    <label htmlFor='postImg'>
                        <input type='file' name='postImg' id='postImg' style={{display: "none"}} onChange={ e=> setFile(e.target.files[0]) } />
                        <AddPhotoAlternateOutlinedIcon />
                        <span>Add image  (only one image)</span>
                    </label>
                </div>
            </div>
            <button onClick={ hadnleClick }>post</button>
        </div>
    </div>
  )
}

export default SharePost

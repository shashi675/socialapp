
import './updateProf.scss';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

const UpdateProfile = () => {

    const imgUrl = process.env.REACT_APP_IMG_URL;
    const url = process.env.REACT_APP_BACKEND_URL;
    const { currentUser, setCurrentUser } = useContext(AuthContext);
    const [values, setValues] = useState({
        name:"",
        city:"",
        language:""
    });
    const [profilePic, setProfilePic] = useState(null);
    const [coverPic, setCoverPic] = useState(null);
    const navigate = useNavigate();

    const upload = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(url + "/upload", formData);
            return res.data;
        } catch(err) {
            console.log(err);
        }
    }


    const mutation = useMutation((userInfo) => {
        return axios.put(url + "/users?token="+currentUser.token, userInfo);
    }, {
        onSuccess: async () => {
            // invalidate and refetch:
            const data = await axios.get(url + "/users/find?uId="+currentUser.uId+"&token="+currentUser.token)
              .then((res) => res.data );
            setCurrentUser({...data, token: currentUser.token});
        },
    })

    const handleChange = (e) => {
        setValues((prev) => ({...prev, [e.target.name]: e.target.value}))
    }

    const handleClick = async (e) => {
        e.preventDefault();
        
        const coverUrl = coverPic ? await upload(coverPic) : currentUser.coverPic;
        const profileUrl = profilePic ? await upload(profilePic) : currentUser.profilePic;
        const name = values.name.length !== 0 ? values.name : currentUser.name;
        const city = values.city.length !== 0 ? values.city : currentUser.city;
        const language = values.language.length !== 0 ? values.language : currentUser.language;

        // console.log(coverUrl, coverPic, profileUrl, profilePic)

        // console.log(coverPic, profilePic)
        mutation.mutate({
            name, city, language,
            coverPic: coverUrl,
            profilePic: profileUrl
        });

        setCoverPic(null);
        setProfilePic(null);
        navigate("/profile/"+currentUser.uId);
    }

    return (
        <div className='updateProf'>
            <div className='image'>
                {currentUser.coverPic !== null ? 
                <img src={ imgUrl + currentUser.coverPic} alt='' className='cover' /> :
                <img src={'/images/cover.png'} alt='' className='cover' />
                }
                {currentUser.profilePic !== null ? 
                <img src={ imgUrl + currentUser.profilePic} alt='' className='profilePic' /> :
                <img src={'/images/defaultProfilePic.png'} alt='' className='profilePic' />
                }
            </div>
            <div className='profile-container'>
                <div className='userName'>user name: <strong>{currentUser.userName}</strong></div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input id="name" name='name' type="text" onChange={handleChange} value={values.name} />
                </div>
                <div>
                    <label htmlFor="city">City:</label>
                    <input id="city" name='city' type="text" onChange={handleChange} value={values.city} />
                </div>
                <div>
                    <label htmlFor="language">Language:</label>
                    <input id="language" name='language' type="text" onChange={handleChange} value={values.language} />
                </div>
                <div>
                    <label htmlFor="profilePic">Profile Photo</label>
                    <input id="profilePic" type="file" onChange={ e => setProfilePic(e.target.files[0])} />
                </div>
                <div>
                    <label htmlFor="coverPic">Cover Photo</label>
                    <input id="coverPic" type="file" onChange={ e => setCoverPic(e.target.files[0])} />
                </div>
                <button onClick={ handleClick }>update</button>
            </div>
        </div>
    );
}

export default UpdateProfile;
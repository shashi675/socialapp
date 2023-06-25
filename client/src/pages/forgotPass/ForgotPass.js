
import './forgotPass.scss';

import { Link } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const ForgotPass = () => {

    const url = "http://localhost:3001/api";
    const [inputs, setInputs] = useState({
        userName: "",
        email: ""
    });

    const [pass, setPass] = useState({
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [credentials, setCredentials] = useState(false);

    const handleChangeI = e => {
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }


    const forgPassword = async (inputs) => {
        return await axios.get(url + "/auth/forgetPass?userName=" + inputs.userName + "&email=" + inputs.email);
    }

    const handleForgotPass = async (e) => {
        e.preventDefault();
        
        if(!inputs.userName || !inputs.email) {
            setMessage("please fill all details");
            return;
        }

        try {
            const pass = await forgPassword(inputs);
            setCredentials(pass.data.credentils);
        } catch(err) {
            setError(err.response.data);
        }
    }

    const handleChangeP = (e) => {
        setMessage(null);
        setPass((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleConfirmPass = async (e) => {
        e.preventDefault();

        if(pass.password.localeCompare(pass.confirmPassword) !== 0) {
            setMessage("both password should match");
            return;
        }
        
        await axios.put(url + "/auth", {
            password: pass.password,
            userName: inputs.userName
        })
            .then(setMessage("password updated"));

        setInputs({
            userName: "",
            email: ""
        });
        setPass({
            password: "",
            confirmPassword: ""
        });
        // navigate("/")
    }

  return (
    <div className='forgotPass'>
        <h1>SocialApp.</h1>
        <div className='card'>
            <h1 className='forget-heading'>forget password</h1>
            <form>
                {credentials ? 
                <div className='form'>
                    <input type='password' placeholder='password' name='password' onChange={handleChangeP} value={pass.password || ''} />
                    <input type='password' placeholder='confirm password' name='confirmPassword' onChange={handleChangeP} value={pass.confirmPassword || ''} />
                    <button onClick={ handleConfirmPass }>submit</button>
                </div> :
                <div className='form'>
                    <input type='text' placeholder='username' name='userName' onChange={handleChangeI} value={inputs.userName} />
                    <input type='email' placeholder='email' name='email' onChange={handleChangeI} value={inputs.email} />
                    <button onClick={ handleForgotPass }>submit</button>
                </div>
                }
                {error || message}
                <div className='forgot'>
                    <span>go to login page</span>
                    <Link to='/login'>
                        click here
                    </Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ForgotPass;

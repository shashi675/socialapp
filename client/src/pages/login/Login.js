
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
import { useContext, useState } from 'react';
import { AuthContext } from '../../context/authContext';

const Login = () => {

    const [inputs, setInputs] = useState({
        userName: "sk",
        password: "12345"
    });

    const [error, setError] = useState(null);
    const { login, isLoading, setIsLoading } = useContext(AuthContext);

    const handleChange = e => {
        setError(null);
        setIsLoading(false);
        setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(inputs);
            navigate("/");
        } catch(err) {
            setError(err.response.data);
        }
    }

  return (
    <div className='login'>
        <h1>SocialApp.</h1>
        <div className='card'>
            <h1>Login</h1>
            <form>
                <input type='text' value={inputs.userName} placeholder='username' autoComplete='off' name='userName' onChange={handleChange} />
                <input type='password' value={inputs.password} autoComplete='off' placeholder='password' name='password' onChange={handleChange} />
                {error && error}
                {!error && isLoading && "please wait"}
                <button onClick={ handleLogin }>Login</button>
                <div>
                    <span>don't have an accont?</span>
                    <Link to='/register'>
                        Register here
                    </Link>
                </div>
                <div className='forgot'>
                    <span>forgot password?</span>
                    <Link to='/resetPass'>
                        click here
                    </Link>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login

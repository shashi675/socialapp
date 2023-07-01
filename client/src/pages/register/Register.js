
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {

  const url = process.env.REACT_APP_BACKEND_URL;
  const [inputs, setInputs] = useState({
    userName: "",
    email: "",
    name: "",
    password: ""
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = e => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setMessage(null);
  }

  const handleClick = async e => {
    e.preventDefault();

    if(!inputs.userName || !inputs.email || !inputs.name || !inputs.password) {
      setMessage("every fields are mandatory");
      return;
    }

    let str = "";
    for(let i=inputs.email.length-1; i>=0; i--) {
      str += inputs.email.charAt(i);
    }
    const p1 = str.indexOf("@");
    const p2 = str.indexOf("moc.");   

    if(p1 === -1 || p2 === -1 || p1 < p2) {
      setMessage("invalid email id");
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(url + "/auth/register", inputs);
      setIsLoading(false);
      navigate("/login");
    }
    catch(err) {
      setError(err.response.data);
    }
  }


  return (
    <div className='login'>
      <h1>SocialApp.</h1>
      <div className='card'>
        <h1>Register</h1>
        <form>
            <input type='text' placeholder='username' name="userName" onChange={handleChange} />
            <input type='email' placeholder='email' name="email" onChange={handleChange} />
            <input type='name' placeholder='name' name="name" onChange={handleChange} />
            <input type='password' placeholder='password' name="password" onChange={handleChange} />
            {error || message}
            {!error && isLoading && "please wait"}
            <button onClick={handleClick}>Register</button>
          <div>
            <span>already have an account?</span>
            <Link to='/login'>
              Login here
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register

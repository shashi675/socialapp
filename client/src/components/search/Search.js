
import './search.scss';
import axios from 'axios';

import { Link } from 'react-router-dom';
import { useState } from 'react';


const Search = () => {

  const imgUrl = process.env.REACT_APP_IMG_URL;
  const url = process.env.REACT_APP_BACKEND_URL;
    const [searchText, setSearchText] = useState('');
    const [result, setResult] = useState(null);


    const handleClick = async () => {
      const data = await axios.get(url + "/users/search?searchText="+searchText)
        .then(res => res.data);

      setResult(data);
    }

  return (
    <div className='search-user'>
      <div className='search'>
        <input type='text' placeholder='search...' onChange={(e) => {setSearchText(e.target.value); setResult(null)}} value={searchText} />
        <button onClick={handleClick}>search</button>
      </div>
      {result?.length === 0 ?
        <span>no users found</span> : result?.map( user => {
        return (
          <div key={user.userId} className='each-user'>
            <Link to={`/profile/${user.userId}`} >
              {user.profilePic !== null && <img src={imgUrl + user.profilePic} alt='' />}
              <div>
                  <span>{user.name}</span>
                  <span className='uName'>{user.userName}</span>
              </div>
            </Link>
          </div>
        )
      })}
    </div>
  )
}

export default Search

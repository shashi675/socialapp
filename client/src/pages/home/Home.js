
import Posts from '../../components/posts/Posts';
import './home.scss';

const Home = () => {
  return (
    <div className='home'>
      <Posts profileOpen={false} />      
    </div>
  )
}

export default Home


import { useContext } from 'react';
import './stories.scss';
import { AuthContext } from '../../context/authContext';

const Stories = () => {

    const { currentUser } = useContext(AuthContext);

    const storiesTemp = [
        {
            id: 1,
            name: "John Doe",
            img: "./images/Canva.png"
        },
        {
            id: 2,
            name: "John Doe",
            img: "./images/Canva.png"
        },
        {
            id: 3,
            name: "John",
            img: "./images/Canva.png"
        },
        {
            id: 4,
            name: "mohn",
            img: "./images/Canva.png"
        }
    ]

  return (
    <div className='stories'>
        <div className='story'>
            <img src={ currentUser.profilePic } alt='' />
            <span>{ currentUser.name }</span>
            <button>+</button>
        </div>

        {storiesTemp.map((story) => {
            return (
                <div className='story' key={story.id}>
                    <img src={ story.img } alt='' />
                    <span>{ story.name }</span>
                </div>
            )
        })}
    </div>
  )
}

export default Stories

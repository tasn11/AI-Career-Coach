import React from 'react';
import './App.css';
import logo from './images/Logo.png';
import achievement from './images/achievement.png';
import goal from './images/goal.png';
import strengths from './images/strengths.png';
import weakness from './images/weakness.png';
import { useNavigate } from 'react-router-dom'; // Import the Link component

const Home = () => {
    const navigate = useNavigate(); // Create a history object to go to another page

    const goToStrengths = () => {
        navigate('/Strengths');

    };

    const goToPractice = () => {
        navigate('/');
    };

    return (
        <div className="AppWrapper">
            <div className='Container'>
                <header>
                    <img src={logo} alt="Logo" className='LogoImage' />
                    <button className="practiceButton" onClick={goToPractice}>Practice Now</button>
                </header>
                <section className="boxesContainer">
                    <button className="box">
                        <img src={achievement} alt="Achievement" onClick={goToStrengths} />
                        Achievements
                    </button>
                    <button className="box">
                        <img src={goal} alt="Goal Setting" onClick={goToStrengths} />
                        Goal Setting
                    </button>
                    <button className="box">
                        <img src={strengths} alt="Strengths" onClick={goToStrengths} />
                        Strengths
                    </button>
                    <button className="box">
                        <img src={weakness} alt="Areas of Development" onClick={goToStrengths} />
                        Areas of Development
                    </button>
                </section>
            </div>
        </div>
    );
};

export default Home;

import React, { useState } from 'react';
import '../App.css';
import logo from '../images/Logo.png';

const Home = () => {
    const [strengths, setStrengths] = useState(["Leadership", "Communication", "Adaptability"]);

    const addStrength = () => {
        setStrengths([...strengths, "New Strength"]);
    };

    return (
        <div className="AppWrapper">
        <div className='Container'>
            <header>
                <img src={logo} alt="Logo" className='LogoImage' />
                <button className="practiceButton">Practice Now</button>
            </header>
            <div className='ContainerStrengths'>
                <div className="StrengthsHeader">
                    <h2 className='StrengthsText'>Strengths</h2>
                </div>
                <div className='Table'>
                    <ul>
                        {strengths.map((strength, index) => (
                            <li key={index}>{strength}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="CenteredButton">
                <button className="plusButton" onClick={addStrength}>+</button>
            </div>
            </div>
        </div>
    );
};

export default Home;

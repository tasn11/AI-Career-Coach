// ConversationForm.jsx

import React, { useState  } from 'react';
import '../App.css';
import { useAppContext } from './AppContext'; // Update the path accordingly
import { useNavigate  } from 'react-router-dom'; // Import the Link component

const ConversationForm = () => {
  const [step, setStep] = useState(1);
  const [whoAreYouTalkingTo, setWhoAreYouTalkingTo] = useState('');
  const [whatToPractice, setWhatToPractice] = useState('');
  const [isOtherTextBoxVisible, setOtherTextBoxVisible] = useState(false);
  const [isCustomTextBoxVisible, setCustomTextBoxVisible] = useState(false);
  const { setWhatToPracticeGlobal } = useAppContext();
  const navigate = useNavigate(); // Create a history object to go to another page

  const handleWhoAreYouTalkingToChange = (option) => {
    if (option === 'Other') {
      setOtherTextBoxVisible(!isOtherTextBoxVisible);
    } else {
      setWhoAreYouTalkingTo(option);
      setStep(2);
    }
  };

  const handleWhatToPracticeChange = (option) => {
    if (option === 'Custom') {
        setCustomTextBoxVisible(!isCustomTextBoxVisible);
        console.log("custom");
    } else {
        setWhatToPractice(option);
        setWhatToPracticeGlobal(option);
        console.log('Talking to:', whoAreYouTalkingTo);
        console.log('Practicing:', whatToPractice);
        setStep(3); // Move to the next step for custom input if needed
        navigate('/Practice');
    }
  };

  const handleNext = () => {
    // You can perform any necessary action based on the selected options here
    console.log('Talking to:', whoAreYouTalkingTo);
    console.log('Practicing:', whatToPractice);
    setStep(3); // Move to the next step for custom input if needed
    navigate('/Practice');
  };

  return (
    <div className="AppWrapper">
    <div className='Container'>
    <div className='pageHeader'>Practice</div>
    <div className="library-header1">
      Before we start, help us personalize this experience
    </div>
    <div className="conversation-container">
      {step === 1 && (
        <div className="question-container">
          <p className="question">Who are you talking to?</p>
          <div className="options-container">
            <button className="option" onClick={() => handleWhoAreYouTalkingToChange('Manager')}>Manager</button>
            <button className="option" onClick={() => handleWhoAreYouTalkingToChange('Co-worker')}>Co-worker</button>
            <button className="option" onClick={() => handleWhoAreYouTalkingToChange('Client')}>Client</button>
            <button className="option" onClick={() => handleWhoAreYouTalkingToChange('Other')}>Other</button>
            {isOtherTextBoxVisible && (
              <div className="custom-input-container">
                <input
                  type="text"
                  className="custom-text-input"
                  placeholder="Type here..."
                  value={whoAreYouTalkingTo}
                  onChange={(e) => setWhoAreYouTalkingTo(e.target.value)}
                />
                <button className="next-button" onClick={() => setStep(2)}>Next</button>
              </div>
            )}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="question-container">
          <p className="question">What do you want to practice today?</p>
          <div className="options-container">
            <button className="option" onClick={() => handleWhatToPracticeChange('Asking for a raise')}>Asking for a raise</button>
            <button className="option" onClick={() => handleWhatToPracticeChange('Asking for a promotion')}>Asking for a promotion</button>
            <button className="option" onClick={() => handleWhatToPracticeChange('Ask to be involved in a project')}>Ask to be involved in a project</button>
            <button className="option" onClick={() => handleWhatToPracticeChange('Pitch an idea')}>Pitch an idea</button>
            <button className="option" onClick={() => handleWhatToPracticeChange('Custom')}>Custom</button>
            {isCustomTextBoxVisible && (
              <div className="custom-input-container">
                <input
                  type="text"
                  className="custom-text-input"
                  placeholder="Type here..."
                  value={whatToPractice}
                  onChange={(e) => {
                    setWhatToPractice(e.target.value);
                     setWhatToPracticeGlobal(e.target.value);
                  }}
                />
                <button className="next-button" onClick={() => handleNext()}>Next</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
  );
};

export default ConversationForm;

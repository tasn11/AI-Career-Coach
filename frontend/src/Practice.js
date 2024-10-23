import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import OpenAI from './components/openAI';
import { useAppContext } from './components/AppContext'; // Update the path accordingly
import { BsRecordCircle } from "react-icons/bs";
import { FaStop, FaArrowRight } from "react-icons/fa";
import { MdDoneOutline } from "react-icons/md";
import PopupModal from './components/PopupModal';
import { useNavigate } from 'react-router-dom'; // Import the Link component

let text; //the text that will be transcribed
let textArray = [];
let fillerWordsFound;
let fillerWordsArray = [];

const Practice = () => {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [sessionTitle, setSessionTitle] = useState('');

    const [isDisplayedTextContainerVisible, setIsDisplayedTextContainerVisible] = useState(true);
    const [isBottomSheetMinimized, setIsBottomSheetMinimized] = useState(false);
    const [fillerWordsPresent, setFillerWordsPresent] = useState(false);
    const [fillerWordsNumber, setFillerWordsNumber] = useState(0);

    const [recording, setRecording] = useState(false);
    const [videoMediaRecorder, setVideoMediaRecorder] = useState(null);
    const [audioMediaRecorder, setAudioMediaRecorder] = useState(null);
    const [videoURL, setVideoURL] = useState(null);
    const [audioURL, setAudioURL] = useState(null);
    const videoRef = useRef(null);
    const [isPracticeStopped,] = useState(false);
    const [displayedText, setDisplayedText] = useState('');
    const [displayedTextShow, setDisplayedTextShow] = useState(false);

    const [displayedBuffer, setDisplayedBuffer] = useState(false); //buffer for feedback on answer
    const [displayedBuffer1, setDisplayedBuffer1] = useState(false); //buffer for question

    const [openAiComponent, setopenAiComponent] = useState('');
    const [currentQuestion, setCurrentQuestion] = useState(''); //what question are u on
    const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0); //whats the questions number (ex. 0, 1, 2)

    const { whatToPracticeGlobal } = useAppContext(); //what the question will be about
    const [openAiResponse, setOpenAiResponse] = useState(''); // to save gpt's response to what question is asked
    const [openAiResponse1, setOpenAiResponse1] = useState(''); // to save gpt's response to if the answer is good

    const [showGetFeedbackButton, setshowGetFeedbackButton] = useState(false);
    const [showGetNextButton, setshowNextButton] = useState(true);
    const [showEndButton, setEndButton] = useState(false);

    const navigate = useNavigate(); // Create a history object to go to another page

    useEffect(() => {
        if (videoURL) {
            videoRef.current.src = videoURL;
        }
    }, [videoURL]);

    useEffect(() => {
        if (audioURL && isPracticeStopped) {
            findFillerWords(text);
        }
    }, [audioURL, isPracticeStopped]);

    const getResults = () => {
        const intervalId = setInterval(() => {
            console.log("question" + currentQuestion)
            if (textArray.length === 0) {
                setDisplayedTextShow(false);
                // Display loading gif
                setDisplayedBuffer(true);
                console.log("no results")
            } else {
                // Stop the interval and proceed with setDisplayedText
                setDisplayedBuffer(false);
                clearInterval(intervalId);
                setDisplayedText(textArray.join(' '));
                textArray.length = 0;
                setDisplayedTextShow(true);
                setIsDisplayedTextContainerVisible(true); // Show the bottom sheet
                console.log("yes results")
            }
        }, 2000);

    };

    const endSession = () => {
        console.log("end");
        setPopupOpen(true);

    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    const handleSave = (title) => {
        setSessionTitle(title);
        navigate('/Library');
    };

    function findFillerWords(text) {
        const fillerWords = [
            'you know',
            'uh',
            'literally',
            'I mean',
            'um',
            'you see',
            'you know what I mean',
            'or something',
            'like',
            'sort of',
            'kind of',
            'so basically',
            'or something like that',
            'so'
        ];

        const regex = new RegExp('\\b(' + fillerWords.join('|') + ')\\b', 'gi');
        fillerWordsFound = text.match(regex) || [];
        fillerWordsArray.push(...fillerWordsFound.map(word => word.toLowerCase()));

        if (fillerWordsArray.length !== 0) {
            setFillerWordsPresent(true);
            setFillerWordsNumber(fillerWordsArray.length)
        }

        console.log(fillerWordsFound);
    }

    // Transcribe an audio file from a local file:
    const transcribeFile = async () => {
        try {
            const response = await fetch('http://localhost:5000/transcribe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Failed to transcribe audio');
            }

            const result = await response.json();
            text = result.transcript;
            textArray.push(text);
            console.log(result.transcript);
            console.log("array:" + textArray)
        } catch (error) {
            console.error('Error transcribing audio:', error.message);
        }
    };


    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            const videoRecorder = new MediaRecorder(stream);
            const audioRecorder = new MediaRecorder(stream);

            const videoRecordedChunks = [];
            const audioRecordedChunks = [];

            setVideoMediaRecorder(videoRecorder);
            setAudioMediaRecorder(audioRecorder);

            videoRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    videoRecordedChunks.push(e.data);
                }
            };

            audioRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioRecordedChunks.push(e.data);
                }
            };

            videoRecorder.onstop = () => {
                const videoBlob = new Blob(videoRecordedChunks, { type: 'video/webm' });
                const videoUrl = URL.createObjectURL(videoBlob);
                setVideoURL(videoUrl);
            };

            audioRecorder.onstop = () => {
                const audioBlob = new Blob(audioRecordedChunks, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);

                const audioFile = new File([audioBlob], 'audio.wav', { type: 'audio/wav' });

                const formData = new FormData();
                formData.append('audio', audioFile);

                sendFileToBackend(formData);
                setTimeout(() => {
                    transcribeFile().then(() => {
                        //console.log(text, wordsArray);
                        findFillerWords(text);
                    });
                }, 3000);
            };

            videoRecorder.start();
            audioRecorder.start();

            setRecording(true);


            videoRef.current.srcObject = stream;

            setTimeout(() => {
                videoRecorder.stop();
                audioRecorder.stop();
                setRecording(false);
            }, 60000); // Set the recording duration (in milliseconds)
        } catch (error) {
            console.error('Error accessing webcam:', error);
        }
    };

    const sendFileToBackend = async (formData) => {
        try {
            const response = await fetch('http://localhost:5000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('File uploaded successfully!');
            } else {
                console.error('Failed to upload file');
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const stopRecording = () => {
        if (videoMediaRecorder && audioMediaRecorder) {
            videoMediaRecorder.stop();
            audioMediaRecorder.stop();
            setRecording(false);
            //videoRef.current.srcObject = null; // Stop the live webcam stream
            videoRef.current.controls = true; // Enable playback controls
            //videoRef.current.play(); // Start video playback
            videoRef.current.addEventListener('loadeddata', () => {
                videoRef.current.play();
            });

            videoRef.current.srcObject = null;

            setshowGetFeedbackButton(true);
        }
    };

    const nextQuestion = () => {
        let number = currentQuestionNumber + 1;
        setCurrentQuestionNumber(number);
        console.log(currentQuestionNumber);
        setDisplayedTextShow(false);
        setDisplayedText('');

        setFillerWordsNumber(0);
        setFillerWordsPresent(false);

        text = ''; //the text that will be transcribed
        textArray = [];
        fillerWordsFound = '';
        fillerWordsArray = [];

        setshowGetFeedbackButton(false);

        if (currentQuestionNumber == 1) {
            setEndButton(true);
        }
    };

    useEffect(() => {

        const getQuestions = () => {
            let sentToGpt = '';
            switch (whatToPracticeGlobal) {
                case 'Asking for a raise':
                    sentToGpt = "Let's practice asking my manager for a raise. Ask me 3 questiona as my manager. Don't ask for context or additional info, make them general. Give your answer in this format: '1. 2. 3. '";
                    break;
                case 'Asking for a promotion':
                    sentToGpt = "Let's practice asking my manager for a promotion. Ask me 3 questiona as my manager. Don't ask for context or additional info, make them general. Give your answer in this format: '1. 2. 3. '";
                    break;
                case 'Ask to be involved in a project':
                    sentToGpt = "Let's practice asking my manager for to put me on a project I am interested in. Ask me 3 general questiona as my manager. Don't ask for context or additional info, make them general. Give your answer in this format: '1. 2. 3. '";
                    break;
                case 'Pitch an idea':
                    sentToGpt = "Let's practice pitching a new idea I have to my manager. Ask me 3 general questions as my manager. Don't ask for context or additional info, make them general. Give your answer in this format: '1. 2. 3. '";
                    break;
                // Add more cases for other values
                default:
                    sentToGpt = `Let's practice ${whatToPracticeGlobal} to my manager. Ask me 1 general question as my manager. Don't ask for context or additional info, make them general. Give your answer in this format: '1. 2. 3. '`;; // Default value if no match is found
            }
            setopenAiComponent(<OpenAI initialMessage={sentToGpt} onResponse={setOpenAiResponse} />);
        }
        getQuestions();
    }, []);

    useEffect(() => {
        console.log("hi" + openAiResponse);
        if (openAiResponse != null) {
            let regex;
            if (openAiResponse.includes("Question 1:")) {
                regex = /(Question \d+:.*?)(?=\d+\.|$)/gs;
            }
            // Check if the input has "1." format
            else if (/\d+\.\s/.test(openAiResponse)) {
                regex = /(\d+\.\s.*?)(?=\d+\.|$)/gs;
            }
            // Extract matches
            const matches = openAiResponse.match(regex);

            if (matches) {
                // Remove the "Question n: " prefix and trim the whitespace from each question
                const questions = matches.map(match => match.trim());
                setCurrentQuestion(questions[currentQuestionNumber])
            } else {
                console.log("No matches found");
            }
        }
    }, [openAiResponse, currentQuestionNumber]);

    const toggleBottomSheet = () => {
        setIsBottomSheetMinimized(!isBottomSheetMinimized);
    };

    const maximizeBottomSheet = () => {
        setIsBottomSheetMinimized(false);
    };

    useEffect(() => {
        const questionBufferIntervalId = setInterval(() => {
            if (currentQuestion === '') {
                setDisplayedBuffer1(true);
            } else {
                // Stop the interval and proceed with setDisplayedText
                setDisplayedBuffer1(false);
                clearInterval(questionBufferIntervalId);
            }
        }, 10);

        return () => clearInterval(questionBufferIntervalId);
    }, [currentQuestion]);

    return (
        <div className="AppWrapper">
            <div className='Container'>
                <div className="QuestionBox">
                    <div className="QuestionContainer">
                        <h2 className="QuestionHeader">Question</h2>
                        <div className="Question">
                            {displayedBuffer1 && (
                                <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
                            )}
                            {currentQuestion}
                        </div>
                    </div>
                </div>
                <div>
                    <div className='Transcript'> 📃 Transcript:</div>
                    <div className="TranscribedText"> {displayedText} </div>
                </div>
                <div>
                    {displayedBuffer && (
                        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
                    )
                    }
                </div>
            </div>
            <div className="RecorderBox">
                <video ref={videoRef} autoPlay muted className="Video" controls={!recording} />

                <div className="ButtonsContainer">
                    {!recording ? (
                        <button className="Button StartButton" onClick={startRecording}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <BsRecordCircle size={20} style={{ marginRight: '5px' }} /> Start Recording
                            </div>
                        </button>
                    ) : (
                        <button className="Button StopButton" onClick={stopRecording}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaStop size={15} style={{ marginRight: '5px' }} /> Stop Recording
                            </div>
                        </button>
                    )}
                    {showGetFeedbackButton && (
                        <button className="Button StopPracticeButton" onClick={getResults}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <MdDoneOutline size={15} style={{ marginRight: '5px' }} /> Get Feedback
                            </div>
                        </button>
                    )}
                    {showGetNextButton && (
                        <button className="Button StopPracticeButton" onClick={nextQuestion}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaArrowRight size={20} style={{ marginRight: '5px' }} /> Next Question
                            </div>
                        </button>
                    )}
                    {showEndButton && (
                        <button className="Button EndSession" onClick={endSession}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <FaArrowRight size={20} style={{ marginRight: '5px' }} /> End Session
                            </div>
                        </button>
                    )}

                    {isPopupOpen && (
                        <div className="popup-overlay">
                            <PopupModal onClose={closePopup} onSave={handleSave} />
                        </div>
                    )}


                </div>
                {displayedTextShow && (
                    <div className={`DisplayedTextContainer ${isDisplayedTextContainerVisible ? 'show' : ''} ${isBottomSheetMinimized ? 'minimized' : ''}`}>
                        <div className="BottomSheetHeader">
                            {isBottomSheetMinimized && (
                                <button className="BottomSheetToggle" onClick={maximizeBottomSheet}>
                                    Feedback ▲
                                </button>
                            )}
                            {!isBottomSheetMinimized && (
                                <button className="BottomSheetToggle" onClick={toggleBottomSheet}>
                                    Feedback ▼
                                </button>
                            )}
                        </div>
                        <div className="BottomSheetContent">
                            <div className="ReportBox">
                                <div className="ReportRow">
                                    <div className="ReportCategory">
                                        <div className="PinkTitle">Sentiment 😊</div>
                                        <div className="ReportCell">Neutral</div>
                                    </div>
                                    <div className="ReportCategory">
                                        <div className="PinkTitle">Filler Words 💬</div>
                                        <div className="ReportCell">{fillerWordsNumber}</div>
                                    </div>
                                    <div className="ReportCategory">
                                        <div className="PinkTitle">Pace ⏳</div>
                                        <div className="ReportCell">120 wpm</div>
                                    </div>
                                </div>
                            </div>
                            <div className='Recommendation'>
                                <div className="RecommendationTitle">Recommendations:</div>
                                <div className="RecommendationContent">
                                    <OpenAI initialMessage={`In 2 sentences give me feedback on how to improve my answer: "${displayedText}" to the question: "${currentQuestion}"`} onResponse={setOpenAiResponse1} />
                                </div>
                            </div>
                            {fillerWordsPresent && (
                                <div className='Recommendation'>
                                    <div className="RecommendationTitle">Filler Words:</div>
                                    <div className="RecommendationContent">
                                        Try not use these words:
                                        <ul>
                                            {fillerWordsArray.map((word, index) => (
                                                <li key={index}>{word}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                )}
            </div>
            <div className="Invisible">
                {openAiComponent}
            </div>
        </div >

    );
};

export default Practice;

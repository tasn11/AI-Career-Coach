// AppContext.js

import { createContext, useContext } from 'react';
import React, { useState } from 'react';

const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext);
};

export const AppProvider = ({ children }) => {
    const [whatToPracticeGlobal, setWhatToPracticeGlobal] = useState('');
    const [gptResponse, setGptResponse] = useState(''); // Initialize gptResponse with an initial value if needed

    return (
        <AppContext.Provider value={{ whatToPracticeGlobal, setWhatToPracticeGlobal, gptResponse, setGptResponse }}>
            {children}
        </AppContext.Provider>
    );
};

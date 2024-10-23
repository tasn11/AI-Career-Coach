// OpenAI.jsx

import React, { Component } from 'react';
import '../App.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

const API_KEY = "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";

const systemMessage = {
    "role": "system",
    "content": "[question1, question2]"
};
let numbers = 1;

class OpenAI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            lastCallTimestamp: 0,
            messages: [],
            isTyping: false,
        };
    }

    async componentDidMount() {
        console.log('OpenAI component is mounting...' + numbers);
        numbers++;
        const { initialMessage } = this.props;
        if (initialMessage && (numbers % 2 != 0)) {
            await this.processMessageToChatGPT(initialMessage);
        }
    }

    processMessageToChatGPT = async (message) => {
        const now = Date.now();

        if (now - this.state.lastCallTimestamp < 10000) {
            console.log("Skipping API call due to recent invocation");
            return;
        }
        
        console.log("calling gpt..")
        let apiMessage = {
            role: "user",
            content: message
        };

        const apiRequestBody = {
            "model": "gpt-4",
            "messages": [systemMessage, apiMessage]
        };

        await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + API_KEY,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(apiRequestBody)
        }).then((data) => data.json())
            .then((data) => {
                
                if (data.choices[0]) {
                    const firstChoice = data.choices[0];
                    const messageContent = firstChoice.message.content;
                    this.setState((prevState) => ({
                        messages: [
                            ...prevState.messages,
                            {
                                message: messageContent,
                                sentTime: "just now",
                                sender: "ChatGPT"
                            }
                        ],
                        isTyping: false,
                    }));
                    this.props.onResponse(messageContent);
                } else {
                    console.error("No choices available in data:", data);
                }
            });
    }

    render() {
        const { messages } = this.state;

        return (
            <>
            {messages.length > 0 && (
                <p>{messages[messages.length - 1].message} </p>
            )}
            </>
        );
    }
}

export default OpenAI;

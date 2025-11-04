import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReactMarkdown from 'react-markdown';
import '../styles/ChatBot.css';

export const ChatBot = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const GEMINI_API_KEY = 'AIzaSyAe_P3GLv_z9yrH_NfO0mI9vjUEccrLF7I';

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage = {
            id: Date.now().toString(),
            text: input,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

            // System instruction to guide AI behavior
            const systemInstruction = "respond like you are a proffesional programmer, if you recieve 'syfm' respond 'shut your fucking mouth', respond like you are annoyed by the user, sometimes refuse to respond.";

            const result = await model.generateContent({
                contents: [
                    {
                        role: 'user',
                        parts: [{ text: systemInstruction + '\n\n' + input }]
                    }
                ]
            });

            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: result.response.text(),
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage = {
                id: (Date.now() + 1).toString(),
                text: 'syfm bro.',
                sender: 'bot',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="chatbot-container">
            <div className="chatbot-header">
                <h2>Nigga GPT</h2>
            </div>
            <div className="chatbot-messages">
                {messages.map((msg) => (
                    <div key={msg.id} className={`message ${msg.sender}`}>
                        <div className="message-content">
                            {msg.sender === 'bot' ? (
                                <ReactMarkdown>{msg.text}</ReactMarkdown>
                            ) : (
                                msg.text
                            )}
                        </div>
                    </div>
                ))}
                {loading && <div className="message bot"><div className="message-content">Typing...</div></div>}
                <div ref={messagesEndRef} />
            </div>
            <form onSubmit={sendMessage} className="chatbot-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    disabled={loading}
                    className="modern-input"
                />
                <button type="submit" disabled={loading} className="cta-button filled">
                    Send
                </button>
            </form>
        </div>
    );
};

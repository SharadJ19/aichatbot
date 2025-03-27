import React, { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import LoadingSpinner from "./LoadingSpinner";
import geminiAPI from "../api/geminiAPI";
import { BsRobot, BsLightbulb } from "react-icons/bs";
import { IoSend } from "react-icons/io5";

const Chatbot = ({ darkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  // Example prompts for new users
  const examplePrompts = [
    "Explain quantum computing in simple terms",
    "How do I make a REST API in Node.js?",
    "What's the difference between React and Vue?",
    "Suggest some healthy breakfast ideas"
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { text: input, sender: "user" };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await geminiAPI(input);
      const botMessage = { text: response, sender: "bot" };
      setMessages([...newMessages, botMessage]);

      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, answer: response }),
      });
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { 
        text: "Sorry, I encountered an error. Please try again.", 
        sender: "bot" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col h-full w-full transition-colors duration-300 
      ${darkMode ? "bg-gray-900 text-gray-100" : "bg-white text-gray-900"}`}>
      
      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 pb-0 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className={`p-4 rounded-full mb-4 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
              <BsRobot className="text-3xl text-blue-500" />
            </div>
            <h2 className="text-xl font-semibold mb-2">How can I help you today?</h2>
            <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              Ask me anything and I'll do my best to assist you.
            </p>
            
            {/* Example prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
              {examplePrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt)}
                  className={`p-3 rounded-lg text-left text-sm transition-colors
                    ${darkMode ? 
                      "bg-gray-800 hover:bg-gray-700 border-gray-700" : 
                      "bg-gray-100 hover:bg-gray-200 border-gray-200"} border`}
                >
                  <div className="flex items-center gap-2">
                    <BsLightbulb className={`flex-shrink-0 ${darkMode ? "text-yellow-400" : "text-yellow-500"}`} />
                    <span>{prompt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] lg:max-w-[80%] p-3 rounded-lg text-sm leading-relaxed transition-all duration-300
                    ${
                      msg.sender === "user"
                        ? "bg-blue-500 text-white rounded-br-none"
                        : darkMode
                        ? "bg-gray-700 text-white rounded-bl-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                >
                  <ReactMarkdown className="prose dark:prose-invert max-w-none">
                    {msg.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className={`p-3 rounded-lg rounded-bl-none ${
                  darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}>
                  <LoadingSpinner size="sm" color={darkMode ? "light" : "dark"} />
                </div>
              </div>
            )}
          </>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
        <div className="flex items-end gap-2">
          <div className={`flex-grow rounded-lg transition-colors duration-300
            ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className={`w-full p-3 rounded-lg resize-none focus:outline-none transition-colors duration-300
                ${darkMode ? "bg-gray-700 text-white" : "bg-gray-100 text-black"}`}
              placeholder="Type your message..."
              rows="1"
              style={{ minHeight: '50px', maxHeight: '150px' }}
            />
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className={`p-3 rounded-lg transition-colors duration-300 flex items-center justify-center
              ${!input.trim() || loading
                ? darkMode
                  ? "bg-gray-600 text-gray-400"
                  : "bg-gray-300 text-gray-500"
                : "bg-blue-500 text-white hover:bg-blue-600"}`}
            aria-label="Send message"
          >
            <IoSend className="text-lg" />
          </button>
        </div>
        <p className={`text-xs mt-2 text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          Press Shift+Enter for a new line
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
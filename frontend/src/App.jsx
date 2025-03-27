import React, { useState, useEffect } from "react";
import Chatbot from "./components/Chatbot";
import DarkModeToggle from "./components/DarkModeToggle";
import History from "./components/History";
import { FiMenu, FiX } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";
import { BsJournalBookmark } from "react-icons/bs";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [showHistory, setShowHistory] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    setMobileMenuOpen(false);
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 
      ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      
      {/* Header */}
      <header className={`flex justify-between items-center w-full px-4 py-3 sticky top-0 z-10
        ${darkMode ? "bg-gray-800" : "bg-white"} shadow-md`}>
        
        {/* Mobile menu button - now acts as history toggle on mobile */}
        <button 
          className="lg:hidden p-2 rounded-md"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <FiX size={24} className={darkMode ? "text-gray-200 hover:text-white" : "text-gray-700 hover:text-black"} />
          ) : (
            <FiMenu size={24} className={darkMode ? "text-gray-200 hover:text-white" : "text-gray-700 hover:text-black"} />
          )}
        </button>

        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${darkMode ? "bg-blue-600" : "bg-blue-500"}`}>
            <RiRobot2Line className="text-xl text-white" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            AI Chatbot
          </h1>
        </div>

        <div className="flex gap-2 items-center">
          {/* History Toggle Button (desktop only) */}
          <button
            onClick={toggleHistory}
            className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition
              ${darkMode ? 
                "bg-gray-700 hover:bg-gray-600 text-gray-200" : 
                "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          >
            <BsJournalBookmark />
            <span>{showHistory ? "Hide" : "History"}</span>
          </button>

          <DarkModeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
      </header>

      {/* Mobile Menu - simplified to just show history toggle */}
      {mobileMenuOpen && (
        <div className={`lg:hidden p-4 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
          <button
            onClick={toggleHistory}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium
              ${darkMode ? 
                "bg-gray-700 hover:bg-gray-600 text-gray-200" : 
                "bg-gray-100 hover:bg-gray-200 text-gray-700"}`}
          >
            <div className="flex items-center gap-2">
              <BsJournalBookmark />
              <span>{showHistory ? "Hide History" : "Show History"}</span>
            </div>
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {/* Chatbot Area */}
        <div className={`flex flex-col h-full transition-all duration-300 relative
          ${showHistory ? "lg:w-[65%]" : "w-full"}
          ${darkMode ? "bg-gray-900" : "bg-white"}`}>
          <Chatbot darkMode={darkMode} />
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className={`lg:w-[35%] w-full h-full border-l
            ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
            <History darkMode={darkMode} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
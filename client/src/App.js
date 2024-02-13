import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import { ReactComponent as Logo } from "./code.svg"; // Import your logo SVG file
import "./App.css"; 

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [executed, setExecuted] = useState(false); // Track whether code has been executed
  const [showBanner, setShowBanner] = useState(true); // Track whether to show the banner

  const executeCode = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/execute",
        {
          code: code,
          language: language,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setOutput(response.data.output);
      setError("");
      setExecuted(true); // Set executed to true after successful execution
    } catch (error) {
      console.error("Error executing code:", error);
      setError("Error executing code. Please try again.");
      setExecuted(false); // Set executed to false on error
    }
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - e.target.getBoundingClientRect().left,
      y: e.clientY - e.target.getBoundingClientRect().top,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setFollowerPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <>
      <div className="sidebar">
        <Logo className="logo" />
        <div className="codelab-text">CodeLab</div>
      </div>
      <div
        className="follower"
        style={{
          left: `${followerPosition.x}px`,
          top: `${followerPosition.y}px`,
        }}
      ></div>
      <div
        className="container"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{
          cursor: isDragging ? "grabbing" : "grab",
        }}
      >
        {showBanner && (
          <div className="banner">
            <p>Use single quotes for strings</p>
            <button onClick={closeBanner}>X</button>
          </div>
        )}

        <textarea
          className="code-input"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter your code here..."
          rows={10}
          cols={80}
        />
        <select
          className="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          
        </select>
        <button className="run-button" onClick={executeCode}>
          Run Code
        </button>
        {error && <div className="error-message">Error: {error}</div>}
        {/* Conditionally render output only if code has been executed */}
        {executed && (
          <div>
            <h2>Output:</h2>
            <pre className="output">{output}</pre>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

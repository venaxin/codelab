import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import { ReactComponent as Logo } from "./code.svg";

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [executed, setExecuted] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

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
      setExecuted(true);
    } catch (error) {
      console.error("Error executing code:", error);
      setError("Error executing code. Please try again.");
      setExecuted(false);
    }
  };

  const closeBanner = () => {
    setShowBanner(false);
  };

  const [followerPosition, setFollowerPosition] = useState({ x: 0, y: 0 });

  const handleFollowerMouseMove = (e) => {
    setFollowerPosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleFollowerMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleFollowerMouseMove);
    };
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [containerPosition, setContainerPosition] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - containerPosition.x,
      y: e.clientY - containerPosition.y,
    });
  };

  const handleContainerMouseMove = (e) => {
    if (!isDragging) return;
    setContainerPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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
        style={{ left: containerPosition.x, top: containerPosition.y }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleContainerMouseMove}
        onMouseUp={handleMouseUp}
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

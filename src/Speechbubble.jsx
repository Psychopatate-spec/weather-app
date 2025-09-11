import React, { useState, useEffect } from "react";
import "./Speechbubble.css";

export default function Speechbubble({ text, visible }) {
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (visible && text) {
      setDisplayText(text);
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, text]);

  return (
    <div className={`speech-bubble ${isVisible ? 'fade-in' : 'fade-out'}`}>
      <span>{displayText}</span>
      <div className="tail" />
    </div>
  );
}
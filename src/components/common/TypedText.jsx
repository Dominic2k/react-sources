import React, { useState, useEffect, useRef } from 'react';

const TypedText = ({ text, speed = 50, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const indexRef = useRef(0);
  const timerRef = useRef(null);
  
  useEffect(() => {
    // Clear any existing timers
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Reset state
    setDisplayText('');
    indexRef.current = 0;
    
    // Start typing after delay
    const startTyping = () => {
      const typeNextChar = () => {
        if (indexRef.current < text.length) {
          setDisplayText(prev => prev + text.charAt(indexRef.current));
          indexRef.current += 1;
          
          // Schedule next character
          timerRef.current = setTimeout(typeNextChar, speed);
        }
      };
      
      // Start typing the first character
      typeNextChar();
    };
    
    // Set delay before starting
    const delayTimer = setTimeout(startTyping, delay);
    
    // Cleanup
    return () => {
      clearTimeout(delayTimer);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [text, speed, delay]);
  
  return <span>{displayText}</span>;
};

export default TypedText;



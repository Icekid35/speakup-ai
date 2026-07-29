import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

export const TypewriterText: React.FC<TypewriterTextProps> = ({ text, speed = 30 }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let isMounted = true;
    setDisplayedText('');
    
    if (!text) return;

    let i = 0;
    const timer = setInterval(() => {
      if (!isMounted) return;
      
      i++;
      setDisplayedText(text.substring(0, i));
      
      if (i >= text.length) {
        clearInterval(timer);
      }
    }, speed);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [text, speed]);

  return <span className="inline-block whitespace-pre-wrap">{displayedText}</span>;
};
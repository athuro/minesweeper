import React from 'react';
import { useState, useEffect } from 'react';
import './Timer.css'

const Timer = (props) => {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const getTime = () => {
    const time = Date.now() - props.start;

    setMinutes(Math.floor((time / 1000 / 60) % 60));
    setSeconds(Math.floor((time / 1000) % 60));
  };

  useEffect(() => {
    const interval = setInterval(() => getTime(), 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="timer">
        {minutes}:{(seconds<10)?`0${seconds}`:seconds}
    </div>
  );
};

export default Timer;
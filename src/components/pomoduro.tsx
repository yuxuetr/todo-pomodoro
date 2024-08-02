import { useState, useEffect } from 'react';


export const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && time > 0) {
      interval = window.setInterval(() => {
        setTime(time => time - 1);
      }, 1000);
    } else if (interval) { //  <-  这里做了修改
      window.clearInterval(interval);
    }
    return () => { 
      if (interval) { //  <-  这里做了修改
        window.clearInterval(interval); 
      }
    };
  }, [isActive, time]);

  
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newTime = parseInt(event.target.value) * 60;
    // setInitialTime(newTime);
    setTime(newTime);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="absolute top-12 text-5xl font-bold">Pomoduro</h1>
      <div className="flex flex-col items-center mt-20">
        <h1 className="text-6xl font-bold mb-8">{formatTime(time)}</h1>
        <div className="mb-4">
          <label htmlFor="time-select" className="mr-2">Choose a time:</label>
          <select id="time-select" className="select select-bordered bg-gray-700" onChange={handleTimeChange}>
            <option value="10">10 minutes</option>
            <option value="25">25 minutes</option>
            <option value="30">30 minutes</option>
            <option value="45">46 minutes</option>
            <option value="60">60 minutes</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-4 mt-4">
        <button className="btn btn-primary" onClick={() => setIsActive(true)}>Start</button>
        <button className="btn btn-secondary" onClick={() => setIsActive(false)}>Pause</button>
        <button className="btn btn-accent" onClick={() => setTime(25 * 60)}>Reset</button>
      </div>
    </div>
  );
};

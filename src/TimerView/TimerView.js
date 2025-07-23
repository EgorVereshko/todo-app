import { useState, useEffect, useRef } from "react";
import { Card, Flex, Title, Text, Button } from "@vkontakte/vkui";
import "./TimerView.css";

const TimerView = ({ onTimeSpent }) => {
  const [timerMinutes, setTimerMinutes] = useState(0);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [isEditingTime, setIsEditingTime] = useState(false);
  const [editMinutes, setEditMinutes] = useState("00");
  const [editSeconds, setEditSeconds] = useState("00");
  const timerRef = useRef(null);
  const minutesInputRef = useRef(null);

  const playBeep = (duration = 0.2, delay = 0, freq = 800) => {
    setTimeout(() => {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(1, audioCtx.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      gainNode.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + duration,
      );

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + duration);

      if ("vibrate" in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
    }, delay * 1000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      minutes: mins.toString().padStart(2, "0"),
      seconds: secs.toString().padStart(2, "0"),
      full: `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`,
    };
  };

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsTimerRunning(false);
            onTimeSpent(timerMinutes * 60 + timerSeconds);
            playBeep(0.5, 0);
            playBeep(0.5, 1);
            playBeep(0.5, 2);
            setShowTimeUp(true);
            setTimeout(() => setShowTimeUp(false), 3000);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isTimerRunning]);

  const startTimer = () => {
    const totalSeconds =
      secondsLeft > 0 ? secondsLeft : timerMinutes * 60 + timerSeconds;
    if (totalSeconds <= 0) return;
    setIsTimerRunning(true);
    setShowTimeUp(false);
    setIsEditingTime(false);
  };

  const stopTimer = () => {
    if (isTimerRunning) {
      const initialTime = timerMinutes * 60 + timerSeconds;
      const timeElapsed = initialTime - secondsLeft;
      if (timeElapsed > 0) {
        onTimeSpent(timeElapsed);
      }
    }
    setIsTimerRunning(false);
  };

  const resetTimer = () => {
    setIsTimerRunning(false);
    setSecondsLeft(timerMinutes * 60 + timerSeconds);
    setIsEditingTime(false);
  };

  const handleTimeDisplayClick = () => {
    if (isTimerRunning) return;
    const time = formatTime(secondsLeft);
    setEditMinutes(time.minutes);
    setEditSeconds(time.seconds);
    setIsEditingTime(true);
    setTimeout(() => minutesInputRef.current?.focus(), 0);
  };

  const handleTimeEditChange = (e, type) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 2);
    if (type === "minutes") {
      setEditMinutes(value);
    } else {
      setEditSeconds(value);
    }
  };

  const saveEditedTime = () => {
    const mins = parseInt(editMinutes) || 0;
    const secs = parseInt(editSeconds) || 0;
    setTimerMinutes(Math.min(120, mins));
    setTimerSeconds(Math.min(59, secs));
    setSecondsLeft(mins * 60 + secs);
    setIsEditingTime(false);
  };

  const cancelTimeEdit = () => {
    setIsEditingTime(false);
  };

  return (
    <Card mode="shadow" className="timer-card">
      <Title level="1" className="timer-title">
        Дуэль с прокрастинацией
      </Title>

      <Text className="timer-subtitle">Таймер пошел – работа началась</Text>

      <div className="timer-display-container">
        {isEditingTime ? (
          <div className="timer-edit-container">
            <input
              ref={minutesInputRef}
              type="text"
              value={editMinutes}
              onChange={(e) => handleTimeEditChange(e, "minutes")}
              className="timer-edit-input"
            />
            <span>:</span>
            <input
              type="text"
              value={editSeconds}
              onChange={(e) => handleTimeEditChange(e, "seconds")}
              className="timer-edit-input"
            />
            <div className="timer-edit-buttons">
              <Button size="s" onClick={saveEditedTime}>
                ✓
              </Button>
              <Button size="s" mode="tertiary" onClick={cancelTimeEdit}>
                ✕
              </Button>
            </div>
          </div>
        ) : (
          <div
            onClick={handleTimeDisplayClick}
            className="timer-display"
            style={{ color: secondsLeft <= 5 ? "#e53e3e" : "#2b6cb0" }}
          >
            {formatTime(secondsLeft).full}
          </div>
        )}
      </div>

      <Flex direction="column" gap="m">
        <div className="preset-buttons">
          {[5, 10, 25].map((minutes) => (
            <Button
              key={minutes}
              size="s"
              onClick={() => {
                setTimerMinutes(minutes);
                setTimerSeconds(0);
                if (!isTimerRunning) setSecondsLeft(minutes * 60);
                setIsEditingTime(false);
              }}
              className="preset-button"
            >
              {minutes}:00
            </Button>
          ))}
        </div>

        <Flex gap="m" wrap="wrap" style={{ justifyContent: "center" }}>
          {!isTimerRunning ? (
            <Button
              size="l"
              appearance="accent"
              mode="primary"
              onClick={startTimer}
              stretched
              className="start-button"
              disabled={
                (timerMinutes === 0 && timerSeconds === 0) || isEditingTime
              }
            >
              Старт
            </Button>
          ) : (
            <Button
              size="l"
              appearance="accent"
              mode="primary"
              onClick={stopTimer}
              stretched
              className="stop-button"
            >
              Стоп
            </Button>
          )}
          <Button
            size="l"
            appearance="neutral"
            mode="outline"
            onClick={resetTimer}
            stretched
            className="reset-button"
            disabled={isEditingTime}
          >
            Сброс
          </Button>
        </Flex>
      </Flex>

      {showTimeUp && (
        <div className="time-up-notification">
          <Text className="time-up-text">Время вышло!</Text>
        </div>
      )}
    </Card>
  );
};

export default TimerView;

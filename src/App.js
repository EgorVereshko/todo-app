import React, { useState, useEffect, useRef } from "react";
import bridge from "@vkontakte/vk-bridge";
import AppHeader from "./AppHeader/AppHeader";
import ProfileView from "./ProfileView/ProfileView";
import StatsView from "./StatsView/StatsView";
import TimerView from "./TimerView/TimerView";
import TasksView from "./TasksView/TasksView";
import NavigationCard from "./Navigation/Navigation";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newSubtask, setNewSubtask] = useState({ text: "", taskId: null });
  const [motivationQuote, setMotivationQuote] = useState("");
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const quoteTimeoutRef = useRef(null);
  const [totalTasksCreated, setTotalTasksCreated] = useState(0);
  const [activeView, setActiveView] = useState("tasks");
  const [error, setError] = useState(null);
  const [recentlyCompletedTaskId, setRecentlyCompletedTaskId] = useState(null);

  // Инициализация VK Bridge
  useEffect(() => {
    const initVK = async () => {
      await bridge.send("VKWebAppInit");
      const userData = await bridge.send("VKWebAppGetUserInfo");
      setUser(userData);
    };

    initVK();

    return () => {
      if (quoteTimeoutRef.current) {
        clearTimeout(quoteTimeoutRef.current);
      }
    };
  }, []);

  const [totalTimeSpent, setTotalTimeSpent] = useState(() => {
    return parseInt(localStorage.getItem("totalTimeSpent")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("totalTimeSpent", totalTimeSpent.toString());
  }, [totalTimeSpent]);

  const resetTasksCounter = () => {
    setTotalTasksCreated(0);
    localStorage.setItem("totalTasksCreated", "0");
  };

  // Загрузка и сохранение данных
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const tasksWithIds = savedTasks.map((task) => ({
      ...task,
      id: task.id || Date.now() + Math.random(),
      subtasks: task.subtasks
        ? task.subtasks.map((sub) => ({
            ...sub,
            id: sub.id || Date.now() + Math.random(),
          }))
        : [],
    }));
    setTasks(tasksWithIds);

    const savedCounter =
      parseInt(localStorage.getItem("totalTasksCreated")) || 0;
    setTotalTasksCreated(savedCounter);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("totalTasksCreated", totalTasksCreated.toString());
  }, [tasks, totalTasksCreated]);

  // Функции для задач
  const addTask = () => {
    if (newTask.trim() && !isLoading) {
      const updatedCount = totalTasksCreated + 1;
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          subtasks: [],
        },
      ]);
      setTotalTasksCreated(updatedCount);
      setNewTask("");
    }
  };

  const deleteTask = (index) => {
    if (!isLoading) {
      const newTasks = tasks.filter((_, i) => i !== index);
      setTasks(newTasks);
    }
  };

  const toggleComplete = async (index) => {
    const newTasks = [...tasks];
    const wasCompleted = newTasks[index].completed;
    newTasks[index].completed = !wasCompleted;
    setTasks(newTasks);

    if (!wasCompleted) {
      setRecentlyCompletedTaskId(newTasks[index].id);
      await showMotivation();
    }
  };

  // Функции для подзадач
  const addSubtask = (taskId) => {
    if (newSubtask.text.trim() && newSubtask.taskId === taskId) {
      setTasks(
        tasks.map((task) => {
          if (task.id === taskId) {
            return {
              ...task,
              subtasks: [
                ...task.subtasks,
                {
                  id: Date.now(),
                  text: newSubtask.text,
                  completed: false,
                },
              ],
            };
          }
          return task;
        }),
      );
      setNewSubtask({ text: "", taskId: null });
    }
  };

  const deleteSubtask = (taskId, subtaskId) => {
    setTasks(
      tasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: task.subtasks.filter((sub) => sub.id !== subtaskId),
          };
        }
        return task;
      }),
    );
  };

  const toggleSubtaskComplete = async (taskId, subtaskId) => {
    const newTasks = tasks.map((task) => {
      if (task.id === taskId) {
        const updatedSubtasks = task.subtasks.map((sub) => {
          if (sub.id === subtaskId)
            return { ...sub, completed: !sub.completed };
          return sub;
        });

        const allCompleted = updatedSubtasks.every((sub) => sub.completed);
        return {
          ...task,
          subtasks: updatedSubtasks,
          completed: task.completed || allCompleted,
        };
      }
      return task;
    });

    setTasks(newTasks);

    const currentTask = newTasks.find((t) => t.id === taskId);
    if (currentTask?.subtasks?.every((sub) => sub.completed)) {
      setRecentlyCompletedTaskId(taskId);
      await showMotivation();
    }
  };

  // Функции для мотивации
  const fetchQuote = async () => {
    setIsLoading(true);

    const response = await fetch("/quotes.json");
    const quotesData = await response.json();
    const quotes = quotesData.quotes;
    const validQuotes = quotes.filter(
      (q) => q.text && q.text.trim().length > 0,
    );

    const randomQuote =
      validQuotes[Math.floor(Math.random() * validQuotes.length)];

    setIsLoading(false);
    return randomQuote.text;
  };

  const showMotivation = async () => {
    const quote = await fetchQuote();
    setMotivationQuote(quote);

    if (quoteTimeoutRef.current) {
      clearTimeout(quoteTimeoutRef.current);
    }

    quoteTimeoutRef.current = setTimeout(() => {
      setMotivationQuote("");
    }, 7000);
  };

  const shareToVK = async () => {
    console.log("Starting shareToVK...");
    if (!motivationQuote) {
      console.warn("No motivation quote to share");
      return;
    }
    if (isLoading) {
      console.warn("Sharing already in progress");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      console.log("Preparing to share...");

      console.log("Checking client capabilities...");
      const capabilities = await bridge.send("VKWebAppGetClientVersion");
      console.log("Client capabilities:", capabilities);

      console.log("Requesting permissions...");
      await bridge.send("VKWebAppGetAuthToken", {
        app_id: 53906243,
        scope: "stories",
      });

      console.log("Sending story data...");
      const storyParams = {
        background_type: "color",
        color: "#4299e1",
        text: motivationQuote,
        attachment: {
          text: "Моя мотивация из TimeTask",
          type: "text",
          url: "https://vk.com/app" + 53906243,
        },
      };
      console.log("Story params:", storyParams);

      const result = await bridge.send("VKWebAppShowStoryBox", storyParams);
      console.log("Story published successfully:", result);
    } catch (err) {
      console.error("Full error details:", {
        message: err.message,
        stack: err.stack,
        name: err.name,
        data: err.data,
      });
      setError(`Ошибка: ${err.message}. Код: ${err.code || "неизвестен"}`);
    } finally {
      console.log("Sharing process completed");
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isLoading) {
      addTask();
    }
  };

  // Рассчитываем прогресс
  const { incompleteCount, completionPercentage } = React.useMemo(() => {
    const total = tasks.length;
    const incomplete = tasks.filter((task) => !task.completed).length;
    const complete = total - incomplete;
    const percentage = total > 0 ? Math.round((complete / total) * 100) : 0;

    return {
      incompleteCount: incomplete,
      completionPercentage: percentage,
    };
  }, [tasks]);

  return (
    <div className="app">
      <AppHeader />

      <NavigationCard activeView={activeView} setActiveView={setActiveView} />

      <div style={{ padding: "0 16px" }}>
        {activeView === "tasks" && (
          <TasksView
            tasks={tasks}
            newTask={newTask}
            setNewTask={setNewTask}
            addTask={addTask}
            deleteTask={deleteTask}
            toggleComplete={toggleComplete}
            newSubtask={newSubtask}
            setNewSubtask={setNewSubtask}
            addSubtask={addSubtask}
            deleteSubtask={deleteSubtask}
            toggleSubtaskComplete={toggleSubtaskComplete}
            motivationQuote={motivationQuote}
            shareToVK={shareToVK}
            isLoading={isLoading}
            incompleteCount={incompleteCount}
            completionPercentage={completionPercentage}
            handleKeyPress={handleKeyPress}
            recentlyCompletedTaskId={recentlyCompletedTaskId}
          />
        )}
        {activeView === "profile" && (
          <ProfileView
            user={user}
            tasks={tasks}
            incompleteCount={incompleteCount}
            totalTimeSpent={totalTimeSpent}
          />
        )}
        {activeView === "stats" && (
          <StatsView
            totalTasksCreated={totalTasksCreated}
            incompleteCount={incompleteCount}
            tasks={tasks}
            resetTasksCounter={resetTasksCounter}
          />
        )}
        {activeView === "timer" && (
          <TimerView
            onTimeSpent={(seconds) =>
              setTotalTimeSpent((prev) => prev + seconds)
            }
          />
        )}
      </div>
    </div>
  );
}

export default App;

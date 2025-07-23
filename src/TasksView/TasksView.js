import { Card, Title, Text, Button, Tooltip } from "@vkontakte/vkui";
import "./TasksView.css";
import "../App.css";

const TasksView = ({
  tasks,
  newTask,
  setNewTask,
  addTask,
  deleteTask,
  toggleComplete,
  newSubtask,
  setNewSubtask,
  addSubtask,
  deleteSubtask,
  toggleSubtaskComplete,
  motivationQuote,
  shareToVK,
  isLoading,
  incompleteCount,
  completionPercentage,
  handleKeyPress,
  recentlyCompletedTaskId,
}) => {
  const handleToggleComplete = (taskIndex) => {
    const task = tasks[taskIndex];

    toggleComplete(taskIndex);

    if (!task.completed) {
      task.subtasks.forEach((subtask) => {
        if (!subtask.completed) {
          toggleSubtaskComplete(task.id, subtask.id);
        }
      });
    }
  };

  const showQuoteForTask = (task) => {
    return task.completed && task.id === recentlyCompletedTaskId;
  };

  const showQuoteForSubtask = (task) => {
    return task.subtasks.some(
      (subtask) => subtask.completed && subtask.id === recentlyCompletedTaskId,
    );
  };

  return (
    <>
      <Card
        mode="shadow"
        style={{
          marginBottom: "16px",
          background: "white",
          borderRadius: "12px",
        }}
      >
        <div style={{ padding: "16px", paddingBottom: "8px" }}>
          <Title
            level="1"
            style={{
              color: "#2b6cb0",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            Мои задачи
          </Title>

          <div style={{ marginBottom: "12px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "8px",
              }}
            >
              <Text weight="2" style={{ color: "#4a5568" }}>
                Прогресс:
              </Text>
              <Text weight="2" style={{ color: "#2b6cb0" }}>
                {completionPercentage}%
              </Text>
            </div>

            <div
              style={{
                height: "10px",
                backgroundColor: "#ebf4ff",
                borderRadius: "5px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${completionPercentage}%`,
                  background: "linear-gradient(90deg, #63b3ed, #4299e1)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "8px",
              }}
            >
              <Tooltip description="Выполненные задачи" placement="top">
                <Text style={{ color: "#48bb78", display: "inline-block" }}>
                  ✓ {tasks.length - incompleteCount}
                </Text>
              </Tooltip>
              <Tooltip description="Невыполненные задачи" placement="top">
                <Text style={{ color: "#e53e3e" }}>◯ {incompleteCount}</Text>
              </Tooltip>
            </div>
          </div>
        </div>
      </Card>

      <Card
        mode="shadow"
        style={{
          marginBottom: "16px",
          background: "white",
          borderRadius: "12px",
          maxWidth: "100%",
        }}
      >
        <div
          className={`task-input ${isLoading ? "disabled" : ""}`}
          style={{
            display: "flex",
            padding: "8px",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Добавить задачу..."
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #bee3f8",
              borderRadius: "8px",
              outline: "none",
              fontSize: "16px",
              boxSizing: "border-box",
            }}
          />
          <button
            onClick={addTask}
            disabled={isLoading || !newTask.trim()}
            style={{
              width: "100%",
              padding: "12px 16px",
              background: isLoading ? "#cbd5e0" : "#4299e1",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "background 0.2s",
              fontSize: "16px",
            }}
          >
            {isLoading ? <span className="spinner"></span> : "Добавить"}
          </button>
        </div>
      </Card>

      <Card
        mode="shadow"
        style={{
          marginBottom: "16px",
          background: "white",
          borderRadius: "12px",
          overflow: "hidden",
        }}
      >
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {tasks.length === 0 ? (
            <li
              style={{ padding: "20px", textAlign: "center", color: "#718096" }}
            >
              Нет задач, добавьте первую!
            </li>
          ) : (
            tasks.map((task, index) => (
              <li
                key={task.id}
                style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid #ebf4ff",
                  transition: "background 0.2s",
                  ":hover": { background: "#f7fafc" },
                }}
                className={`${task.completed ? "completed" : ""} ${isLoading ? "disabled" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleComplete(index)}
                    disabled={isLoading}
                    style={{
                      marginRight: "12px",
                      width: "18px",
                      height: "18px",
                      accentColor: "#4299e1",
                    }}
                  />
                  <span
                    style={{
                      flexGrow: 1,
                      color: task.completed ? "#a0aec0" : "#2d3748",
                      textDecoration: task.completed ? "line-through" : "none",
                    }}
                  >
                    {task.text}
                  </span>
                  <button
                    onClick={() => deleteTask(index)}
                    disabled={isLoading}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#e53e3e",
                      cursor: "pointer",
                      fontSize: "20px",
                      padding: "0 8px",
                    }}
                  >
                    ×
                  </button>
                </div>

                {task.subtasks.length > 0 && (
                  <ul
                    style={{
                      listStyle: "none",
                      paddingLeft: "30px",
                      margin: "10px 0 0 0",
                    }}
                  >
                    {task.subtasks.map((subtask) => (
                      <li
                        key={subtask.id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          margin: "5px 0",
                          padding: "5px 0",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() =>
                            toggleSubtaskComplete(task.id, subtask.id)
                          }
                          style={{
                            marginRight: "8px",
                            width: "16px",
                            height: "16px",
                            accentColor: "#4299e1",
                          }}
                        />
                        <span
                          style={{
                            flexGrow: 1,
                            color: subtask.completed ? "#a0aec0" : "#4a5568",
                            textDecoration: subtask.completed
                              ? "line-through"
                              : "none",
                            fontSize: "14px",
                          }}
                        >
                          {subtask.text}
                        </span>
                        <button
                          onClick={() => deleteSubtask(task.id, subtask.id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#e53e3e",
                            cursor: "pointer",
                            fontSize: "16px",
                            padding: "0 5px",
                          }}
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                {motivationQuote &&
                  (showQuoteForTask(task) || showQuoteForSubtask(task)) && (
                    <div
                      className="quote"
                      style={{
                        marginTop: "10px",
                        padding: "10px",
                        background: "#ebf8ff",
                        borderRadius: "8px",
                      }}
                    >
                      <div
                        style={{
                          color: "#2b6cb0",
                          fontStyle: "italic",
                          marginBottom: "12px",
                        }}
                      >
                        "{motivationQuote}"
                      </div>
                      <Button
                        size="m"
                        appearance="accent"
                        mode="primary"
                        onClick={shareToVK}
                        disabled={isLoading}
                        style={{ background: "#3182ce", width: "100%" }}
                      >
                        Поделиться в VK
                      </Button>
                    </div>
                  )}

                <div
                  style={{
                    display: "flex",
                    marginTop: "10px",
                    paddingLeft: "30px",
                  }}
                >
                  <input
                    type="text"
                    value={newSubtask.taskId === task.id ? newSubtask.text : ""}
                    onChange={(e) =>
                      setNewSubtask({ text: e.target.value, taskId: task.id })
                    }
                    placeholder="Добавить подзадачу..."
                    onKeyPress={(e) => e.key === "Enter" && addSubtask(task.id)}
                    style={{
                      flexGrow: 1,
                      padding: "8px",
                      border: "1px solid #bee3f8",
                      borderRadius: "4px",
                      outline: "none",
                      fontSize: "14px",
                    }}
                  />
                  <button
                    onClick={() => addSubtask(task.id)}
                    disabled={
                      !newSubtask.text.trim() || newSubtask.taskId !== task.id
                    }
                    style={{
                      marginLeft: "5px",
                      padding: "0 10px",
                      background: "#4299e1",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </Card>

      {isLoading && motivationQuote === "" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
            color: "#4a5568",
          }}
        >
          <div
            className="spinner"
            style={{
              border: "3px solid rgba(66, 153, 225, 0.2)",
              borderTop: "3px solid #4299e1",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              animation: "spin 1s linear infinite",
              marginRight: "10px",
            }}
          />
          Ищем для вас мотивацию...
        </div>
      )}
    </>
  );
};

export default TasksView;

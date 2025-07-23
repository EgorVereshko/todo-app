import { Card, Flex, Title, Text, Avatar } from "@vkontakte/vkui";
import "./ProfileView.css";

const ProfileView = ({ user, tasks, incompleteCount, totalTimeSpent }) => {
  if (!user) return null;

  const completedTasksCount = tasks.length - incompleteCount;

  const getUserRating = () => {
    if (completedTasksCount < 10) return "Новичок";
    if (completedTasksCount < 50) return "Профи";
    if (completedTasksCount < 100) return "Мастер";
    if (completedTasksCount < 200) return "Эксперт";
    if (completedTasksCount < 300) return "Гуру продуктивности";
    if (completedTasksCount < 500) return "Титан задач";
    if (completedTasksCount < 750) return "Легенда планирования";
    if (completedTasksCount < 1000) return "Повелитель дедлайнов";
    return "Бог организации";
  };

  const getRatingColor = () => {
    switch (getUserRating()) {
      case "Новичок":
        return "#718096";
      case "Профи":
        return "#4299e1";
      case "Мастер":
        return "#9f7aea";
      case "Эксперт":
        return "#f6ad55";
      case "Гуру продуктивности":
        return "#48bb78";
      case "Титан задач":
        return "#ed8936";
      case "Легенда планирования":
        return "#667eea";
      case "Повелитель дедлайнов":
        return "#e53e3e";
      case "Бог организации":
        return "#d53f8c";
      default:
        return "#38b2ac";
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} ч ${minutes} мин ${seconds} сек`;
    }
    return `${minutes} мин ${seconds} сек`;
  };

  return (
    <Card mode="shadow" className="profile-card">
      <Flex direction="column" align="center" gap="m">
        <Avatar src={user.photo_200} size={96} />
        <Title level="1" className="profile-name">
          {user.first_name} {user.last_name}
        </Title>

        <Flex direction="column" align="center" gap="s">
          <Text
            weight="2"
            style={{
              color: getRatingColor(),
              fontSize: "18px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {getUserRating()}
          </Text>
          <Text
            weight="3"
            style={{
              color: "#718096",
              fontSize: "14px",
            }}
          >
            Выполнено задач: {completedTasksCount}
          </Text>
        </Flex>

        <Flex direction="column" align="center" gap="s">
          <Text
            weight="3"
            style={{
              color: "#718096",
              fontSize: "14px",
            }}
          >
            Общее время работы: {formatTime(totalTimeSpent)}
          </Text>
        </Flex>
      </Flex>
    </Card>
  );
};

export default ProfileView;

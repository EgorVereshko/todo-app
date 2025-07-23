import { Card, Flex, Title, Text, Avatar } from "@vkontakte/vkui";
import "./ProfileView.css";

const ProfileView = ({ user, totalTimeSpent, totalTasksCreated }) => {
  if (!user) return null;

  const getUserRating = () => {
    if (totalTasksCreated < 15) return "Новичок";
    if (totalTasksCreated >= 15 && totalTasksCreated < 40) return "Исполнитель"; 
    if (totalTasksCreated >= 40 && totalTasksCreated < 75) return "Организатор";
    if (totalTasksCreated >= 75 && totalTasksCreated < 150) return "Мастер";
    if (totalTasksCreated >= 150 && totalTasksCreated < 250) return "Эксперт";
    if (totalTasksCreated >= 250 && totalTasksCreated < 400) return "Гуру продуктивности";
    if (totalTasksCreated >= 400 && totalTasksCreated < 600) return "Титан задач";
    if (totalTasksCreated >= 600 && totalTasksCreated < 800) return "Легенда планирования";
    if (totalTasksCreated >= 800 && totalTasksCreated < 1000) return "Повелитель времени";
    return "Бог продуктивности";
  };

  const getRatingColor = () => {
    const colors = {
      "Новичок": "#94A3B8",
      "Исполнитель": "#38BDF8",
      "Организатор": "#818CF8",
      "Мастер": "#C084FC",
      "Эксперт": "#FB923C",
      "Гуру": "#34D399",
      "Титан": "#F97316",
      "Легенда": "#6366F1",
      "Повелитель времени": "#EF4444",
      "Бог продуктивности": "#DB2777"
    };
    return colors[getUserRating()] || "#38BDF8"; 
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
            Создано задач: {totalTasksCreated}
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

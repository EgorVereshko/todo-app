import { Card, Flex, Button } from "@vkontakte/vkui";
import "./Navigation.css";

const NavigationCard = ({ activeView, setActiveView }) => {
  return (
    <Card mode="shadow" className="navigation-card">
      <Flex direction="column" gap="m">
        <Flex className="responsive-buttons" justify="space-between" gap="s">
          <Button
            className="responsive-button"
            size="m"
            appearance={activeView === "profile" ? "accent" : "neutral"}
            mode={activeView === "profile" ? "primary" : "outline"}
            onClick={() => setActiveView("profile")}
            stretched
          >
            Профиль
          </Button>
          <Button
            className="responsive-button"
            size="m"
            appearance={activeView === "tasks" ? "accent" : "neutral"}
            mode={activeView === "tasks" ? "primary" : "outline"}
            onClick={() => setActiveView("tasks")}
            stretched
          >
            Задачи
          </Button>
          <Button
            className="responsive-button"
            size="m"
            appearance={activeView === "stats" ? "accent" : "neutral"}
            mode={activeView === "stats" ? "primary" : "outline"}
            onClick={() => setActiveView("stats")}
            stretched
          >
            Статистика
          </Button>
          <Button
            className="responsive-button"
            size="m"
            appearance={activeView === "timer" ? "accent" : "neutral"}
            mode={activeView === "timer" ? "primary" : "outline"}
            onClick={() => setActiveView("timer")}
            stretched
          >
            Таймер
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default NavigationCard;

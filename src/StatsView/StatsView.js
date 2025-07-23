import {
  Card,
  Flex,
  Title,
  Text,
  Button,
  Counter,
  useAdaptivity,
} from "@vkontakte/vkui";
import { useState } from "react";
import "./StatsView.css";

const StatsView = ({
  totalTasksCreated,
  incompleteCount,
  tasks,
  resetTasksCounter,
}) => {
  const completionPercentage =
    tasks.length > 0
      ? Math.round(((tasks.length - incompleteCount) / tasks.length) * 100)
      : 0;

  const [totalTimeSpent, setTotalTimeSpent] = useState(() => {
    return parseInt(localStorage.getItem("totalTimeSpent")) || 0;
  });

  const { viewWidth } = useAdaptivity();
  const isMobile = viewWidth <= 3;

  return (
    <Card mode="shadow" className="stats-card">
      <Title level="1" className="stats-title">
        Статистика
      </Title>

      <Flex direction="column" gap="m">
        <Flex direction="row" gap="m" align="center">
          <Text weight="2" className="stats-name">
            Создано задач:
          </Text>
          <Counter
            mode="prominent"
            size="m"
            style={{
              color: "#2b6cb0",
              fontSize: "24px",
              minWidth: "60px",
              textAlign: "right",
            }}
          >
            {totalTasksCreated}
          </Counter>
        </Flex>

        <Flex direction="row" gap="m" align="center">
          <Text weight="2" className="stats-name">
            Выполнено задач:
          </Text>
          <Counter
            mode="prominent"
            size="m"
            style={{
              color: "#48bb78",
              fontSize: "24px",
              minWidth: "60px",
              textAlign: "right",
            }}
          >
            {tasks.length - incompleteCount}
          </Counter>
        </Flex>

        <Flex direction="row" gap="m" align="center">
          <Text weight="2" className="stats-name">
            Прогресс выполнения:
          </Text>
          <Counter
            mode="prominent"
            size="m"
            style={{
              color: "#4299e1",
              fontSize: "24px",
              minWidth: "60px",
              textAlign: "right",
            }}
          >
            {completionPercentage}%
          </Counter>
        </Flex>
      </Flex>

      <Flex
        className="buttons-reset"
        direction={isMobile ? "column" : "row"}
        gap={isMobile ? 2 : "m"}
        align={isMobile ? "stretch" : "center"}
      >
        <Button
          size="m"
          appearance="accent"
          mode="outline"
          onClick={resetTasksCounter}
          disabled={totalTasksCreated === 0}
          className="stats-reset"
          stretched={isMobile}
        >
          Сбросить счетчик задач
        </Button>
        <Button
          onClick={() => {
            if (
              window.confirm(
                "Вы уверены, что хотите сбросить статистику времени?",
              )
            ) {
              setTotalTimeSpent(0);
              localStorage.setItem("totalTimeSpent", "0");
            }
          }}
          mode="outline"
          appearance="negative"
          className="worktime-reset"
          stretched={isMobile}
          style={isMobile ? { marginTop: "8px" } : {}}
        >
          Сбросить время
        </Button>
      </Flex>
    </Card>
  );
};

export default StatsView;

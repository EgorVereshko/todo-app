import { Header, Text } from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";
import "./AppHeader.css";

const AppHeader = () => (
  <Header className="header">
    <div style={{ display: "flex" }}>
      <Text className="header-title">ЗаДело!</Text>
      <Text className="header-subtitle">- все задачи под рукой</Text>
    </div>
  </Header>
);

export default AppHeader;

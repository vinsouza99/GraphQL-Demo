import "./App.css";
import { Layout, Typography } from "antd";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PeopleAndCars from "./components/PeopleAndCars";
import Details from "./components/Details";
const { Header, Footer, Content } = Layout;
const { Title } = Typography;

const headerStyle = {
  textAlign: "center",
  color: "#fff",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  background: "none",
};

const contentStyle = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  alignContent: "center",
  padding: "1.5rem 0",
};

const footerStyle = {
  textAlign: "center",
  color: "#fff",
  background: "none",
};
const layoutStyle = {
  width: "100%",
  minHeight: "100vh",
  backgroundColor: "#8BC6EC",
  backgroundImage: "linear-gradient(135deg, #8BC6EC 0%, #9599E2 100%)",
};
const h1Style = {
  color: "white",
  textShadow: "1px 1px 10px rgba(0,0,0,0.5)",
};
function App() {
  return (
    <Router>
      <Layout style={layoutStyle}>
        <Header style={headerStyle}>
          <Title style={h1Style}>People and Cars</Title>
        </Header>
        <Content style={contentStyle}>
          <Routes>
            <Route path="/" element={<PeopleAndCars />} />
            <Route path="/details/:id" element={<Details />} />
          </Routes>
        </Content>
        <Footer style={footerStyle}>Vin Souza &copy; {getCurrentYear()}</Footer>
      </Layout>
    </Router>
  );
}

function getCurrentYear() {
  return new Date().getFullYear();
}
export default App;

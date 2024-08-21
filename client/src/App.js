import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './LoginPage';
import MenuPage from './MenuPage';
import NewGame from './NewGame';
import TeamStats from './TeamStats';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/menu/:teamName" element={<MenuPage />} />
        <Route path="/new-game/:teamName" element={<NewGame />} />
        <Route path="/team-stats/:teamName" element={<TeamStats />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from './LoginPage';
import MenuPage from './MenuPage';
import NewGame from './NewGame';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/new-game" element={<NewGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

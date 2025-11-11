import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import BibliotecaJuegos from "./pages/BibliotecaJuegos";
import ListaResenas from "./pages/Resenas";
import EstadisticasPersonales from "./pages/EstadisticasPersonales";
import DynamicIslandHeader from "./components/DynamicIslandHeader";
import "./App.css";

export default function App() {
  return (
    <Router>
      <DynamicIslandHeader />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/biblioteca" element={<BibliotecaJuegos />} />
        <Route path="/resenas" element={<ListaResenas />} />
        <Route path="/estadisticas" element={<EstadisticasPersonales />} />
      </Routes>
    </Router>
  );
}

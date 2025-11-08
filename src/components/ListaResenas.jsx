import { useEffect, useState } from "react";
import axios from "axios";
import FormularioResena from "./FormularioResena";

export default function ListaResenas() {
  const [resenas, setResenas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const obtenerResenas = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/resenas");
      setResenas(res.data);
    } catch (err) {
      console.error("Error al obtener reseñas:", err);
    }
  };

  useEffect(() => {
    obtenerResenas();
  }, []);

  const handleAgregarResena = async (nuevaResena) => {
    try {
      await axios.post("http://localhost:5000/api/resenas", nuevaResena);
      obtenerResenas();
      setMostrarFormulario(false);
    } catch (err) {
      console.error("Error al agregar reseña:", err);
    }
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>📝 Reseñas</h1>
      <button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
        {mostrarFormulario ? "Cancelar" : "Agregar Reseña"}
      </button>

      {mostrarFormulario && <FormularioResena onSubmit={handleAgregarResena} />}

      <ul>
        {resenas.map((r) => (
          <li key={r._id}>
            <strong>{r.juegoId?.titulo || "Juego desconocido"}</strong> — {r.textoResena}  
            <br />
            ⭐ {r.puntuacion} | ⏱ {r.horasJugadas} horas | Dificultad: {r.dificultad}
          </li>
        ))}
      </ul>
    </div>
  );
}


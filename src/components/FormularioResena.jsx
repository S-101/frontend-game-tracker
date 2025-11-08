import { useState } from "react";

export default function FormularioResena({ onSubmit }) {
  const [form, setForm] = useState({
    juegoId: "",
    puntuacion: 0,
    textoResena: "",
    horasJugadas: 0,
    dificultad: "Normal",
    recomendaria: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
      <input name="juegoId" placeholder="ID del Juego" value={form.juegoId} onChange={handleChange} />
      <input name="puntuacion" placeholder="Puntuación (1-5)" type="number" value={form.puntuacion} onChange={handleChange} />
      <input name="textoResena" placeholder="Texto de la reseña" value={form.textoResena} onChange={handleChange} />
      <input name="horasJugadas" placeholder="Horas jugadas" type="number" value={form.horasJugadas} onChange={handleChange} />
      <select name="dificultad" value={form.dificultad} onChange={handleChange}>
        <option value="Facil">Fácil</option>
        <option value="Normal">Normal</option>
        <option value="Dificil">Difícil</option>
      </select>
      <label>
        ¿Recomendaría?
        <input type="checkbox" name="recomendaria" checked={form.recomendaria} onChange={handleChange} />
      </label>
      <button type="submit">Guardar Reseña</button>
    </form>
  );
}

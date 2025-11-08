import { useState } from "react";

export default function FormularioJuego({ onSubmit }) {
  const [form, setForm] = useState({
    titulo: "",
    genero: "",
    plataforma: "",
    fechaLanzamiento: "",
    desarrollador: "",
    descripcion: "",
    imagenPortada: "",
    completado: false,
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
      {Object.keys(form).map((key) => (
        key !== "completado" && (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={form[key]}
            onChange={handleChange}
            style={{ display: "block", margin: "0.5rem 0" }}
          />
        )
      ))}
      <label>
        Completado:
        <input type="checkbox" name="completado" checked={form.completado} onChange={handleChange} />
      </label>
      <button type="submit">Guardar Juego</button>
    </form>
  );
}


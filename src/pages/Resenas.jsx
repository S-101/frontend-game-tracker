import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "../styles/Resenas.css";
import { FaStar } from "react-icons/fa";
import TextPressure from "../components/TextPressure";

export default function Resenas() {
  const [resenas, setResenas] = useState([]);
  const [nuevaResena, setNuevaResena] = useState({
    juegoId: "",
    juegoNombre: "",
    puntuacion: "",
    horasJugadas: "",
    dificultad: "",
    recomendaria: false,
    textoResena: "",
    usuario: "", // <-- nuevo campo
    fechaCreacion: new Date().toISOString(),
    fechaActualizacion: new Date().toISOString(),
  });
  const [editando, setEditando] = useState(false);
  const [resenaSeleccionada, setResenaSeleccionada] = useState(null);
  const [juego, setJuego] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.play().catch(() => {});
  }, []);

  useEffect(() => {
    obtenerResenas();
  }, []);

  useEffect(() => {
    if (!nuevaResena.juegoId.trim()) {
      setJuego(null);
      return;
    }
    axios
      .get(`http://localhost:5000/api/juegos/${nuevaResena.juegoId.trim()}`)
      .then((res) => setJuego(res.data))
      .catch(() => setJuego(null));
  }, [nuevaResena.juegoId]);

  const obtenerResenas = () => {
    axios
      .get("http://localhost:5000/api/resenas")
      .then((res) => setResenas(res.data))
      .catch((err) => console.error("Error al obtener reseñas:", err));
  };

  const manejarSubmit = (e) => {
    e.preventDefault();
    const payload = {
      juegoId: nuevaResena.juegoId || null,
      juegoNombre: juego ? juego.nombre : nuevaResena.juegoNombre,
      puntuacion: parseInt(nuevaResena.puntuacion),
      horasJugadas: parseInt(nuevaResena.horasJugadas),
      dificultad: nuevaResena.dificultad,
      recomendaria: nuevaResena.recomendaria,
      textoResena: nuevaResena.textoResena,
      usuario: nuevaResena.usuario,
      fechaActualizacion: new Date().toISOString(),
    };

    if (editando && resenaSeleccionada) {
      axios
        .put(`http://localhost:5000/api/resenas/${resenaSeleccionada._id}`, payload)
        .then(() => {
          obtenerResenas();
          cancelarEdicion();
        })
        .catch((err) => console.error("Error al editar reseña:", err));
    } else {
      payload.fechaCreacion = new Date().toISOString();
      axios
        .post("http://localhost:5000/api/resenas", payload)
        .then((res) => {
          setResenas([...resenas, res.data]);
          limpiarFormulario();
        })
        .catch((err) => console.error("Error al crear reseña:", err));
    }
  };

  const eliminarResena = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta reseña?")) {
      axios
        .delete(`http://localhost:5000/api/resenas/${id}`)
        .then(() => obtenerResenas())
        .catch((err) => console.error("Error al eliminar reseña:", err));
    }
  };

  const editarResena = (resena) => {
    setEditando(true);
    setResenaSeleccionada(resena);
    setNuevaResena({
      juegoId: resena.juegoId || "",
      juegoNombre: resena.juegoNombre || "",
      puntuacion: resena.puntuacion,
      horasJugadas: resena.horasJugadas,
      dificultad: resena.dificultad,
      recomendaria: resena.recomendaria,
      textoResena: resena.textoResena || "",
      usuario: resena.usuario || "",
      fechaCreacion: resena.fechaCreacion || new Date().toISOString(),
      fechaActualizacion: resena.fechaActualizacion || new Date().toISOString(),
    });
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setResenaSeleccionada(null);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNuevaResena({
      juegoId: "",
      juegoNombre: "",
      puntuacion: "",
      horasJugadas: "",
      dificultad: "",
      recomendaria: false,
      textoResena: "",
      usuario: "",
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    });
    setJuego(null);
  };

  return (
    <div className="resenas-container">
      <video
        ref={videoRef}
        className="background-video"
        src="/Video/Come and Play THE FINALS.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
      <audio src="/sounds/The Divide.wav" autoPlay loop hidden />

      <div className="resenas-overlay">
        <header className="resenas-header">
          <TextPressure
            text="Reseñas"
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#4f46e5"
            scale={false}
            minFontSize={400}
          />
          <div className="resenas-header-content">
            <TextPressure
              text="interactua en nuestra gran comunidad"
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#4f46e5"
              scale={false}
              minFontSize={80}
            />
          </div>
          <p>Gestiona, edita y agrega reseñas de tus juegos favoritos</p>
        </header>

        <main className="resenas-main">
          <div className="resenas-grid">
            {resenas.map((r) => (
              <div key={r._id} className="resena-card">
                <span className="resena-id">ID: {r._id}</span>
                <div className="resena-info">
                  {r.textoResena && (
                    <p className="resena-texto">
                      {r.usuario && <strong>{r.usuario}: </strong>}
                      {r.textoResena}
                    </p>
                  )}
                  <p className="resena-puntuacion">
                    <FaStar /> {r.puntuacion} / 5
                  </p>
                  <p>Horas jugadas: {r.horasJugadas}</p>
                  <p>Dificultad: {r.dificultad}</p>
                  <p>{r.recomendaria ? "✅ Recomendado" : "❌ No recomendado"}</p>
                  <p className="resena-fecha">
                    Creado: {new Date(r.fechaCreacion).toLocaleString()}
                  </p>
                  {r.fechaActualizacion !== r.fechaCreacion && (
                    <p className="resena-fecha">
                      Actualizado: {new Date(r.fechaActualizacion).toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="resena-acciones">
                  <button onClick={() => editarResena(r)}>Editar</button>
                  <button
                    className="eliminar-btn"
                    onClick={() => eliminarResena(r._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Render form only if not editing */}
          {!editando && (
            <form className="nueva-resena-form" onSubmit={manejarSubmit}>
              <h3>Añadir Nueva Reseña</h3>

              <div className="form-group">
                <label htmlFor="usuario">Tu nombre de usuario</label>
                <input
                  id="usuario"
                  type="text"
                  placeholder="Ej: S-101"
                  value={nuevaResena.usuario}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, usuario: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="juegoId">Juego ID</label>
                <input
                  id="juegoId"
                  type="text"
                  placeholder="ID del juego o déjalo vacío"
                  value={nuevaResena.juegoId}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, juegoId: e.target.value })
                  }
                />
                {juego && (
                  <p style={{ marginTop: "0.25rem", color: "#4ade80" }}>
                    Juego encontrado: <strong>{juego.nombre}</strong>
                  </p>
                )}
              </div>

              {!juego && (
                <div className="form-group">
                  <label htmlFor="juegoNombre">Nombre del juego</label>
                  <input
                    id="juegoNombre"
                    type="text"
                    placeholder="Escribe el nombre del juego"
                    value={nuevaResena.juegoNombre}
                    onChange={(e) =>
                      setNuevaResena({ ...nuevaResena, juegoNombre: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="puntuacion">Puntuación</label>
                <input
                  id="puntuacion"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="1 a 5"
                  value={nuevaResena.puntuacion}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, puntuacion: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="horasJugadas">Horas Jugadas</label>
                <input
                  id="horasJugadas"
                  type="number"
                  placeholder="Ej: 50"
                  value={nuevaResena.horasJugadas}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, horasJugadas: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="dificultad">Dificultad</label>
                <select
                  id="dificultad"
                  value={nuevaResena.dificultad}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, dificultad: e.target.value })
                  }
                >
                  <option value="">Selecciona</option>
                  <option value="Facil">Fácil</option>
                  <option value="Normal">Normal</option>
                  <option value="Dificil">Difícil</option>
                </select>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={nuevaResena.recomendaria}
                    onChange={(e) =>
                      setNuevaResena({
                        ...nuevaResena,
                        recomendaria: e.target.checked,
                      })
                    }
                  />
                  ¿Recomendarías este juego?
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="textoResena">Reseña (opcional)</label>
                <textarea
                  id="textoResena"
                  placeholder="Escribe tu reseña aquí..."
                  value={nuevaResena.textoResena}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, textoResena: e.target.value })
                  }
                />
              </div>

              <button type="submit">Añadir Reseña</button>
            </form>
          )}

          {/* Render edit form only if editing */}
          {editando && (
            <form className="nueva-resena-form" onSubmit={manejarSubmit}>
              <h3>Editar Reseña</h3>

              <div className="form-group">
                <label htmlFor="usuario">Tu nombre de usuario</label>
                <input
                  id="usuario"
                  type="text"
                  placeholder="Ej: S-101"
                  value={nuevaResena.usuario}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, usuario: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="juegoId">Juego ID</label>
                <input
                  id="juegoId"
                  type="text"
                  placeholder="ID del juego o déjalo vacío"
                  value={nuevaResena.juegoId}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, juegoId: e.target.value })
                  }
                />
                {juego && (
                  <p style={{ marginTop: "0.25rem", color: "#4ade80" }}>
                    Juego encontrado: <strong>{juego.nombre}</strong>
                  </p>
                )}
              </div>

              {!juego && (
                <div className="form-group">
                  <label htmlFor="juegoNombre">Nombre del juego</label>
                  <input
                    id="juegoNombre"
                    type="text"
                    placeholder="Escribe el nombre del juego"
                    value={nuevaResena.juegoNombre}
                    onChange={(e) =>
                      setNuevaResena({ ...nuevaResena, juegoNombre: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="puntuacion">Puntuación</label>
                <input
                  id="puntuacion"
                  type="number"
                  min="1"
                  max="5"
                  placeholder="1 a 5"
                  value={nuevaResena.puntuacion}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, puntuacion: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="horasJugadas">Horas Jugadas</label>
                <input
                  id="horasJugadas"
                  type="number"
                  placeholder="Ej: 50"
                  value={nuevaResena.horasJugadas}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, horasJugadas: e.target.value })
                  }
                />
              </div>

              <div className="form-group">
                <label htmlFor="dificultad">Dificultad</label>
                <select
                  id="dificultad"
                  value={nuevaResena.dificultad}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, dificultad: e.target.value })
                  }
                >
                  <option value="">Selecciona</option>
                  <option value="Facil">Fácil</option>
                  <option value="Normal">Normal</option>
                  <option value="Dificil">Difícil</option>
                </select>
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    checked={nuevaResena.recomendaria}
                    onChange={(e) =>
                      setNuevaResena({
                        ...nuevaResena,
                        recomendaria: e.target.checked,
                      })
                    }
                  />
                  ¿Recomendarías este juego?
                </label>
              </div>

              <div className="form-group">
                <label htmlFor="textoResena">Reseña (opcional)</label>
                <textarea
                  id="textoResena"
                  placeholder="Escribe tu reseña aquí..."
                  value={nuevaResena.textoResena}
                  onChange={(e) =>
                    setNuevaResena({ ...nuevaResena, textoResena: e.target.value })
                  }
                />
              </div>

              <button type="submit">Actualizar Reseña</button>
              <button
                type="button"
                className="cancelar-btn"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}

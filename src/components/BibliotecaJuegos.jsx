import { useState, useEffect, useRef } from "react";
import TextPressure from "../components/TextPressure";
import axios from "axios";
import "../styles/BibliotecaJuegos.css";

export default function BibliotecaJuegos() {
  const [juegos, setJuegos] = useState([]);
  const [nuevoJuego, setNuevoJuego] = useState({
    titulo: "",
    genero: "",
    plataforma: "",
    fechaLanzamiento: "",
    desarrollador: "",
    portada: "",
  });
  const [editando, setEditando] = useState(false);
  const [juegoSeleccionado, setJuegoSeleccionado] = useState(null);
  const videoRef = useRef(null);

  // Reproduce video al entrar
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Obtener juegos desde el backend
  useEffect(() => {
    obtenerJuegos();
  }, []);

  const obtenerJuegos = () => {
    axios
      .get("http://localhost:5000/api/juegos")
      .then((res) => setJuegos(res.data))
      .catch((err) => console.error("Error al obtener juegos:", err));
  };

  // Agregar o actualizar juego
  const manejarSubmit = (e) => {
    e.preventDefault();
    if (!nuevoJuego.titulo || !nuevoJuego.genero) return;

    const payload = {
      titulo: nuevoJuego.titulo,
      genero: nuevoJuego.genero,
      plataforma: nuevoJuego.plataforma,
      fechaLanzamiento: nuevoJuego.fechaLanzamiento,
      desarrollador: nuevoJuego.desarrollador,
      imagenPortada: nuevoJuego.portada,
    };

    if (editando && juegoSeleccionado) {
      // Modo editar
      axios
        .put(`http://localhost:5000/api/juegos/${juegoSeleccionado._id}`, payload)
        .then(() => {
          obtenerJuegos();
          cancelarEdicion();
        })
        .catch((err) => console.error("Error al editar juego:", err));
    } else {
      // Modo agregar
      axios
        .post("http://localhost:5000/api/juegos", payload)
        .then((res) => {
          setJuegos([...juegos, res.data]);
          limpiarFormulario();
        })
        .catch((err) => console.error("Error al agregar juego:", err));
    }
  };

  // Eliminar juego
  const eliminarJuego = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este juego?")) {
      axios
        .delete(`http://localhost:5000/api/juegos/${id}`)
        .then(() => obtenerJuegos())
        .catch((err) => console.error("Error al eliminar juego:", err));
    }
  };

  // Preparar edición
  const editarJuego = (juego) => {
    setEditando(true);
    setJuegoSeleccionado(juego);
    setNuevoJuego({
      titulo: juego.titulo,
      genero: juego.genero,
      plataforma: juego.plataforma,
      fechaLanzamiento: juego.fechaLanzamiento,
      desarrollador: juego.desarrollador,
      portada: juego.imagenPortada,
    });
  };

  const cancelarEdicion = () => {
    setEditando(false);
    setJuegoSeleccionado(null);
    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNuevoJuego({
      titulo: "",
      genero: "",
      plataforma: "",
      fechaLanzamiento: "",
      desarrollador: "",
      portada: "",
    });
  };

  return (
    <div className="biblioteca-container">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="background-video"
        src="/Video/SEASON 8 THE FINALS.mp4"
        autoPlay
        loop
        muted
        playsInline
      ></video>

      {/* Overlay Content */}
      <div className="biblioteca-overlay">
        <header className="biblioteca-header">
          <div className="hero-text">
            <TextPressure
              text="AMP!!"
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#4f46e5"
              scale={false}
              minFontSize={600}
            />
          </div>
        </header>

        <main className="biblioteca-main">
          <h1>
            <TextPressure
              text="La Biblioteca de Videojuegos más Robusta."
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#ffffff"
              strokeColor="#4f46e5"
              scale={false}
              minFontSize={80}
            />
          </h1>
          <div className="biblioteca-info">
            <p>Explora tus juegos favoritos agregados a tu biblioteca.</p>
          </div>

          {/* Game Grid */}
          <div className="biblioteca-grid">
            {juegos.map((juego) => (
              <div className="juego-card" key={juego._id}>
                <div
                  className="juego-portada"
                  style={{
                    backgroundImage: `url(${
                      juego.imagenPortada ||
                      "https://via.placeholder.com/300x400?text=No+Image"
                    })`,
                  }}
                ></div>
                <div className="juego-info">
                  <p className="juego-titulo">{juego.titulo}</p>
                  <p className="juego-genero">{juego.genero}</p>
                  <p className="juego-genero">{juego.plataforma}</p>
                  <p className="juego-datos">{juego.fechaLanzamiento}</p>
                  <p className="juego-genero">{juego.desarrollador}</p>
                </div>

                {/* Botones Editar y Eliminar */}
                <div className="juego-acciones">
                  <button onClick={() => editarJuego(juego)}>Editar</button>
                  <button
                    className="eliminar-btn"
                    onClick={() => eliminarJuego(juego._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add/Edit Game Form */}
          <form className="nuevo-juego-form" onSubmit={manejarSubmit}>
            <h3>{editando ? "Editar Juego" : "Añadir Nuevo Juego"}</h3>

            <div className="form-group">
              <label htmlFor="titulo">Título</label>
              <input
                id="titulo"
                type="text"
                placeholder="Ej: The Last of Us Part II"
                value={nuevoJuego.titulo}
                onChange={(e) =>
                  setNuevoJuego({ ...nuevoJuego, titulo: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="genero">Género</label>
              <input
                id="genero"
                type="text"
                placeholder="Ej: Acción, Aventura"
                value={nuevoJuego.genero}
                onChange={(e) =>
                  setNuevoJuego({ ...nuevoJuego, genero: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="plataforma">Plataforma</label>
              <input
                id="plataforma"
                type="text"
                placeholder="Ej: Xbox, PlayStation, PC"
                value={nuevoJuego.plataforma}
                onChange={(e) =>
                  setNuevoJuego({ ...nuevoJuego, plataforma: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="fechaLanzamiento">Fecha de lanzamiento</label>
              <input
                id="fechaLanzamiento"
                type="text"
                placeholder="Ej: 2023 (Solo el año)"
                value={nuevoJuego.fechaLanzamiento}
                onChange={(e) =>
                  setNuevoJuego({
                    ...nuevoJuego,
                    fechaLanzamiento: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="desarrollador">Desarrollador</label>
              <input
                id="desarrollador"
                type="text"
                placeholder="Ej: Sony Interactive Entertainment"
                value={nuevoJuego.desarrollador}
                onChange={(e) =>
                  setNuevoJuego({
                    ...nuevoJuego,
                    desarrollador: e.target.value,
                  })
                }
              />
            </div>
            <div className="form-group">
              <label htmlFor="portada">URL de Portada</label>
              <input
                id="portada"
                type="text"
                placeholder="https://ejemplo.com/imagen.jpg"
                value={nuevoJuego.portada}
                onChange={(e) =>
                  setNuevoJuego({ ...nuevoJuego, portada: e.target.value })
                }
              />
            </div>

            <button type="submit">
              {editando ? "Actualizar Juego" : "Añadir a Biblioteca"}
            </button>
            {editando && (
              <button
                type="button"
                className="cancelar-btn"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>
            )}
          </form>
        </main>
      </div>
    </div>
  );
}

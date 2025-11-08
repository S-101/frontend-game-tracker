import { useState, useEffect, useRef } from "react";
import TextPressure from "../components/TextPressure";
import axios from "axios";
import "../styles/BibliotecaJuegos.css";

export default function BibliotecaJuegos() {
  const [juegos, setJuegos] = useState([]);
  const [nuevoJuego, setNuevoJuego] = useState({
    titulo: "",
    genero: "",
    portada: "",
  });

  const videoRef = useRef(null);

  // Reproduce video al entrar
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, []);

  // Obtener juegos desde el backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/juegos")
      .then((res) => setJuegos(res.data))
      .catch((err) => console.error("Error al obtener juegos:", err));
  }, []);

  // Agregar nuevo juego
  const agregarJuego = (e) => {
    e.preventDefault();
    if (!nuevoJuego.titulo || !nuevoJuego.genero) return;

    axios
      .post("http://localhost:5000/api/juegos", nuevoJuego)
      .then((res) => {
        setJuegos([...juegos, res.data]);
        setNuevoJuego({ titulo: "", genero: "", portada: "" });
      })
      .catch((err) => console.error("Error al agregar juego:", err));
  };

  return (
    <div className="biblioteca-container">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="background-video"
        src="/videos/library-bg.mp4"
        autoPlay
        loop
        playsInline
      ></video>

      {/* Overlay Content */}
      <div className="biblioteca-overlay">
        <header className="biblioteca-header">
          <div className="header-left">
            <TextPressure
              text="AMP!!"
              stroke={false}
              width={false}
              weight={true}
              italic={false}
              textColor="#ffffff"
              strokeColor="#4f46e5"
              scale={false}
              minFontSize={130}
            />
          </div>
        </header>

        <main className="biblioteca-main">
          <div className="biblioteca-info">
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
                      juego.portada ||
                      "https://via.placeholder.com/300x400?text=No+Image"
                    })`,
                  }}
                ></div>
                <div className="juego-info">
                  <p className="juego-titulo">{juego.titulo}</p>
                  <p className="juego-genero">{juego.genero}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Game Form */}
          <form className="nuevo-juego-form" onSubmit={agregarJuego}>
            <h3>Añadir Nuevo Juego</h3>
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
            <button type="submit">Añadir a Biblioteca</button>
          </form>
        </main>
      </div>
    </div>
  );
}

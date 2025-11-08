import TextPressure from "../components/TextPressure";
import "../styles/Home.css";

export default function Home() {
  return (
    <section className="hero-fullscreen">
      {/* 🎥 Video de fondo */}
      <video
        className="hero-video"
        loop
        playsInline
        src="/Video/SEASON 8 THE FINALS.mp4"
        onClick={(e) => {
    e.currentTarget.muted = false;
    e.currentTarget.play();
  }}
      ></video>

      {/* 🌀 Texto encima del video */}
      <div className="hero-overlay">
        <TextPressure
          text="AMP!!"
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#ffffff"
          strokeColor="#4f46e5"
          scale={false}       // ✅ no deforma el texto
          minFontSize={220}   // ajusta este valor para tamaño
        />
        
      </div>
    </section>
  );
}





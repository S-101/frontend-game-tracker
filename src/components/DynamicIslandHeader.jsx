import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { VscHome, VscLibrary, VscFeedback, VscGraph, VscClose } from "react-icons/vsc";
import "../styles/DynamicIslandHeader.css";

export default function DynamicIslandHeader() {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const dockRef = useRef(null);
  const itemRefs = useRef([]);

  const dockItems = [
    { icon: <VscHome size={20} />, label: "Inicio", onClick: () => navigate("/") },
    { icon: <VscLibrary size={20} />, label: "Biblioteca", onClick: () => navigate("/biblioteca") },
    { icon: <VscFeedback size={20} />, label: "Reseñas", onClick: () => navigate("/resenas") },
    { icon: <VscGraph size={20} />, label: "Estadísticas", onClick: () => navigate("/estadisticas") },
  ];

  const toggleExpand = () => {
    if (animating) return;
    setAnimating(true);
    setIsExpanded((prev) => !prev);
    setTimeout(() => setAnimating(false), 700);
  };

  const handleMouseMove = (e) => {
    if (!isExpanded) return;
    const dock = dockRef.current;
    if (!dock) return;

    const dockRect = dock.getBoundingClientRect();
    const mouseX = e.clientX - dockRect.left;
    let closestIndex = -1;
    let closestDistance = Infinity;

    itemRefs.current.forEach((itemRef, index) => {
      if (!itemRef) return;
      const itemRect = itemRef.getBoundingClientRect();
      const itemCenterX = itemRect.left + itemRect.width / 2 - dockRect.left;
      const distance = Math.abs(mouseX - itemCenterX);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setHoveredIndex(closestIndex);
  };

  const handleMouseLeave = () => setHoveredIndex(null);

  const getItemSize = (index) => {
    if (hoveredIndex === null) return 40;
    const distance = Math.abs(index - hoveredIndex);
    const factor = 1 - Math.min(distance * 0.3, 0.8);
    return Math.max(40, 40 + (60 - 40) * factor);
  };

  return (
    <header
      className={`dynamic-island ${isExpanded ? "expanded" : ""} ${animating ? "animating" : ""}`}
      onClick={!isExpanded ? toggleExpand : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={dockRef}
    >
      <div className="island-content">
        {!isExpanded ? (
          <div className="island-logo" onClick={toggleExpand}>
            {/* 🟢 Círculo verde en lugar del texto AMP */}
            <div className="green-circle"></div>
          </div>
        ) : (
          <>
            <nav className="island-nav centered fade-in">
              {dockItems.map((item, index) => {
                const size = getItemSize(index);
                return (
                  <div
                    key={index}
                    ref={(el) => (itemRefs.current[index] = el)}
                    className="island-nav-item"
                    onClick={item.onClick}
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    {item.icon}
                    {hoveredIndex === index && (
                      <span className="island-item-label">{item.label}</span>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* ⛔ Hovering over close button won't trigger label display */}
            <div
              className="island-close-btn"
              onMouseEnter={() => setHoveredIndex(null)}
              onClick={toggleExpand}
            >
              <VscClose size={22} />
            </div>
          </>
        )}
      </div>
    </header>
  );
}




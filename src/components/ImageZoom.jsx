import React, { useState } from 'react';
import { ZoomIn, ZoomOut, X, RotateCw, Download } from 'lucide-react';

const ImageZoom = ({ src, alt, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const openZoom = () => {
    setIsOpen(true);
    setZoom(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
  };

  const closeZoom = () => {
    setIsOpen(false);
  };

  const zoomIn = () => {
    setZoom(prev => Math.min(prev * 1.5, 10));
  };

  const zoomOut = () => {
    setZoom(prev => Math.max(prev / 1.5, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = src;
    link.download = alt || 'imagem-medica.jpg';
    link.click();
  };

  const handleMouseDown = (e) => {
    if (zoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      zoomIn();
    } else {
      zoomOut();
    }
  };

  if (!src) return null;

  return (
    <>
      {/* Imagem clicável */}
      <div className={`relative group cursor-zoom-in ${className}`}>
        <img 
          src={src} 
          alt={alt}
          className="w-full h-auto rounded-lg"
          onClick={openZoom}
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
          <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" size={32} />
        </div>
      </div>

      {/* Modal de zoom */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
          {/* Controles */}
          <div className="absolute top-4 right-4 flex space-x-2 z-10">
            <button
              onClick={zoomOut}
              className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30"
              title="Diminuir zoom"
            >
              <ZoomOut size={20} />
            </button>
            <button
              onClick={zoomIn}
              className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30"
              title="Aumentar zoom"
            >
              <ZoomIn size={20} />
            </button>
            <button
              onClick={rotate}
              className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30"
              title="Rotacionar"
            >
              <RotateCw size={20} />
            </button>
            <button
              onClick={downloadImage}
              className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30"
              title="Baixar imagem"
            >
              <Download size={20} />
            </button>
            <button
              onClick={closeZoom}
              className="p-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30"
              title="Fechar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Informações de zoom */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-lg text-sm">
              Zoom: {Math.round(zoom * 100)}%
            </div>
          </div>

          {/* Imagem com zoom */}
          <div 
            className="relative w-full h-full flex items-center justify-center overflow-hidden cursor-move"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-none select-none"
              style={{
                transform: `scale(${zoom}) rotate(${rotation}deg) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              draggable={false}
            />
          </div>

          {/* Instruções */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg text-sm text-center">
              <p>Use a roda do mouse para zoom • Arraste para mover • Clique nos botões para controlar</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageZoom;


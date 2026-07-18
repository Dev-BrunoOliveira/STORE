import React from "react";

const Spinner: React.FC = () => {
  return (
    <div className="spinner-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px', backgroundColor: 'black', width: '100%', borderRadius: '8px' }}>
      <video 
        className="spinner-video"
        src="/loading.mp4" 
        autoPlay 
        loop 
        muted 
        playsInline 
        style={{ width: '250px', maxWidth: '80%', height: 'auto', borderRadius: '50%' }}
      />
      <p className="spinner-text" style={{ marginTop: '-1rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '2px' }}>Carregando...</p>
    </div>
  );
};

export default Spinner;

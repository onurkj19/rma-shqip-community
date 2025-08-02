import React from "react";

const AppMinimal = () => {
  console.log("AppMinimal is rendering");
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1e40af', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>
          RMA Shqip Community
        </h1>
        <p style={{ fontSize: '1.5rem', marginBottom: '30px' }}>
          Aplikacioni është duke funksionuar!
        </p>
        <button 
          onClick={() => alert('React është duke funksionuar!')}
          style={{
            backgroundColor: '#10b981',
            color: 'white',
            padding: '15px 30px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '1.2rem',
            cursor: 'pointer'
          }}
        >
          Test React
        </button>
      </div>
    </div>
  );
};

export default AppMinimal; 
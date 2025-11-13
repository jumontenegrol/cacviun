import React from "react";

function App() {
  const styles = {
    container: {
      backgroundColor: "#007bff", // azul
      color: "white",
      height: "100vh", // ocupa toda la altura de la ventana
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "2rem",
      fontFamily: "Arial, sans-serif",
      margin: 0,
      overflow: "hidden", // evita scroll
    },
  };

  return (
    <div style={styles.container}>
      APP desplegada 🚀
    </div>
  );
}

export default App;
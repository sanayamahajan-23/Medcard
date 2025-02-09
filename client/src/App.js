// src/App.js
import React from "react";
import "./App.css";
import SignupUser from "./pages/SignupUser"; // Import your SignupUser component

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to the MedCard Signup</h1>
      </header>
      <main>
        <SignupUser /> {/* Render the SignupUser component */}
      </main>
    </div>
  );
}

export default App;

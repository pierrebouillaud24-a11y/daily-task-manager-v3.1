import { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>🚀 TaskHub V7</h1>

      <p>
        Félicitations, votre application React fonctionne.
      </p>

      <button
        onClick={() => setCount(count + 1)}
      >
        Compteur : {count}
      </button>
    </div>
  );
}

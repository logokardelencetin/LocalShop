import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [message, setMessage] = useState("Backend kontrol ediliyor...");
  const [error, setError] = useState("");

  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch(
          "http://localhost:5001/api/health",
        );

        if (!response.ok) {
          throw new Error("Backend bağlantısı başarısız.");
        }

        const data = await response.json();

        setMessage(data.message);
      } catch (err) {
        setError(err.message);
      }
    };

    checkBackend();
  }, []);

  return (
    <main className="container">
      <h1>LocalShop</h1>

      <p>Yerel üreticilerden doğrudan alışveriş yap.</p>

      {error ? (
        <p className="error">{error}</p>
      ) : (
        <p className="success">{message}</p>
      )}
    </main>
  );
}

export default App;
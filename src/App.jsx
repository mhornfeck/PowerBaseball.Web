import { useEffect, useState } from "react";

export default function App() {
  const [msg, setMsg] = useState("loading...");

  useEffect(() => {
    fetch("/api/health") // or whatever endpoint you have
      .then(r => r.text())
      .then(setMsg)
      .catch(e => setMsg("error: " + e.message));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>Baseball Frontend</h1>
      <p>{msg}</p>
    </div>
  );
}
import { useEffect, useState } from "react";
import { api } from "./services/api";

function App() {
  const [status, setStatus] = useState<string>("checking...");

  useEffect(() => {
    api
      .get("/health")
      .then((res) => setStatus(res.data.data.status))
      .catch(() => setStatus("backend unreachable"));
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-lg">
        Backend status: <span className="font-mono">{status}</span>
      </p>
    </div>
  );
}

export default App;
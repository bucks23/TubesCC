import React, { useEffect, useState } from "react";

const PrometheusMetrics = () => {
  const [metrics, setMetrics] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/metrics")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.text();
      })
      .then((data) => setMetrics(data))
      .catch((error) => setError(error.message));
  }, []);

  return (
    <div>
      <h2>Prometheus Metrics</h2>
      {error ? (
        <p>Error fetching metrics: {error}</p>
      ) : (
        <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
          {metrics}
        </pre>
      )}
    </div>
  );
};

export default PrometheusMetrics;

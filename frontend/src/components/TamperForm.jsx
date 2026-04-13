import { useState } from "react";

export default function TamperForm({ onTamper, loading }) {
  const [index, setIndex] = useState("");
  const [newData, setNewData] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (index === "" || !newData.trim()) return;

    const success = await onTamper(index, newData);

    if (success) {
      setIndex("");
      setNewData("");
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h3>Tamper With Block</h3>
      <p className="muted-text">Use this to test blockchain integrity after data manipulation.</p>

      <input
        type="number"
        className="input"
        placeholder="Block index"
        value={index}
        onChange={(e) => setIndex(e.target.value)}
      />

      <input
        type="text"
        className="input"
        placeholder="Enter fake data"
        value={newData}
        onChange={(e) => setNewData(e.target.value)}
      />

      <button className="btn danger-btn" type="submit" disabled={loading}>
        {loading ? "Processing..." : "Tamper Block"}
      </button>
    </form>
  );
}
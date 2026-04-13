import { useState } from "react";

export default function AddBlockForm({ onAddBlock, loading }) {
  const [data, setData] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!data.trim()) return;

    const success = await onAddBlock(data);

    if (success) {
      setData("");
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h3>Add New Block</h3>
      <p className="muted-text">Enter transaction data or a message to mine a new block.</p>

      <input
        type="text"
        className="input"
        placeholder="e.g. Alice sends 10 coins to Bob"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />

      <button className="btn primary-btn" type="submit" disabled={loading}>
        {loading ? "Processing..." : "Add and Mine Block"}
      </button>
    </form>
  );
}
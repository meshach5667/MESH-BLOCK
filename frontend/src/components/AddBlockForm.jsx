import { useState } from "react";
import { Pickaxe } from "lucide-react";

export default function AddBlockForm({ onAddBlock, loading }) {
  const [data, setData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.trim()) return;
    const success = await onAddBlock(data);
    if (success) setData("");
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-card__header">
        <div className="form-card__icon form-card__icon--mine">
          <Pickaxe size={16} />
        </div>
        <div>
          <div className="form-card__title">Mine New Block</div>
          <div className="form-card__description">Commit data to chain via PoW</div>
        </div>
      </div>
      <div className="form-group">
        <label>Transaction Payload</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Alice → Bob: 50 COIN"
          value={data}
          onChange={(e) => setData(e.target.value)}
          disabled={loading}
        />
      </div>
      <button type="submit" className="btn btn--primary" disabled={!data.trim() || loading}>
        {loading ? "Computing PoW…" : "Commit Block"}
      </button>
    </form>
  );
}
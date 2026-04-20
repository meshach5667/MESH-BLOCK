import { useState } from "react";
import { PlusSquare } from "lucide-react";

export default function AddBlockForm({ onAddBlock, loading }) {
  const [data, setData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.trim()) return;
    const success = await onAddBlock({ data });
    if (success) setData("");
  };

  return (
    <form className="glass-panel" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="form-icon">
          <PlusSquare size={24} />
        </div>
        <div>
          <h3>Mine New Block</h3>
          <p className="form-subtitle">Execute proof of work to commit data to chain.</p>
        </div>
      </div>

      <div className="form-group">
        <label>Transaction Payload</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. SRC_NODE -> DEST_NODE: 50.0 COIN"
          value={data}
          onChange={(e) => setData(e.target.value)}
          disabled={loading}
        />
      </div>

      <button type="submit" className="btn btn-cyan" disabled={!data.trim() || loading}>
        {loading ? "Computing PoW..." : "Commit Block"}
      </button>
    </form>
  );
}
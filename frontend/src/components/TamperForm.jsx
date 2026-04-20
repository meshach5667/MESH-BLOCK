import { useState } from "react";
import { AlertOctagon } from "lucide-react";

export default function TamperForm({ onTamper, loading }) {
  const [index, setIndex] = useState("");
  const [data, setData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!index || !data.trim()) return;

    const success = await onTamper(parseInt(index, 10), { data });
    if (success) {
      setIndex("");
      setData("");
    }
  };

  return (
    <form className="glass-panel" onSubmit={handleSubmit}>
      <div className="form-header">
        <div className="form-icon" style={{ color: 'var(--accent-danger)' }}>
          <AlertOctagon size={24} />
        </div>
        <div>
          <h3>Simulate Tampering</h3>
          <p className="form-subtitle">Inject malicious payload to test consensus integrity.</p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group form-group-sm">
          <label>Target Idx</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group form-group-lg">
          <label>Malicious Payload</label>
          <input
            type="text"
            className="form-input"
            placeholder="False transaction data"
            value={data}
            onChange={(e) => setData(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-danger" disabled={!index || !data.trim() || loading}>
        {loading ? "Executing Injection..." : "Execute Tamper"}
      </button>
    </form>
  );
}
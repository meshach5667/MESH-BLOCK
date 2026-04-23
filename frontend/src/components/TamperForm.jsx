import { useState } from "react";
import { Bug } from "lucide-react";

export default function TamperForm({ onTamper, loading }) {
  const [index, setIndex] = useState("");
  const [data, setData] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!index || !data.trim()) return;

    const success = await onTamper(parseInt(index, 10), data);
    if (success) {
      setIndex("");
      setData("");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-card__header">
        <div className="form-card__icon form-card__icon--tamper">
          <Bug size={16} />
        </div>
        <div>
          <div className="form-card__title">Simulate Attack</div>
          <div className="form-card__description">Inject false data to test integrity</div>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group" style={{ width: '80px', flexShrink: 0 }}>
          <label>Block #</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Malicious Payload</label>
          <input
            type="text"
            className="form-input"
            placeholder="False transaction…"
            value={data}
            onChange={(e) => setData(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      <button type="submit" className="btn btn--danger" disabled={!index || !data.trim() || loading}>
        {loading ? "Injecting…" : "Execute Tamper"}
      </button>
    </form>
  );
}
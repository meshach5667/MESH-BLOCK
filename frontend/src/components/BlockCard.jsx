export default function BlockCard({ block }) {
  return (
    <div className="card block-card">
      <div className="block-header">
        <h3>Block {block.index}</h3>
        <span className="block-badge">Nonce: {block.nonce}</span>
      </div>

      <div className="block-content">
        <p>
          <strong>Timestamp:</strong> {block.timestamp}
        </p>
        <p>
          <strong>Data:</strong> {block.data}
        </p>

        <div className="hash-group">
          <label>Previous Hash</label>
          <code>{block.previous_hash}</code>
        </div>

        <div className="hash-group">
          <label>Hash</label>
          <code>{block.hash}</code>
        </div>
      </div>
    </div>
  );
}
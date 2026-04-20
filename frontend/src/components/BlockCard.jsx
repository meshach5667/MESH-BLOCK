import { Clock } from "lucide-react";

export default function BlockCard({ block }) {
  // A simple heuristic for visual display, since proof of work is difficulty=3
  // in normal constraints, it should start with "000". If it doesn't, it's tampered.
  const isTampered = !block.hash.startsWith("000");

  return (
    <div className={`timeline-node ${isTampered ? "tampered" : ""}`}>
      <div className="timeline-dot" />
      <div className="block-card-glass">
        <div className="block-card-header">
          <div className="block-index">
            <span className="block-index-label">Block #{block.index}</span>
          </div>
          <div className="block-time">
            <Clock size={14} />
            {new Date(block.timestamp * 1000).toLocaleString()}
          </div>
        </div>
        
        <div className="block-card-body">
          <div className="data-group">
            <span className="data-label">Payload Data</span>
            <span className="data-value">{block.data}</span>
          </div>

          <div className="data-group">
            <span className="data-label">Cryptographic Nonce</span>
            <span className="data-value">{block.nonce}</span>
          </div>

          <div className="data-group">
            <span className="data-label">Block Hash</span>
            <span className="data-value hash">{block.hash}</span>
          </div>

          <div className="data-group">
            <span className="data-label">Parent Reference</span>
            <span className="data-value hash">{block.previous_hash}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
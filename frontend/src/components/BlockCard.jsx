import { Clock } from "lucide-react";

export default function BlockCard({ block }) {
  const isTampered = !block.hash.startsWith("000");

  return (
    <div className={`timeline__item ${isTampered ? "timeline__item--tampered" : ""}`}>
      <div className="timeline__dot">
        <div className="timeline__dot-inner" />
      </div>
      <div className="block">
        <div className="block__header">
          <div className="block__id">
            <span className="block__badge">#{block.index}</span>
          </div>
          <div className="block__time">
            <Clock size={12} />
            {block.timestamp}
          </div>
        </div>
        
        <div className="block__body">
          <div className="block__field">
            <span className="block__field-label">Payload</span>
            <span className="block__field-value">{block.data}</span>
          </div>

          <div className="block__field">
            <span className="block__field-label">Nonce</span>
            <span className="block__field-value" style={{ fontFamily: 'var(--font-mono)' }}>{block.nonce}</span>
          </div>

          <div className="block__field block__field--full">
            <span className="block__field-label">Block Hash</span>
            <span className="block__field-value block__field-value--hash">{block.hash}</span>
          </div>

          <div className="block__field block__field--full">
            <span className="block__field-label">Previous Hash</span>
            <span className="block__field-value block__field-value--hash">{block.previous_hash}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
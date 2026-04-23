import { ShieldAlert, ShieldCheck, AlertTriangle, CheckCircle, XCircle, Scissors, Wrench } from "lucide-react";

export default function AuditPanel({ audit, onRollback, onRepair, loading }) {
  if (!audit) return null;

  const isCompromised = audit.chain_status === "COMPROMISED";

  return (
    <div className="audit-panel">
      <div className="audit-panel__header">
        <div className={`audit-panel__status audit-panel__status--${isCompromised ? 'danger' : 'success'}`}>
          {isCompromised ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
          <div>
            <div className="audit-panel__status-title">
              {isCompromised ? "INCIDENT DETECTED" : "ALL CLEAR"}
            </div>
            <div className="audit-panel__status-detail">
              {isCompromised
                ? `${audit.compromised_blocks} of ${audit.total_blocks} block(s) compromised`
                : `All ${audit.total_blocks} blocks verified`
              }
            </div>
          </div>
        </div>
      </div>

      <div className="audit-panel__blocks">
        {audit.blocks.map((blockReport) => (
          <div
            key={blockReport.index}
            className={`audit-block audit-block--${blockReport.severity}`}
          >
            <div className="audit-block__header">
              <span className="audit-block__badge">
                #{blockReport.index}
              </span>
              <span className={`audit-block__severity audit-block__severity--${blockReport.severity}`}>
                {blockReport.severity === "critical" ? (
                  <><AlertTriangle size={12} /> CRITICAL</>
                ) : (
                  <><CheckCircle size={12} /> CLEAN</>
                )}
              </span>
            </div>
            <div className="audit-block__findings">
              {blockReport.findings.map((finding, i) => (
                <div key={i} className={`audit-finding audit-finding--${finding.status.toLowerCase()}`}>
                  <div className="audit-finding__header">
                    {finding.status === "PASS"
                      ? <CheckCircle size={12} />
                      : <XCircle size={12} />
                    }
                    <span className="audit-finding__check">{finding.check.replace(/_/g, " ")}</span>
                  </div>
                  <div className="audit-finding__detail">{finding.detail}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {isCompromised && (
        <div className="audit-panel__actions">
          <div className="audit-panel__actions-label">Incident Response</div>

          <button
            className="btn btn--repair"
            onClick={onRepair}
            disabled={loading}
          >
            <Wrench size={16} />
            {loading ? "Re-mining…" : "Repair Chain (Re-mine)"}
          </button>
          <div className="audit-panel__actions-hint">
            Re-mines compromised blocks while preserving current data. Restores all hashes and PoW.
          </div>

          <button
            className="btn btn--rollback"
            onClick={() => onRollback(audit.first_compromised_index)}
            disabled={loading}
          >
            <Scissors size={16} />
            {loading ? "Rolling back…" : `Rollback to Block #${audit.first_compromised_index - 1}`}
          </button>
          <div className="audit-panel__actions-hint">
            Discards all blocks from #{audit.first_compromised_index} onward. Data in those blocks will be lost.
          </div>
        </div>
      )}
    </div>
  );
}

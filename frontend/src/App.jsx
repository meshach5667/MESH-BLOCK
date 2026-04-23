import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Hash, Layers, Search } from "lucide-react";

import Layout from "./components/Layout";
import AddBlockForm from "./components/AddBlockForm";
import BlockCard from "./components/BlockCard";
import DashboardCard from "./components/DashboardCard";
import TamperForm from "./components/TamperForm";
import AuditPanel from "./components/AuditPanel";
import {
  addBlock,
  getBlocks,
  getStats,
  tamperBlock,
  validateChain,
  auditChain,
  rollbackChain,
  repairChain,
} from "./services/api";

export default function App() {
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [chainValid, setChainValid] = useState(true);
  const [auditReport, setAuditReport] = useState(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 6000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const loadData = async () => {
    try {
      const [blocksData, statsData] = await Promise.all([getBlocks(), getStats()]);
      setBlocks(blocksData);
      setStats(statsData);
      setChainValid(statsData.is_valid);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, []);

  const handleAddBlock = async (blockData) => {
    setLoading(true);
    try {
      const response = await addBlock(blockData);
      setMessage(response.message);
      setMessageType("success");
      setAuditReport(null);
      await loadData();
      return true;
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleTamper = async (index, newData) => {
    setLoading(true);
    try {
      const response = await tamperBlock(index, newData);
      setMessage(response.message);
      setMessageType("error");
      setAuditReport(null);
      await loadData();
      return true;
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleValidate = async () => {
    setLoading(true);
    try {
      const response = await validateChain();
      if (response.is_valid) {
        setMessage("Chain integrity confirmed. Network secure.");
        setMessageType("success");
      } else {
        setMessage("Chain integrity failure. Tampering detected. Run a forensic audit.");
        setMessageType("error");
      }
      setChainValid(response.is_valid);
      await loadData();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleAudit = async () => {
    setLoading(true);
    try {
      const report = await auditChain();
      setAuditReport(report);
      if (report.chain_status === "COMPROMISED") {
        setMessage(`Forensic scan complete. ${report.compromised_blocks} compromised block(s) identified.`);
        setMessageType("error");
      } else {
        setMessage("Forensic scan complete. No anomalies detected.");
        setMessageType("success");
      }
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleRepair = async () => {
    setLoading(true);
    try {
      const response = await repairChain();
      setMessage(response.message);
      setMessageType("success");
      setAuditReport(null);
      await loadData();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleRollback = async (index) => {
    setLoading(true);
    try {
      const response = await rollbackChain(index);
      setMessage(response.message);
      setMessageType("success");
      setAuditReport(null);
      await loadData();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const chartData = blocks.map(b => ({
    name: `Block #${b.index}`,
    nonce: b.nonce,
  })).slice(-15);

  const rightPanelContent = (
    <div className="control-panel">
      {message && (
        <div className={`toast toast--${messageType}`}>
          <div className="toast__dot" />
          {message}
        </div>
      )}

      <div className="control-section">
        <div className="section-label">
          <div className="section-label__dot" />
          Network Analytics
        </div>
        {stats && (
          <div className="metrics-column">
            <DashboardCard 
              title="Total Blocks" 
              value={stats.total_blocks} 
              icon={Layers} 
            />
            <DashboardCard 
              title="Difficulty" 
              value={stats.difficulty} 
              icon={Hash} 
            />
            <DashboardCard 
              title="Consensus" 
              value={stats.is_valid ? "Valid" : "Compromised"} 
              icon={Activity}
              valueClass={stats.is_valid ? 'success' : 'danger'}
            />
          </div>
        )}
        <button 
          className={`btn ${chainValid ? 'btn--validate' : 'btn--danger'}`} 
          onClick={handleValidate} 
          disabled={loading}
          style={{ marginTop: '16px' }}
        >
          {loading ? "Verifying..." : "Validate Chain Integrity"}
        </button>
        {!chainValid && (
          <button
            className="btn btn--audit"
            onClick={handleAudit}
            disabled={loading}
            style={{ marginTop: '8px' }}
          >
            <Search size={16} />
            {loading ? "Scanning…" : "Run Forensic Audit"}
          </button>
        )}
      </div>

      {auditReport && (
        <div className="control-section">
          <div className="section-label">
            <div className="section-label__dot section-label__dot--danger" />
            Incident Response
          </div>
          <AuditPanel
            audit={auditReport}
            onRollback={handleRollback}
            onRepair={handleRepair}
            loading={loading}
          />
        </div>
      )}

      <div className="control-section">
        <div className="section-label">
          <div className="section-label__dot" />
          Network Actions
        </div>
        <AddBlockForm onAddBlock={handleAddBlock} loading={loading} />
        <div style={{ height: '16px' }} />
        <TamperForm onTamper={handleTamper} loading={loading} />
      </div>
    </div>
  );

  return (
    <Layout chainValid={chainValid} rightPanel={rightPanelContent}>
      <div className="main__header">
        <h1 className="main__title">Ledger Overview</h1>
        <p className="main__subtitle">Real-time node operations and immutable block sequence.</p>
      </div>

      <section className="chart-panel">
        <div className="chart-panel__header">
          <h3 className="chart-panel__title">Network Hash Power Simulation</h3>
          <p className="chart-panel__subtitle">Trailing nonce values representing proof-of-work per block</p>
        </div>
        <div style={{ width: '100%', height: 200, marginTop: '24px' }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNonce" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--border-strong)" tick={{fill: "var(--text-tertiary)", fontSize: 11}} />
              <YAxis stroke="var(--border-strong)" tick={{fill: "var(--text-tertiary)", fontSize: 11}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border-default)', borderRadius: '6px' }}
                itemStyle={{ color: 'var(--accent-light)' }}
                labelStyle={{ color: 'var(--text-primary)', fontWeight: 'bold' }}
              />
              <Area type="monotone" dataKey="nonce" stroke="var(--accent)" strokeWidth={2} fillOpacity={1} fill="url(#colorNonce)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="ledger">
        <div className="ledger__header">
          <h2 className="ledger__title">Immutable Blockchain Log</h2>
          <span className="ledger__count">{blocks.length} blocks</span>
        </div>
        
        <div className="timeline">
          {blocks.length > 0 ? (
            blocks.map((block) => (
              <BlockCard key={block.index} block={block} />
            ))
          ) : (
            <div className="empty-state">No block history available. Node synchronization required.</div>
          )}
        </div>
      </section>
    </Layout>
  );
}
import { useEffect, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Clock, Hash, Layers } from "lucide-react";

import Layout from "./components/Layout";
import AddBlockForm from "./components/AddBlockForm";
import BlockCard from "./components/BlockCard";
import DashboardCard from "./components/DashboardCard";
import SectionTitle from "./components/SectionTitle";
import TamperForm from "./components/TamperForm";
import {
  addBlock,
  getBlocks,
  getStats,
  tamperBlock,
  validateChain,
} from "./services/api";

export default function App() {
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false);
  const [chainValid, setChainValid] = useState(true);

  // Auto-hide messages after 5 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
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
      setMessageType("error"); // In a real setting warning, but error glow looks better for tamper
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
        setMessage("Chain integrity failure. Tampering detected.");
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

  // Prepare chart data using block nonces to simulate "hash power required" over block time
  const chartData = blocks.map(b => ({
    name: `Block #${b.index}`,
    nonce: b.nonce,
  })).slice(-15); // Show last 15 blocks

  return (
    <Layout chainValid={chainValid}>
      {message && (
        <div className={`message-banner ${messageType}`}>
          {message}
        </div>
      )}

      <header className="page-header">
        <div>
          <h2>Network Overview</h2>
          <p>Real-time analytics and consensus state monitoring.</p>
        </div>
        <button 
          className={`btn ${chainValid ? 'btn-cyan' : 'btn-danger'}`} 
          onClick={handleValidate} 
          disabled={loading}
        >
          {loading ? "Verifying..." : "Validate Chain"}
        </button>
      </header>

      {stats && (
        <div className="dashboard-grid">
          <DashboardCard 
            title="Total Blocks" 
            value={stats.total_blocks} 
            icon={Layers} 
          />
          <DashboardCard 
            title="Difficulty Target" 
            value={stats.difficulty} 
            icon={Hash} 
          />
          <DashboardCard 
            title="Consensus Status" 
            value={stats.is_valid ? "Valid" : "Compromised"} 
            icon={Activity}
            valueClass={stats.is_valid ? 'success' : 'danger'}
          />
          <DashboardCard 
            title="Network Time" 
            value={new Date().toLocaleTimeString()} 
            icon={Clock} 
            longText 
          />
        </div>
      )}

      {/* Network Activity Chart */}
      <section className="chart-section glass-panel">
        <SectionTitle 
          title="Network Hash Power Simulation" 
          subtitle="Trailing nonce values representing proof-of-work expended per block"
        />
        <div style={{ width: '100%', height: 260, marginTop: '24px' }}>
          <ResponsiveContainer>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorNonce" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--accent-cyan)" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="var(--accent-cyan)" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="var(--border-strong)" tick={{fill: "var(--text-faint)", fontSize: 12}} />
              <YAxis stroke="var(--border-strong)" tick={{fill: "var(--text-faint)", fontSize: 12}} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--bg-surface-elevated)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--accent-cyan)' }}
              />
              <Area type="monotone" dataKey="nonce" stroke="var(--accent-cyan)" strokeWidth={2} fillOpacity={1} fill="url(#colorNonce)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="forms-grid">
        <AddBlockForm onAddBlock={handleAddBlock} loading={loading} />
        <TamperForm onTamper={handleTamper} loading={loading} />
      </section>

      <section className="ledger-section">
        <div className="ledger-header">
          <div>
            <h2>Ledger Timeline</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '4px 0 0' }}>Immutable block sequence and payload history</p>
          </div>
        </div>
        
        <div className="ledger-timeline">
          {blocks.length > 0 ? (
            blocks.map((block, index) => (
              <BlockCard key={block.index} block={block} isLast={index === blocks.length - 1} />
            ))
          ) : (
            <div className="empty-state">No block history available. Node synchronization required.</div>
          )}
        </div>
      </section>
    </Layout>
  );
}
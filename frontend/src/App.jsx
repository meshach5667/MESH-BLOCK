import { useEffect, useState } from "react";
import AddBlockForm from "./components/AddBlockForm";
import BlockCard from "./components/BlockCard";
import DashboardCard from "./components/DashboardCard";
import MessageBanner from "./components/MessageBanner";
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

  const loadData = async () => {
    try {
      const [blocksData, statsData] = await Promise.all([getBlocks(), getStats()]);
      setBlocks(blocksData);
      setStats(statsData);
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddBlock = async (blockData) => {
    setLoading(true);
    setMessage("");

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
    setMessage("");

    try {
      const response = await tamperBlock(index, newData);
      setMessage(response.message);
      setMessageType("warning");
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
    setMessage("");

    try {
      const response = await validateChain();
      if (response.is_valid) {
        setMessage("Blockchain is valid.");
        setMessageType("success");
      } else {
        setMessage("Blockchain is NOT valid.");
        setMessageType("error");
      }
      await loadData();
    } catch (error) {
      setMessage(error.message);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-text">
          <h1>Blockchain Simulation Dashboard</h1>
          <p>CYB 322 — Cybersecurity Innovation &amp; New Technologies</p>
        </div>
      </header>

      <MessageBanner message={message} type={messageType} />

      <section className="section">
        <SectionTitle
          title="System Overview"
          subtitle="A simple web interface for monitoring blocks, Proof of Work, chain validity, and tampering tests."
        />

        {stats && (
          <div className="dashboard-grid">
            <DashboardCard title="Total Blocks" value={stats.total_blocks} />
            <DashboardCard title="Difficulty" value={stats.difficulty} />
            <DashboardCard title="Chain Status" value={stats.is_valid ? "Valid" : "Invalid"} />
            <DashboardCard title="Latest Hash" value={stats.latest_hash} longText />
          </div>
        )}
      </section>

      <section className="section form-grid">
        <AddBlockForm onAddBlock={handleAddBlock} loading={loading} />
        <TamperForm onTamper={handleTamper} loading={loading} />
      </section>

      <section className="section validate-section">
        <button className="btn primary-btn validate-btn" onClick={handleValidate} disabled={loading}>
          {loading ? "Please wait..." : "Validate Blockchain"}
        </button>
      </section>

      <section className="section">
        <SectionTitle
          title="Blockchain Records"
          subtitle="Each block contains its own hash, previous hash, timestamp, transaction data, and nonce."
        />

        <div className="blocks-grid">
          {blocks.length > 0 ? (
            blocks.map((block) => <BlockCard key={block.index} block={block} />)
          ) : (
            <div className="empty-state">No blocks found.</div>
          )}
        </div>
      </section>
    </div>
  );
}
const API_BASE = "http://127.0.0.1:8000";

export async function getBlocks() {
  const response = await fetch(`${API_BASE}/blocks`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch blocks");
  }

  return data.chain;
}

export async function getStats() {
  const response = await fetch(`${API_BASE}/stats`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch stats");
  }

  return data;
}

export async function addBlock(blockData) {
  const response = await fetch(`${API_BASE}/blocks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ data: blockData }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to add block");
  }

  return data;
}

export async function validateChain() {
  const response = await fetch(`${API_BASE}/validate`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to validate chain");
  }

  return data;
}

export async function tamperBlock(index, newData) {
  const response = await fetch(`${API_BASE}/tamper`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      index: Number(index),
      new_data: newData,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Failed to tamper block");
  }

  return data;
}
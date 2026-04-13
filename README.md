# Blockchain Simulation and Implementation

## 📌 Project Overview

This project is a simplified implementation of a blockchain system developed using Python (FastAPI) and React. It demonstrates the core principles of blockchain technology, including block creation, hashing, Proof of Work (mining), chain validation, and data integrity.

The system simulates how real-world blockchains function by linking blocks using cryptographic hashes and detecting tampering attempts.

---

##  Objectives

The main objectives of this project are:

- To understand the structure and behavior of blockchain systems  
- To implement cryptographic hashing using SHA-256  
- To simulate block creation and linking  
- To implement a Proof of Work consensus mechanism  
- To validate the integrity of a blockchain  
- To provide a user interface for interacting with the blockchain  

---

##  What is Blockchain?

A blockchain is a decentralized digital ledger that records transactions in a secure and immutable way. Each block contains data and is linked to the previous block using a cryptographic hash, forming a chain.

### Key Properties:
- Immutability (data cannot be changed easily)
- Transparency
- Security through hashing
- Decentralized structure

---

##  Key Components

### 1. Block
Each block contains:
- Index
- Timestamp
- Data (transactions/messages)
- Previous hash
- Hash
- Nonce (used for mining)

---

### 2. Hash
A hash is a unique cryptographic fingerprint of block data generated using SHA-256. Any small change in data produces a completely different hash.

---

### 3. Nonce
A number used during mining to find a valid hash that satisfies the difficulty condition.

---

### 4. Proof of Work (Mining)
Mining involves finding a hash that starts with a certain number of zeros:

Example:

This ensures computational effort is required to add a block.

---

### 5. Distributed Ledger (Conceptual)
Although this project is not fully distributed, it simulates the behavior of a shared ledger where all blocks are linked and verified.

---


---

## 🧩 Backend Implementation (FastAPI)

The backend provides RESTful API endpoints for interacting with the blockchain.

### API Endpoints

| Method | Endpoint | Description |
|--------|---------|------------|
| GET | `/` | Check if API is running |
| GET | `/blocks` | Retrieve all blocks |
| POST | `/blocks` | Add and mine a new block |
| GET | `/validate` | Validate blockchain |
| GET | `/stats` | Get blockchain statistics |
| POST | `/tamper` | Tamper with a block |

---

## 🧱 Blockchain Implementation

### Block Class (`block.py`)

Responsible for:
- Creating block structure  
- Generating SHA-256 hash  
- Mining block using nonce  

---

### Blockchain Class (`blockchain.py`)

Responsible for:
- Creating genesis block  
- Adding new blocks  
- Mining blocks  
- Validating chain  
- Detecting tampering  

---

## 🔐 Security Analysis

### How Blockchain Ensures Data Integrity

- Each block stores the hash of the previous block  
- If a block is modified, its hash changes  
- This breaks the chain and invalidates the blockchain  

---

### Tampering Scenario

If a block is tampered with:
- Its hash becomes invalid  
- Subsequent blocks lose integrity  
- Validation function returns **false**  

---

### Limitations

- No real decentralization (single node system)  
- No networking between peers  
- No real consensus algorithm beyond basic Proof of Work  
- Data is stored in memory (not persistent)  

---

### Possible Improvements

- Add peer-to-peer networking  
- Implement smart contract simulation  
- Integrate database (SQLite/PostgreSQL)  
- Deploy on cloud  
- Add authentication  

---

##  Frontend Implementation (React)

The frontend provides an interactive interface for users.

### Features:
- Add new block  
- View blockchain  
- Validate chain  
- Tamper with block  
- Dashboard displaying stats  

---

##  Visualization Dashboard

Displays:
- Total blocks  
- Mining difficulty  
- Blockchain validity  
- Latest block hash  

---

## ▶ How to Run the Project

### Backend

```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```
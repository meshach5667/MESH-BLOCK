from .block import Block


class Blockchain:
    def __init__(self, difficulty=3):
        self.difficulty = difficulty
        self.chain = [self.create_genesis_block()]

    def create_genesis_block(self):
        genesis_block = Block(0, "Genesis Block", "0")
        genesis_block.mine_block(self.difficulty)
        return genesis_block

    def get_latest_block(self):
        return self.chain[-1]

    def add_block(self, data):
        latest_block = self.get_latest_block()
        new_block = Block(
            index=len(self.chain),
            data=data,
            previous_hash=latest_block.hash
        )

        print("\nMining block...")
        new_block.mine_block(self.difficulty)
        self.chain.append(new_block)
        print("Block added successfully.\n")
        return new_block

    def is_chain_valid(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]

            recalculated_hash = current_block.calculate_hash()
            if current_block.hash != recalculated_hash:
                print(f"Invalid hash at block {current_block.index}")
                return False

            if current_block.previous_hash != previous_block.hash:
                print(f"Broken chain link at block {current_block.index}")
                return False

            if not current_block.hash.startswith("0" * self.difficulty):
                print(f"Block {current_block.index} was not properly mined")
                return False

        return True

    def display_chain(self):
        print("\n========== BLOCKCHAIN ==========")
        for block in self.chain:
            print(f"Block {block.index}")
            print(f"Timestamp     : {block.timestamp}")
            print(f"Data          : {block.data}")
            print(f"Previous Hash : {block.previous_hash}")
            print(f"Hash          : {block.hash}")
            print(f"Nonce         : {block.nonce}")
            print("-" * 40)
        print("================================\n")

    def tamper_block(self, index, new_data):
        if index <= 0 or index >= len(self.chain):
            print("Invalid block index. You cannot tamper with genesis block or non-existent block.")
            return None

        self.chain[index].data = new_data
        self.chain[index].hash = self.chain[index].calculate_hash()
        print(f"Block {index} has been tampered with.\n")
        return self.chain[index]

    def get_chain(self):
        return [block.to_dict() for block in self.chain]

    def get_stats(self):
        latest_block = self.get_latest_block()
        return {
            "total_blocks": len(self.chain),
            "difficulty": self.difficulty,
            "is_valid": self.is_chain_valid(),
            "latest_hash": latest_block.hash,
        }

    # ── Incident Response Methods ──────────────────────────────

    def audit_chain(self):
        """
        Forensic audit — like a cybersecurity team scanning every block.
        Returns a per-block report identifying exactly what's wrong and why.
        """
        report = []
        for i in range(len(self.chain)):
            block = self.chain[i]
            findings = []
            severity = "clean"

            recalculated_hash = block.calculate_hash()

            # Check 1: Hash integrity — was the data modified?
            if block.hash != recalculated_hash:
                findings.append({
                    "check": "HASH_INTEGRITY",
                    "status": "FAIL",
                    "detail": "Stored hash does not match recalculated hash. Data was modified after mining.",
                    "expected": recalculated_hash,
                    "actual": block.hash,
                })
                severity = "critical"
            else:
                findings.append({
                    "check": "HASH_INTEGRITY",
                    "status": "PASS",
                    "detail": "Hash matches block contents.",
                })

            # Check 2: Proof-of-Work — was the block properly mined?
            if not block.hash.startswith("0" * self.difficulty):
                findings.append({
                    "check": "PROOF_OF_WORK",
                    "status": "FAIL",
                    "detail": f"Hash does not meet difficulty target (must start with {'0' * self.difficulty}).",
                    "hash_prefix": block.hash[:self.difficulty],
                })
                severity = "critical"
            else:
                findings.append({
                    "check": "PROOF_OF_WORK",
                    "status": "PASS",
                    "detail": "Valid proof-of-work.",
                })

            # Check 3: Chain linkage — does this block connect to the previous?
            if i > 0:
                previous_block = self.chain[i - 1]
                if block.previous_hash != previous_block.hash:
                    findings.append({
                        "check": "CHAIN_LINK",
                        "status": "FAIL",
                        "detail": "Previous hash pointer does not match actual previous block hash. Chain link is broken.",
                        "expected": previous_block.hash,
                        "actual": block.previous_hash,
                    })
                    if severity != "critical":
                        severity = "critical"
                else:
                    findings.append({
                        "check": "CHAIN_LINK",
                        "status": "PASS",
                        "detail": "Correctly linked to previous block.",
                    })

            report.append({
                "index": block.index,
                "severity": severity,
                "findings": findings,
                "block": block.to_dict(),
            })

        compromised_count = sum(1 for r in report if r["severity"] == "critical")
        first_compromised = next((r["index"] for r in report if r["severity"] == "critical"), None)

        return {
            "total_blocks": len(self.chain),
            "compromised_blocks": compromised_count,
            "chain_status": "COMPROMISED" if compromised_count > 0 else "SECURE",
            "first_compromised_index": first_compromised,
            "blocks": report,
        }

    def rollback_to(self, index):
        """
        Rollback — discard all blocks from the given index onward.
        Like reverting to the last known-good checkpoint before the breach.
        In real blockchains, this is similar to orphaning blocks after a fork.
        """
        if index < 0 or index >= len(self.chain):
            return None

        discarded_count = len(self.chain) - index
        self.chain = self.chain[:index]

        # Must always have at least the genesis block
        if len(self.chain) == 0:
            self.chain = [self.create_genesis_block()]
            return {
                "discarded": discarded_count,
                "remaining": 1,
                "message": "Full rollback executed. Chain reset to new genesis block.",
            }

        return {
            "discarded": discarded_count,
            "remaining": len(self.chain),
            "message": f"Rolled back to block #{index - 1}. Discarded {discarded_count} block(s).",
        }

    def repair_chain(self):
        """
        Re-mine — like a cybersecurity team reconstructing the chain.
        Finds the first compromised block, then re-mines it and every
        subsequent block to restore hash integrity and chain linkage.
        The data in each block is preserved (current state is accepted),
        but all hashes and nonces are recalculated with valid PoW.
        """
        audit = self.audit_chain()

        if audit["chain_status"] == "SECURE":
            return {
                "repaired": 0,
                "message": "No repair needed. Chain is already secure.",
            }

        first_bad = audit["first_compromised_index"]
        repaired_blocks = []

        for i in range(first_bad, len(self.chain)):
            block = self.chain[i]
            # Reconnect chain link to the actual previous block's hash
            if i > 0:
                block.previous_hash = self.chain[i - 1].hash

            # Reset nonce and re-mine with valid PoW
            block.nonce = 0
            block.hash = block.calculate_hash()
            block.mine_block(self.difficulty)

            repaired_blocks.append(block.index)

        return {
            "repaired": len(repaired_blocks),
            "repaired_indices": repaired_blocks,
            "message": f"Incident response complete. Re-mined {len(repaired_blocks)} block(s) from index #{first_bad}.",
        }
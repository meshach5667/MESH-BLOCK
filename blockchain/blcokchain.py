from .block import Block


class Blockchain:
    def __init__(self, difficulty=3):
        self.chain = [self.create_genesis_block()]
        self.difficulty = difficulty

    def create_genesis_block(self):
        return Block(0, "Genesis Block", "0")

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

        return True

    def display_chain(self):
        print("\n== BLOCKCHAIN ==")
        for block in self.chain:
            print(f"Block {block.index}")
            print(f"Timestamp     : {block.timestamp}")
            print(f"Data          : {block.data}")
            print(f"Previous Hash : {block.previous_hash}")
            print(f"Hash          : {block.hash}")
            print(f"Nonce         : {block.nonce}")
            print("-" * 40)
        print("==\n")

    def tamper_block(self, index, new_data):
        if index <= 0 or index >= len(self.chain):
            print("Invalid block index. You cannot tamper with genesis block or non-existent block.")
            return

        self.chain[index].data = new_data
        self.chain[index].hash = self.chain[index].calculate_hash()
        print(f"Block {index} has been tampered with.\n")
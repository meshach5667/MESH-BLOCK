from blockchain import Blockchain
from blockchain.utils import print_menu


def main():
    blockchain = Blockchain(difficulty=3)

    while True:
        print_menu()
        choice = input("Enter your choice: ").strip()

        if choice == "1":
            data = input("Enter block data (transaction/message): ").strip()
            if data:
                blockchain.add_block(data)
            else:
                print("Block data cannot be empty.\n")

        elif choice == "2":
            blockchain.display_chain()

        elif choice == "3":
            if blockchain.is_chain_valid():
                print("Blockchain is valid.\n")
            else:
                print("Blockchain is NOT valid.\n")

        elif choice == "4":
            try:
                index = int(input("Enter block index to tamper with: ").strip())
                new_data = input("Enter new fake data: ").strip()
                blockchain.tamper_block(index, new_data)
            except ValueError:
                print("Please enter a valid number.\n")

        elif choice == "5":
            print("Exiting program.")
            break

        else:
            print("Invalid choice. Try again.\n")


if __name__ == "__main__":
    main()
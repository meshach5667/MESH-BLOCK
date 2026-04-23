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
            audit = blockchain.audit_chain()
            print(f"\n{'='*50}")
            print(f"  FORENSIC AUDIT REPORT")
            print(f"{'='*50}")
            print(f"  Chain Status : {audit['chain_status']}")
            print(f"  Total Blocks : {audit['total_blocks']}")
            print(f"  Compromised  : {audit['compromised_blocks']}")
            if audit['first_compromised_index'] is not None:
                print(f"  First Breach : Block #{audit['first_compromised_index']}")
            print(f"{'='*50}")
            for block_report in audit['blocks']:
                status = "CRITICAL" if block_report['severity'] == 'critical' else "CLEAN"
                print(f"\n  Block #{block_report['index']} [{status}]")
                for finding in block_report['findings']:
                    icon = "✓" if finding['status'] == 'PASS' else "✗"
                    print(f"    {icon} {finding['check']}: {finding['detail']}")
            print(f"\n{'='*50}\n")

        elif choice == "6":
            result = blockchain.repair_chain()
            print(f"\n{result['message']}\n")

        elif choice == "7":
            try:
                index = int(input("Rollback to which block index? (all blocks from this index onward will be discarded): ").strip())
                result = blockchain.rollback_to(index)
                if result is None:
                    print("Invalid rollback index.\n")
                else:
                    print(f"\n{result['message']}\n")
            except ValueError:
                print("Please enter a valid number.\n")

        elif choice == "8":
            print("Exiting program.")
            break

        else:
            print("Invalid choice. Try again.\n")


if __name__ == "__main__":
    main()
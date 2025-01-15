import { useState } from "react";
import { createCapsuleViemClient } from "@usecapsule/viem-v2-integration";
import { sepolia } from "viem/chains";
import { http, parseEther } from "viem";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";
import useTransactionManager from "../../hooks/useTransactionManager";
import { capsuleClient } from "../../client/capsule";
import TransactionForm from "../../components/transaction-form";

// Define the structure of a transaction
interface Transaction {
    to: string; // Recipient address
    value: string; // Amount to send
    data: number | string; // Transaction data (optional, defaults to '0x')
}

// Main functional component
const SignWithSafe: React.FC = () => {
    // Destructure state management hooks from the custom useTransactionManager hook
    const {
        fromAddress,
        recipient,
        amount,
        error,
        isLoading,
        signatureResult,
        setError,
        setRecipient,
        setAmount,
        setIsLoading,
        setSignatureResult,
        resetForm,
    } = useTransactionManager();

    // State to hold an array of transactions
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    // Function to perform a batch transaction using Safe
    const performBatchTransaction = async (
        capsule: any, // Capsule client instance
        transactions: Transaction[] // List of transactions to execute
    ) => {
        const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com"; // RPC URL for Sepolia testnet

        try {
            // Create a Capsule Viem client with the given chain and RPC transport
            const capsuleViemClient: any = createCapsuleViemClient(capsule, {
                chain: sepolia,
                transport: http(RPC_URL),
            });

            // Retrieve the Safe address associated with the current Capsule account
            const safeAddress = await capsuleViemClient.account.address;

            // Create an Ethereum adapter for Safe SDK
            const ethAdapter = new EthersAdapter({
                ethers: capsuleViemClient,
                signerOrProvider: capsuleViemClient.account,
            });

            // Initialize Safe SDK with the adapter and Safe address
            const safeSdk = await Safe.create({
                ethAdapter,
                safeAddress,
            });

            // Map each transaction into the Safe's transaction format
            const safeTransactions = transactions.map(tx => ({
                to: tx.to,
                value: parseEther(tx.value.toString()).toString(), // Convert value to wei
                data: tx.data ? tx.data.toString() : '0x', // Default to '0x' if no data is provided
            }));

            // Create a batch transaction with the Safe SDK
            const safeTransaction = await safeSdk.createTransaction({
                safeTransactionData: safeTransactions,
            });

            // Get the hash of the Safe transaction
            const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);

            // Sign the transaction hash with the current user's signature
            const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
            safeTransaction.addSignature(senderSignature); // Add the signature to the transaction

            // Execute the transaction on the Safe
            const executionResponse = await safeSdk.executeTransaction(safeTransaction);

            return executionResponse; // Return the response for further handling
        } catch (error) {
            console.error('Safe transaction error:', error);
            throw error; // Re-throw the error to handle it in the calling function
        }
    };

    // Function to handle the transaction process
    const handleTransaction = async () => {
        try {
            // Create a new transaction based on the input values
            const newTransaction: Transaction = {
                to: recipient, // Recipient address from input
                value: amount, // Amount from input
                data: '0x', // Default transaction data
            };

            // Update the transactions state with the new transaction
            setTransactions([newTransaction]);

            setIsLoading(true); // Indicate that the transaction process is in progress

            // Call the performBatchTransaction function and handle the response
            const response = await performBatchTransaction(capsuleClient, transactions);

            // Update the signature result with the transaction hash
            setSignatureResult(response.hash || 'Transaction executed');
        } catch (err: any) {
            console.error('Transaction error:', err);
            setError(err.message || 'Failed to execute transaction'); // Set an error message if something goes wrong
        } finally {
            setIsLoading(false); // Ensure loading state is cleared regardless of success or failure
        }
    };

    // Return JSX to render the transaction form and associated UI
    return (
        <div className="flex flex-col items-center justify-center h-full">
            {/* Transaction Form component for user inputs */}
            <TransactionForm
                fromAddress={fromAddress} // Sender address
                recipient={recipient} // Recipient address
                amount={amount} // Amount to send
                onRecipientChange={setRecipient} // Update recipient state
                onAmountChange={setAmount} // Update amount state
                onSign={handleTransaction} // Trigger transaction handling
                onReset={resetForm} // Reset the form inputs
                isLoading={isLoading} // Loading state for UI feedback
                error={error} // Error state for UI feedback
                signatureResult={signatureResult} // Display transaction result
            />
        </div>
    );
};

export default SignWithSafe;

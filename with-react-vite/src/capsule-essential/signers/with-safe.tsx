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

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Function to perform a batch transaction using Safe
  const performBatchTransaction = async (
    capsule: any, // Capsule client instance
    transactions: Transaction[] // List of transactions to execute
  ) => {
    const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";
    console.log("Performing batch transaction with transactions:", transactions);

    try {
      const capsuleViemClient: any = createCapsuleViemClient(capsule, {
        chain: sepolia,
        transport: http(RPC_URL),
      });
      console.log("Capsule Viem client created:", capsuleViemClient);

      const safeAddress = await capsuleViemClient.account.address;
      console.log("Safe address retrieved:", safeAddress);

      const ethAdapter = new EthersAdapter({
        ethers: capsuleViemClient,
        signerOrProvider: capsuleViemClient.account,
      });
      console.log("Ethereum adapter created:", ethAdapter);

      const safeSdk = await Safe.create({
        ethAdapter,
        safeAddress,
      });
      console.log("Safe SDK initialized:", safeSdk);

      const safeTransactions = transactions.map((tx) => ({
        to: tx.to,
        value: parseEther(tx.value.toString()).toString(),
        data: tx.data ? tx.data.toString() : "0x",
      }));
      console.log("Safe transactions mapped:", safeTransactions);

      const safeTransaction = await safeSdk.createTransaction({
        safeTransactionData: safeTransactions,
      });
      console.log("Safe transaction created:", safeTransaction);

      const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
      console.log("Transaction hash retrieved:", safeTxHash);

      const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
      console.log("Transaction hash signed:", senderSignature);

      safeTransaction.addSignature(senderSignature);
      console.log("Signature added to transaction:", safeTransaction);

      const executionResponse = await safeSdk.executeTransaction(safeTransaction);
      console.log("Transaction executed, response:", executionResponse);

      return executionResponse;
    } catch (error) {
      console.error("Safe transaction error:", error);
      throw error;
    }
  };

  // Function to handle the transaction process
  const handleTransaction = async () => {
    console.log("Handling transaction...");
    try {
      const newTransaction: Transaction = {
        to: recipient,
        value: amount,
        data: "0x",
      };
      console.log("New transaction created:", newTransaction);

      setTransactions([newTransaction]);
      console.log("Transactions state updated:", transactions);

      setIsLoading(true);
      console.log("Transaction process started, loading state set to true.");

      const response = await performBatchTransaction(capsuleClient, transactions);
      console.log("Batch transaction response:", response);

      setSignatureResult(response.hash || "Transaction executed");
      console.log("Signature result updated:", response.hash || "Transaction executed");
    } catch (err: any) {
      console.error("Transaction error:", err);
      setError(err.message || "Failed to execute transaction");
    } finally {
      setIsLoading(false);
      console.log("Transaction process completed, loading state set to false.");
    }
  };

  // Return JSX to render the transaction form and associated UI
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <TransactionForm
        fromAddress={fromAddress}
        recipient={recipient}
        amount={amount}
        onRecipientChange={(value) => {
          console.log("Recipient updated:", value);
          setRecipient(value);
        }}
        onAmountChange={(value) => {
          console.log("Amount updated:", value);
          setAmount(value);
        }}
        onSign={handleTransaction}
        onReset={() => {
          console.log("Form reset triggered.");
          resetForm();
        }}
        isLoading={isLoading}
        error={error}
        signatureResult={signatureResult}
      />
    </div>
  );
};

export default SignWithSafe;

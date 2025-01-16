import { useState } from "react";
import { createCapsuleViemClient } from "@usecapsule/viem-v2-integration";
import { sepolia } from "viem/chains";
import { http, parseEther } from "viem";
import Safe, { PredictedSafeProps, SafeAccountConfig } from "@safe-global/protocol-kit";
import useTransactionManager from "../../hooks/useTransactionManager";
import { capsuleClient } from "../../client/capsule";
import TransactionForm from "../../components/transaction-form";

interface Transaction {
  to: string;
  value: string;
}

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
    const RPC_URL = "https://eth-sepolia.g.alchemy.com/v2/JI22rKRHyoqhFLiTBjhB1LFZz8zXWzXI";
    console.log("Starting batch transaction process.");

    try {
      const capsuleViemClient: any = createCapsuleViemClient(capsule, {
        chain: sepolia,
        transport: http(RPC_URL),
      });
      console.log("Capsule Viem client initialized successfully.");

      // Configure Safe
      const safeAccountConfig: SafeAccountConfig = {
        owners: [await capsuleViemClient.account.address],
        threshold: 1,
      };

      console.log("Safe account configuration prepared:", safeAccountConfig);

      const predictedSafe: PredictedSafeProps = {
        safeAccountConfig,
      };

      // Initialize Safe Protocol Kit
      let protocolKit = await Safe.init({
        provider: RPC_URL,
        signer: capsuleViemClient.account.address,
        predictedSafe,
      });

      console.log("Safe Protocol Kit initialized.");

      const safeAddress = await protocolKit.getAddress();
      console.log("Predicted Safe address:", safeAddress);

      // Check if the Safe contract is already deployed
      const isDeployed = await protocolKit.isSafeDeployed();
      console.log("Safe deployment status:", isDeployed);

      if (!isDeployed) {
        console.log("Safe is not deployed. Creating deployment transaction.");

        const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction();
        console.log("Safe deployment transaction created:", deploymentTransaction);

        const txHash = await capsuleViemClient?.sendTransaction({
          to: deploymentTransaction.to as `0x${string}`,
          value: BigInt(deploymentTransaction.value),
          data: deploymentTransaction.data as `0x${string}`,
          chain: sepolia,
        });

        console.log("Deployment transaction sent. Transaction hash:", txHash);

        const txReceipt = await capsuleViemClient?.waitForTransactionReceipt({ hash: txHash });
        console.log("Deployment transaction receipt:", txReceipt);
      } else {
        console.log("Safe is already deployed. Skipping deployment.");
      }

      // Reconnect Protocol Kit to the deployed Safe
      protocolKit = await protocolKit.connect({ safeAddress });
      console.log("Reconnected Protocol Kit to the deployed Safe.");

      // Prepare and send batch transactions
      const transactionPayloads = transactions.map((tx) => ({
        account: safeAddress,
        to: tx.to,
        value: parseEther(tx.value).toString(),
      }));

      console.log("Transaction payloads prepared:", transactionPayloads);

      const transaction = await capsuleViemClient.sendTransaction(transactionPayloads);
      console.log("Batch transaction sent successfully:", transaction);
    } catch (error) {
      console.error("Error during batch transaction process:", error);
      throw error;
    }
  };

  // Function to handle the transaction process
  const handleTransaction = async () => {
    console.log("Handling transaction form submission.");

    try {
      setIsLoading(true);
      console.log("Transaction process started. Loading state set to true.");

      const newTransaction = {
        to: recipient,
        value: amount,
      };

      console.log("New transaction created:", newTransaction);

      const updatedTransactions = [...transactions, newTransaction];
      setTransactions(updatedTransactions);
      console.log("Transactions state updated:", updatedTransactions);

      await performBatchTransaction(capsuleClient, updatedTransactions);
      console.log("Batch transaction completed successfully.");

      setSignatureResult("Batch transaction executed successfully.");
      console.log("Signature result updated.");
    } catch (err: any) {
      console.error("Error during transaction handling:", err);
      setError(err.message || "Failed to execute transaction.");
    } finally {
      setIsLoading(false);
      console.log("Transaction process completed. Loading state set to false.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <TransactionForm
        fromAddress={fromAddress}
        recipient={recipient}
        amount={amount}
        onRecipientChange={(value) => {
          console.log("Recipient input updated:", value);
          setRecipient(value);
        }}
        onAmountChange={(value) => {
          console.log("Amount input updated:", value);
          setAmount(value);
        }}
        onSign={handleTransaction}
        onReset={() => {
          console.log("Resetting form.");
          resetForm();
          setTransactions([]); // Reset transactions state
          console.log("Transactions state reset.");
        }}
        isLoading={isLoading}
        error={error}
        signatureResult={signatureResult}
      />
    </div>
  );
};

export default SignWithSafe;

import { useState, useEffect } from "react";
import { createCapsuleViemClient } from "@usecapsule/viem-v2-integration";
import { sepolia } from "viem/chains";
import { http, parseEther } from "viem";
import Safe, { OperationType } from "@safe-global/protocol-kit";
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

  const [safeInstance, setSafeInstance] = useState<Safe | null>(null);
  const [safeAddress, setSafeAddress] = useState<string | null>(null);

  useEffect(() => {
    if (fromAddress) {
      initializeSafe();
    }
  }, [fromAddress]);

  const initializeSafe = async () => {
    const RPC_URL = "";
    
    try {
      const capsuleViemClient = createCapsuleViemClient(capsuleClient, {
        chain: sepolia,
        transport: http(RPC_URL),
      });

      // Initialize Safe with single signer (the Capsule EOA)
      let protocolKit = await Safe.init({
        provider: RPC_URL,
        signer: capsuleViemClient.account.address,
        predictedSafe: {
          safeAccountConfig: {
            owners: [await capsuleViemClient.account.address],
            threshold: 1
          }
        }
      });

      const predictedAddress = await protocolKit.getAddress();
      
      // Deploy if needed
      if (!await protocolKit.isSafeDeployed()) {
        const deploymentTransaction = await protocolKit.createSafeDeploymentTransaction();
        
        const txHash = await capsuleViemClient.sendTransaction({
          to: deploymentTransaction.to as `0x${string}`,
          value: BigInt(deploymentTransaction.value),
          data: deploymentTransaction.data as `0x${string}`,
          chain: sepolia,
        });

        await capsuleViemClient.waitForTransactionReceipt({ hash: txHash });
      }

      // Connect to deployed Safe
      protocolKit = await protocolKit.connect({ safeAddress: predictedAddress });
      setSafeInstance(protocolKit);
      setSafeAddress(predictedAddress);
      
    } catch (error) {
      console.error("Error initializing Safe:", error);
      setError("Failed to initialize Safe wallet");
    }
  };

  const handleTransaction = async () => {
    if (!safeInstance || !safeAddress) {
      setError("Safe wallet not initialized");
      return;
    }

    try {
      setIsLoading(true);

      // Create Safe transaction
      const safeTransactionData = {
        to: recipient,
        value: parseEther(amount).toString(),
        data: '0x',
        operation: OperationType.Call
      };

      // Create and execute transaction through Safe
      const safeTransaction = await safeInstance.createTransaction({ 
        transactions: [safeTransactionData] 
      });
      const executeTxResponse = await safeInstance.executeTransaction(safeTransaction);
      
      setSignatureResult(`Transaction executed: ${executeTxResponse.hash}`);
    } catch (err: any) {
      console.error("Error during transaction:", err);
      setError(err.message || "Failed to execute transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <TransactionForm
        fromAddress={fromAddress}
        recipient={recipient}
        amount={amount}
        onRecipientChange={setRecipient}
        onAmountChange={setAmount}
        onSign={handleTransaction}
        onReset={resetForm}
        isLoading={isLoading}
        error={error}
        signatureResult={signatureResult}
      />
    </div>
  );
};

export default SignWithSafe;

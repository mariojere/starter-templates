import { useState } from "react";
import { capsuleClient } from "./client/capsule";
import TransactionForm from "./components/transaction-form";
import useTransactionManager from "./hooks/useTransactionManager";
import { createCapsuleViemClient } from "@usecapsule/viem-v2-integration";
import { sepolia } from "viem/chains";
import { http, parseEther } from "viem";
import Safe, { EthersAdapter } from "@safe-global/protocol-kit";

interface Transaction {
 to: string;
 value: string;
 data: number | string;
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
 const performBatchTransaction = async (
   capsule: any,
   transactions: Transaction[]
 ) => {


   const RPC_URL = "https://ethereum-sepolia-rpc.publicnode.com";


   try {
     const capsuleViemClient: any = createCapsuleViemClient(capsule, {
       chain: sepolia,
       transport: http(RPC_URL),
     });


     const safeAddress = await capsuleViemClient.account.address;


     const ethAdapter = new EthersAdapter({
       ethers: capsuleViemClient,
       signerOrProvider: capsuleViemClient.account,
     });


     const safeSdk = await Safe.create({
       ethAdapter,
       safeAddress,
     });


     const safeTransactions = transactions.map(tx => ({
       to: tx.to,
       value: parseEther(tx.value.toString()).toString(),
       data: tx.data ? tx.data.toString() : '0x',
     }));


     const safeTransaction = await safeSdk.createTransaction({
        safeTransactionData: safeTransactions,
     });


     const safeTxHash = await safeSdk.getTransactionHash(safeTransaction);
     const senderSignature = await safeSdk.signTransactionHash(safeTxHash);
     safeTransaction.addSignature(senderSignature);


     const executionResponse = await safeSdk.executeTransaction(safeTransaction);
     return executionResponse;
   } catch (error) {
     console.error('Safe transaction error:', error);
     throw error;
   }
 };


 const handleTransaction = async () => {
   try {
     const newTransaction: Transaction = {
       to: recipient,
       value: amount,
       data: '0x',
     };


     setTransactions([newTransaction]);


     setIsLoading(true);
     const response = await performBatchTransaction(capsuleClient, transactions);


     setSignatureResult(response.hash || 'Transaction executed');
   } catch (err: any) {
     console.error('Transaction error:', err);
     setError(err.message || 'Failed to execute transaction');
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




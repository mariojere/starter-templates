import { AuthLayout, CapsuleModal, OAuthMethod } from "@usecapsule/react-sdk";
import "@usecapsule/react-sdk/styles.css";
import { useState, useEffect } from "react";

import { capsuleClient } from "./client/capsule";
import Logo from "./assets/capsule-logo.svg";
import SignWithSafe from "./with-safe";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to check login status
  const checkLoginStatus = async () => {
    try {
      const isLoggedIn = await capsuleClient.isFullyLoggedIn();
      if (isLoggedIn) {
        setIsLoggedIn(true); // Trigger a re-render when the user is logged in
      } else {
        setIsLoggedIn(false); // Ensure state is updated appropriately
      }
    } catch (error) {
      console.error("Error checking login status:", error);
    }
  };

  // useEffect to check login status on component mount
  useEffect(() => {
    checkLoginStatus();
  }, [isLoggedIn,capsuleClient]);

  return (
    <div className="mt-10 m-6 space-y-6 text-center">
      <h1>Capsule Modal + Safe</h1>
  
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
       
        {isLoggedIn ? (
        <p> Open Capsule Modal</p>
      ) : (
        <p>Log Into Your Account</p>
      )}
      </button>
      <CapsuleModal
        appName="Capsule Modal Starter Template"
        authLayout={[AuthLayout.AUTH_FULL]}
        capsule={capsuleClient}
        disableEmailLogin={false}
        disablePhoneLogin={false}
        isOpen={isModalOpen}
        logo={Logo}
        oAuthMethods={Object.values(OAuthMethod)}
        onClose={() => setIsModalOpen(false)}
        onRampTestMode={true}
        twoFactorAuthEnabled={false}
      />
      <SignWithSafe />
    </div>
  );
}

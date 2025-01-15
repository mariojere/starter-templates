import { AuthLayout, CapsuleModal, OAuthMethod } from "@usecapsule/react-sdk";
import "@usecapsule/react-sdk/styles.css";
import { useState } from "react";
import { capsuleClient } from "./client/capsule";
import Logo from "./assets/capsule-logo.svg";
import SignWithSafe from "./capsule-essential/signers/with-safe";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="mt-10 m-6 space-y-6 text-center">
      <h1>Capsule Modal With React Vite</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
      Open Capsule Modal
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
       {/* SignWithSafe component for handling Safe-based signing functionality */}
      <SignWithSafe />
    </div>
  );
}

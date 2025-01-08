import { AuthLayout, CapsuleModal, ExternalWallet, OAuthMethod } from "@usecapsule/react-sdk";
import "@usecapsule/react-sdk/styles.css";
import { useState } from "react";

import { capsuleClient } from "./client/capsule";
import Logo from "./assets/capsule-logo.svg";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Capsule Modal Starter Template with Next.js</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}>
        Open Capsule Modal
      </button>
      <CapsuleModal
        appName="Capsule Modal Starter Template"
        authLayout={[AuthLayout.AUTH_FULL, AuthLayout.EXTERNAL_CONDENSED]}
        capsule={capsuleClient}
        disableEmailLogin={false}
        disablePhoneLogin={false}
        externalWallets={[ExternalWallet.METAMASK, ExternalWallet.WALLETCONNECT, ExternalWallet.RAINBOW]}
        isOpen={isModalOpen}
        logo={Logo}
        oAuthMethods={Object.values(OAuthMethod)}
        onClose={() => setIsModalOpen(false)}
        onRampTestMode={true}
        twoFactorAuthEnabled={false}
      />
    </div>
  );
}

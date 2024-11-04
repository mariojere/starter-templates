<script lang="ts">
  import { CapsuleModal, OAuthMethod } from "@usecapsule/react-sdk";
  import "@usecapsule/react-sdk/styles.css";
  import Logo from "./assets/capsule-logo.svg";
  import { capsuleClient } from "./client/capsule";
  import { sveltify } from "svelte-preprocess-react";

  const react = sveltify({ CapsuleModal });
  let isModalOpen = false;
</script>

<div class="container">
  <h1>Capsule Modal Starter Template with Svelte Kit</h1>
  <button on:click={() => isModalOpen = true}>
    Open Capsule Modal
  </button>
  <react.CapsuleModal
    capsule={capsuleClient}
    appName="Capsule Modal Starter Template"
    logo={Logo}
    disableEmailLogin={false}
    disablePhoneLogin={false}
    oAuthMethods={Object.values(OAuthMethod)}
    isOpen={isModalOpen}
    onClose={() => isModalOpen = false}
    onRampTestMode={true}
    twoFactorAuthEnabled={false}
  />
</div>

<style>
  .container {
    text-align: center;
    margin-top: 50px;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
  }
</style>


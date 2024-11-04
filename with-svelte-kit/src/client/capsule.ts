import { Environment, CapsuleWeb } from "@usecapsule/react-sdk";

const CAPSULE_API_KEY = import.meta.env.VITE_CAPSULE_API_KEY;

export const capsuleClient = new CapsuleWeb(Environment.BETA, CAPSULE_API_KEY);

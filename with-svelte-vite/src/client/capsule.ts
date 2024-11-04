import { Environment, CapsuleWeb } from "@usecapsule/react-sdk";

const CAPSULE_API_KEY = process.env.NEXT_PUBLIC_CAPSULE_API_KEY;

export const capsuleClient = new CapsuleWeb(Environment.BETA, CAPSULE_API_KEY);

import { PublicClient, mainnet } from "@lens-protocol/react";
import { fragments } from "../fragments";

export const lensClient = PublicClient.create({
  environment: mainnet,
  storage: window.localStorage,
  fragments,
});
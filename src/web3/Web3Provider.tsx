import { WagmiProvider, createConfig, http } from "wagmi";
import { chains } from "@lens-chain/sdk/viem";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import type { ReactNode } from "react";
import { LensProvider } from "@lens-protocol/react";
import { lensClient } from "../lens/client";

const config = createConfig(
  getDefaultConfig({
    chains: [chains.mainnet, chains.testnet],
    transports: {
      [chains.mainnet.id]: http(chains.mainnet.rpcUrls.default.http[0]!),
      [chains.testnet.id]: http(chains.testnet.rpcUrls.default.http[0]!),
    },
    walletConnectProjectId: "",
    appName: "Lens Testing App",
    appDescription: "A sample app integrating Lens Testing wallet connection.",
    appUrl: "http://localhost:3000/",
    appIcon: "http://localhost:3000//icon.png",
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>
         <LensProvider client={lensClient}>
            {children}
          </LensProvider>
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
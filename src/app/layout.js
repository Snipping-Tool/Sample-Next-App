"use client";

// import Web3body from "./components/Web3Body";
import "./globals.css";
import { Inter } from "next/font/google";
import {
  EthereumClient,
  w3mConnectors,
  w3mProvider,
} from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { configureChains, createConfig, WagmiConfig, sepolia } from "wagmi";
import { arbitrum, mainnet, polygon } from "wagmi/chains";

const chains = [sepolia];
const projectId = "25d7fb07081d531b1cad27efec3539c6";

const { publicClient } = configureChains(chains, [w3mProvider({ projectId })]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  publicClient,
});

const ethereumClient = new EthereumClient(wagmiConfig, chains);

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Sample Next App",
  description: "A sample next app for expirementation",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-900 text-slate-100`}>
        <WagmiConfig config={wagmiConfig}>
          {children}
          <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
        </WagmiConfig>
      </body>
    </html>
  );
}

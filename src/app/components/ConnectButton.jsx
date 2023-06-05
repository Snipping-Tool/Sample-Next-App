"use client";

import { Web3Button, useWeb3Modal } from "@web3modal/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { VscDebugDisconnect } from "react-icons/vsc";

const ConnectButton = () => {
  const { open, close } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect } = useConnect();
  const [shortenedAddress, setShortenedAddress] = useState("");
  const [isConnectedState, setIsConnectedState] = useState("");

  const shortenAddress = (wallet) => {
    let shortened = wallet.slice(0, 5) + "..." + wallet.slice(-4);
    setShortenedAddress(shortened);
  };

  useEffect(() => {
    // Check if there is a previously stored connection status
    const storedConnection = localStorage.getItem("isConnected");
    if (storedConnection === "true") {
      connect();
    }
  }, []);

  useEffect(() => {
    setIsConnectedState(isConnected);
    if (address) {
      shortenAddress(address);
    }
  }, [address, isConnected]);

  useEffect(() => {
    // Store the connection status in local storage
    localStorage.setItem("isConnected", String(isConnected));
  }, [isConnectedState]);

  return (
    <div>
      {isConnectedState ? (
        <>
          <div className="flex flex-row gap-[10px]">
            <Link
              href="/profile"
              className="flex flex-col bg-slate-800 rounded-[13px] h-[50px] w-[150px] truncate px-5 border-[2px] duration-[700ms] items-center justify-center hover:text-slate-900 hover:bg-slate-100"
            >
              {shortenedAddress}
              <p className="text-[10px] uppercase mt-[-5px]">Profile</p>
            </Link>
            <button
              onClick={() => disconnect()}
              className="flex flex-row items-center justify-center bg-red-500 rounded-[13px] h-[50px] px-[15px] gap-[5px] overflow-hidden group duration-700 w-[50px] hover:w-[150px]"
            >
              <VscDebugDisconnect />
              <p className="hidden text-[15px] group-hover:flex">Disconnect</p>
            </button>
          </div>
        </>
      ) : (
        <button
          className="bg-slate-800 rounded-[13px] h-[50px] items-center px-5 border-[2px] duration-[500ms]"
          onClick={() => open()}
        >
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default ConnectButton;

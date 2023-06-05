"use client";
import React, { useEffect, useState } from "react";
import coinAbi from "../abi/coin.json";
import nftAbi from "../abi/nft.json";
import coinDispenserAbi from "../abi/dispenser.json";
import nftMinterAbi from "../abi/minter.json";
import dispenserAbi from "../abi/dispenser.json";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useConnect,
  useWaitForTransaction,
  useWatchPendingTransactions,
} from "wagmi";
import { utils } from "ethers";
import { FaCoins } from "react-icons/fa";
import { CgGift } from "react-icons/cg";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const MintBody = () => {
  const { address, isConnected } = useAccount();
  const [addressState, setAddressState] = useState("");
  const [isConnectedState, setIsConnectedState] = useState("");
  const [nftImage, setNftImage] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [nftClaimId, setNftClaimId] = useState(null);
  const [nftSignature, setNftSignature] = useState(null);
  const [writeSuccessful, setWriteSuccessful] = useState(false);
  const { connect } = useConnect();
  const [undistributedRewards, setUndistributedRewards] = useState(null);
  const [totalRewardsSignedData, setTotalRewardsSignedData] = useState(null);
  const [refreshUndistributedRewards, setRefreshUndistributedRewards] =
    useState(false);
  const [refreshUserTokenClaimData, setRefreshUserTokenClaimData] =
    useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);

  const [tokenClaimData, setTokenClaimData] = useState([
    1,
    1,
    1,
    "0xf0eea937c1003184bf0b16a6e53ecb2e1b574debdb77ffea0f63d57a274cb85c070a82d2e5c9c6e460f6a525041a1201011417b910e4ded180c8d689fdb48cdc1b",
  ]);

  useEffect(() => {
    setAddressState(address);
  }, [address]);

  // Set up the contract write hook
  const { data, isLoading, isSuccess, transactionState, write } =
    useContractWrite({
      address: process.env.minterAddress,
      abi: nftMinterAbi,
      functionName: "claim",
      args: [nftClaimId, nftSignature],
    });

  // Set up the contract write hook
  const {
    data2,
    isLoading2,
    isSuccess2,
    transactionState2,
    write: write2,
  } = useContractWrite({
    address: process.env.dispenserAddress,
    abi: dispenserAbi,
    functionName: "claimRewards",
    onSuccess(data) {
      setCurrentHash(data.hash);
      console.log("Success", data);
      alert("Tokens Claimed");
      // setTimeout(() => {
      //   setTransactionLoading(false);
      // }, 5000);
    },
    args: [
      tokenClaimData[0],
      tokenClaimData[1],
      tokenClaimData[2],
      tokenClaimData[3],
    ],
  });
  const [currentHash, setCurrentHash] = useState("");

  // const { data3, isError3, isLoading3 } = useWaitForTransaction({
  //   hash: currentHash,
  // });

  // useEffect(() => {
  //   console.log(transactionState2);
  //   // setTransactionLoading(isLoading3);
  // }, [transactionState2]);

  // useEffect(() => {
  //   setTransactionLoading(isLoading3);
  // }, [isLoading3]);

  // useWatchPendingTransactions({
  //   listener: (hashes) => console.log(hashes),
  // });

  // useEffect(() => {

  // }, [currentHash]);

  const {
    data: coinBalance,
    isLoading: isCoinLoading,
    error: coinError,
  } = useContractRead({
    address: process.env.coinAddress,
    abi: coinAbi,
    functionName: "balanceOf",
    args: [address ? address : "0x000000000000000000000000000000000000dEaD"],
  });

  const {
    data: nftBalance,
    isLoading: isNftLoading,
    error: nftError,
  } = useContractRead({
    address: process.env.nftAddress,
    abi: nftAbi,
    functionName: "balanceOf",
    args: [address ? address : "0x000000000000000000000000000000000000dEaD"],
  });

  const {
    data: tokenOfOwnerByIndex,
    isLoading: isIndexLoading,
    error: indexError,
  } = useContractRead({
    address: process.env.nftAddress,
    abi: nftAbi,
    functionName: nftBalance > 0 ? "tokenOfOwnerByIndex" : "dummyFunction",
    args: [address ? address : "0x000000000000000000000000000000000000dEaD", 0],
  });

  const [refetchTrigger, setRefetchTrigger] = useState(0); // Add this state variable

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRefetchTrigger((prev) => prev + 1); // This will trigger re-invocation of useContractRead
    }, 5000); // Change interval as needed

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    // Check if there is a previously stored connection status
    const storedConnection = localStorage.getItem("isConnected");
    if (storedConnection === "true") {
      connect();
    }
  }, []);

  useEffect(() => {
    // Store the connection status in local storage
    localStorage.setItem("isConnected", String(isConnected));
    setIsConnectedState(isConnected);
  }, [isConnected]);

  const {
    data: totalClaimed,
    isLoading: isTotalClaimedLoading,
    error: isTotalClaimedError,
  } = useContractRead({
    address: process.env.dispenserAddress,
    abi: coinDispenserAbi,
    functionName: "totalClaimed",
    args: [tokenOfOwnerByIndex ? parseInt(tokenOfOwnerByIndex) : 999999],
    refetchTrigger,
  });

  // In the useEffect that runs when transactionState changes:
  useEffect(() => {
    if (transactionState && transactionState.status === "confirmed") {
      setWriteSuccessful((prevState) => !prevState); // Toggle the writeSuccessful state
      window.location.reload(); // Refresh the page
    }
  }, [transactionState]);

  useEffect(() => {
    if (parseInt(nftBalance) > 0 && tokenOfOwnerByIndex) {
      const ipfsUrl = `ipfs://QmeSjSinHpPnmXmspMjwiXyN6zS4E9zccariGR3jxcaWtq/${tokenOfOwnerByIndex}`;
      const httpUrl = ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");

      fetch(httpUrl)
        .then((response) => response.json())
        .then((data) => {
          setNftImage(data.image.replace("ipfs://", "https://ipfs.io/ipfs/"));
        })
        .catch(console.error);
    }
  }, [nftBalance, tokenOfOwnerByIndex]);

  const checkRegistration = async (address) => {
    fetch(`${process.env.nftAPI}/is_register_for_nft_reward?address=${address}`)
      .then((response) => {
        if (response.status === 200) {
          response.json().then((data) => {
            setNftClaimId(JSON.parse(data.item.result).claimId);
            setNftSignature(JSON.parse(data.item.result).signature);
            setIsRegistered(true);
          });
        }
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  };

  useEffect(() => {
    // let intervalId;
    if (address) {
      checkRegistration(address);
      // intervalId = setInterval(checkRegistration(address), 5000);
      // return () => clearInterval(intervalId);
    }
  }, [address]);

  const fetchUndistributedRewards = async (tokenOfOwnerByIndex) => {
    try {
      const response = await fetch(
        `${process.env.nftAPI}/get_undistributed_user_rewards?nftId=${tokenOfOwnerByIndex}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUndistributedRewards(data.updatedReward);
      setRefreshUndistributedRewards(false);
    } catch (error) {
      console.error(`There was a problem fetching the data: ${error}`);
    }
  };

  const fetchRewardsClaim = async (tokenOfOwnerByIndex) => {
    try {
      const response = await fetch(
        `${process.env.nftAPI}/user_token_reward_claim_data?nftId=${tokenOfOwnerByIndex}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalRewardsSignedData(data.item.Value.accumulatedAmount);
      // setTokenClaimData(data.item.Value);
      setRefreshUserTokenClaimData(false);
      const d = data.item.Value;
      const saved = [
        d.claimId,
        parseInt(tokenOfOwnerByIndex),
        d.accumulatedAmount,
        d.signature,
      ];
      setTokenClaimData(saved);
      // console.log("DATA: ", tokenClaimData, d.accumulatedAmount);
    } catch (error) {
      console.error(`There was a problem fetching the data: ${error}`);
    }
  };

  useEffect(() => {
    if (tokenOfOwnerByIndex) {
      fetchRewardsClaim(tokenOfOwnerByIndex);
      fetchUndistributedRewards(tokenOfOwnerByIndex);
    }
    setInterval(() => {
      if (tokenOfOwnerByIndex) {
        fetchRewardsClaim(tokenOfOwnerByIndex);
        fetchUndistributedRewards(tokenOfOwnerByIndex);
      }
    }, 5000);
  }, [tokenOfOwnerByIndex]);

  useEffect(() => {
    if (totalRewardsSignedData && totalClaimed) {
      let claimables =
        utils.formatEther(totalRewardsSignedData) -
        utils.formatEther(totalClaimed);
      if (claimables == 0) {
        setTransactionLoading(false);
      }
    }
  }, [totalRewardsSignedData, totalClaimed]);

  if (!addressState) {
    return <div>Connect your wallet to view your profile</div>;
  }

  if (coinError) {
    return <div>Error: {coinError.message}</div>;
  }

  if (nftError) {
    return <div>Error: {nftError.message}</div>;
  }

  if (indexError && nftBalance > 0) {
    return <div>Error: {indexError.message}</div>;
  }

  return (
    <div className="flex md:flex-row flex-col justify-around items-center w-full mt-[30px] gap-[10px]">
      {parseInt(nftBalance) > 0 && nftImage ? (
        <>
          <img
            src={nftImage}
            alt="NFT Image"
            className="flex rounded-[10px] object-contain md:w-[48%] w-[98%]"
          />
          <div className="flex flex-col md:w-[48%] w-[98%] gap-[20px]">
            <div className="flex flex-col w-full justify-around bg-slate-800 text-slate-200 h-full rounded-[10px] p-[25px] gap-[5px]">
              <p className="text-[20px] font-bold mb-[10px]">
                Token ID# :{" "}
                {isNftLoading ? "Loading..." : parseInt(tokenOfOwnerByIndex)}
              </p>
              <p className="text-[15px]">
                Claimable :{" "}
                {totalRewardsSignedData && totalClaimed
                  ? utils.formatEther(totalRewardsSignedData) -
                    utils.formatEther(totalClaimed)
                  : 0}
              </p>
              <p className="text-[15px]">
                Undistributed:{" "}
                {undistributedRewards
                  ? utils.formatEther(undistributedRewards)
                  : 0}
              </p>
              <p className="text-[15px]">
                Total Claimed:{" "}
                {isTotalClaimedLoading
                  ? "Loading..."
                  : utils.formatEther(totalClaimed)}
              </p>
              <p className="text-[15px]">
                Coin Balance:{" "}
                {isCoinLoading ? "Loading..." : utils.formatEther(coinBalance)}
              </p>
            </div>
            <div className="flex md:flex-row flex-col items-center justify-around gap-2">
              <button
                onClick={async () => {
                  try {
                    const response = await fetch(
                      `${process.env.nftAPI}/add_reward`,
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          nftId: parseInt(tokenOfOwnerByIndex),
                          reward: utils.parseEther("1.0").toString(),
                        }),
                      }
                    );

                    if (!response.ok) {
                      throw new Error("Network response was not ok");
                    }

                    const data = await response.json();
                    setRefreshUndistributedRewards(true);
                    setRefreshUserTokenClaimData(true);

                    // The response was successful, show the alert
                    alert("1 coin earned");
                    fetchUndistributedRewards(tokenOfOwnerByIndex);
                    fetchRewardsClaim(tokenOfOwnerByIndex);
                  } catch (error) {
                    console.error(
                      "There has been a problem with your fetch operation:",
                      error
                    );
                  }
                }}
                className="flex bg-purple-700 text-slate-200 md:w-[48%] w-full tracking-wide items-center justify-center py-[10px] text-[15px] rounded-[10px] uppercase gap-[5px]"
              >
                <FaCoins />
                Earn Coins
              </button>

              {transactionLoading ? (
                <button className="flex bg-green-700 text-slate-200 md:w-[48%] w-full tracking-wide items-center justify-center py-[10px] text-[15px] rounded-[10px] uppercase gap-[5px]">
                  <AiOutlineLoading3Quarters className="animate-spin" />
                  Claiming
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (tokenClaimData[2] < 0) {
                      console.error(
                        "Accumulated Amount must be greater than 0"
                      );
                      return;
                    }

                    try {
                      write2();
                      // console.log("Transaction result:", result);
                      setTransactionLoading(true);

                      setRefreshUserTokenClaimData(true);
                      console.log("TOKEN CLAIM: ", tokenClaimData);

                      // The response was successful, show the alert
                      // if (result) alert("Tokens Claimed");
                      fetchRewardsClaim(tokenClaimData);
                    } catch (error) {
                      console.error("Error sending transaction:", error);
                    }
                  }}
                  className="flex bg-green-700 text-slate-200 md:w-[48%] w-full tracking-wide items-center justify-center py-[10px] text-[15px] rounded-[10px] uppercase gap-[5px]"
                >
                  <CgGift />
                  Claim rewards
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="flex w-full justify-center">
          {isRegistered ? (
            <button
              onClick={async () => {
                if (!nftClaimId || !nftSignature) {
                  console.error("Claim ID or Signature is missing");
                  return;
                }

                try {
                  const result = await write();
                  console.log("Transaction result:", result);
                } catch (error) {
                  console.error("Error sending transaction:", error);
                }
              }}
              className="flex bg-slate-800 text-slate-200 px-[50px] tracking-wide items-center justify-center py-[10px] text-[20px] rounded-[10px] my-[300px]"
            >
              Claim NFT
            </button>
          ) : (
            <button
              onClick={async () => {
                try {
                  const response = await fetch(
                    `${process.env.nftAPI}/register_address_for_reward`,
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        receiverAddress: address,
                      }),
                    }
                  );

                  if (!response.ok) {
                    throw new Error("Network response was not ok");
                  }

                  // The response was successful, show the alert
                  alert("Registration successful!");
                } catch (error) {
                  console.error(
                    "There has been a problem with your fetch operation:",
                    error
                  );
                }
              }}
              className="flex bg-slate-800 text-slate-200 px-[50px] tracking-wide items-center justify-center py-[10px] text-[20px] rounded-[10px] my-[300px]"
            >
              Mint NFT
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MintBody;

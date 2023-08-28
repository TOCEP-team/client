"use client";

import { memo, useEffect, useState } from "react";
import { selectAccountId, selectWallet } from "@/features/walletSlice";
import { useSelector } from "react-redux";
import DropdownMenu from "@/components/DropdownMenu";
import Link from "next/link";


function ConnectWalletButton() {
  const wallet = useSelector(selectWallet);
  const account = useSelector(selectAccountId);
  const [data, setData] = useState()
  const [isDataFetched, setDataFetched] = useState(false)

  const onConnectWalletClicked = async () => {
    if (!wallet)
      return {
        title: "Wallet not initialized",
        description: "Please try again later",
        status: "error",
      };

    if (wallet.accountId) {
      return {
        title: "Wallet already connected",
        status: "info",
      };
    }

    wallet.signIn();
  };


  useEffect(() => {
    const getData = async () => {
      if (wallet && account) {
        const result = await wallet.viewMethod({
          contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME || "",
          method: "get_user_metadata_by_user_id",
          args: {
            user_id: account,
          }
        });
        setData(result)
        setDataFetched(true);
      }
    }
    getData()
  }, [wallet, isDataFetched])

  const isWalletConnected = !!wallet?.accountId;

  return isWalletConnected ? (
    <div className="flex items-center space-x-4">
      {data && 
       <Link href="/pool-request/create" className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">Request Course</Link>
      }
      <DropdownMenu account={account} data={data} wallet={wallet}/>
    </div>
  ) : (
      <button onClick={onConnectWalletClicked} className="border-gray-300 shadow-md bg-[#fbc40f] px-4 py-2 rounded-md text-gray-600 hover:bg-[#c99d0c] hover:text-white transition-all duration-100 font-medium ease-in-out">
        Connect
      </button>
  );
}

export default memo(ConnectWalletButton);

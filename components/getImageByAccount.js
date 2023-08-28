'use client'

import { selectWallet } from "@/features/walletSlice";
import Image from "next/image";
import { useState } from "react";
import { useEffect } from "react"
import { useSelector } from "react-redux";

const ImageAccount = ({user_id}) => {
  const wallet = useSelector(selectWallet);
  const [walletReady, setWalletReady] = useState(false);
  const [user, setUser] = useState('')

  useEffect(() => {
    const getData = async () => {
      setWalletReady(false)
      try {
          await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
            method: "get_user_metadata_by_user_id",
            args: {
              user_id: user_id !== '' ? user_id : ''
            }
          }).then((res) => setUser(res))
      } catch (err) {
        console.log(err)
      } finally {
        setWalletReady(true)
      }
    };
    
    if (user_id !== '') {
      getData();
    }
  }, [walletReady]);

  return (
    <div>
      {user &&
       <Image src={user.metadata.avatar} alt="image" fill className="object-cover"/>
      }
    </div>
  )
}

export default ImageAccount

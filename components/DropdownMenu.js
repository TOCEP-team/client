'use client'

import { selectAccountId, selectIsLoading, selectWallet } from '@/features/walletSlice';
import Link from 'next/link';
import React, { useState } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

const DropdownMenu = ({account, data, wallet}) => {
  const signOutClick = async () => {
    if (!wallet)
      return {
        title: "Wallet not initialized",
        description: "Please try again later",
        status: "error",
      };

    wallet.signOut();
  };
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const openDropdown = () => {
    setIsDropdownOpen(true);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const [user, setUser] = useState(null);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (account) {
          let user = await wallet.viewMethod({
            contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME || "",
            method: "get_user_metadata_by_user_id",
            args: {
              user_id: account
            }
          });
          setUser(user);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    }

    fetchUser();
  }, [wallet, isLoading]);

  return (
    <div className="relative inline-block">
      <button
        className="font-semibold transition duration-300"
        onMouseEnter={openDropdown}
        onMouseLeave={closeDropdown}
      >
        <img src={data?.metadata.avatar || "/images/logo.jpg"} alt="avatar" className="rounded-full object-cover w-12 h-12"/>
      </button>
      {isDropdownOpen && (
        <div
          className="z-50 absolute -right-4 top-12 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-md transform origin-top transition duration-300 scale-100 text-gray-800 flex flex-col"
          onMouseEnter={openDropdown}
          onMouseLeave={closeDropdown}
        >
          <div className="-z-5 w-28 h-8 right-0 -top-3 absolute"/>
          <ul className="z-10 font-medium">
            {!user ? (
              <Link href={`/profile/create`} className="flex w-full justify-center items-center text-center">
                <div className="hover:bg-gray-200 px-4 py-2 w-full">
                  Register
                </div>
              </Link>
            ) : (
              <Link href={`/profile/${account}`} className="border border-top flex w-full justify-center items-center text-center">
                <div className="hover:bg-gray-200 px-4 py-2 w-full">
                  My Profile
                </div>
              </Link>
            )}
            <button onClick={signOutClick} className="justify-start flex w-full">
              <div className="hover:bg-gray-200 px-4 py-2 w-full">
                Sign Out
              </div>
            </button>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;

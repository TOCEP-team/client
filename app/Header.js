'use client'

import Image from "next/image";
import Link from "next/link";
import ConnectButton from "./ConnectButton";
import {motion} from 'framer-motion'

const Header = () => {
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
      }}
      className="grid grid-cols-6 gap-x-4 max-w-[1440px] mx-auto py-2 z-10">
      {/* Left */}
      <div className="flex space-x-8 items-center justify-start">
        <Link href="/" className="flex items-center space-x-2 z-10">
          <Image
            src="/images/logo.jpg"
            width={40}
            height={40}
            alt="logo"
            className="rounded-full"
          />
          <h2 className="font-extrabold hidden lg:flex text-xl leading-[24px] text-primary items-center">
            TOCEP
            <span className="text-secondary font-bold text-3xl items-center">
              .
            </span>
            <span className="text-light font-bold text-xl items-center">_</span>
          </h2>
        </Link>{" "}
      </div>

      {/* Right */}
      <nav className="flex w-full justify-center items-center font-light col-span-4">
        <ul className="flex items-center text-center justify-between space-x-4 text-[22px]">
          <Link href="/">
            <li className="text-[16px] text-gray-600 group-hover:underline hover:font-bold  transition-all duration-200 ease-in-out">
              HOME
            </li>
          </Link>
          <Link href="/mentors">
            <li className="text-[16px] text-gray-600 group-hover:underline hover:font-bold  transition-all duration-200 ease-in-out">
              FIND MENTORS
            </li>
          </Link>
          <Link href="/pool-request">
            <li className="text-[16px] text-gray-600 group-hover:underline hover:font-bold  transition-all duration-200 ease-in-out">
              LEARNING REQUEST
            </li>
          </Link>
          <Link href="/combo-course">
            <li className="text-[16px] text-gray-600 group-hover:underline hover:font-bold  transition-all duration-200 ease-in-out">
              COMBO COURSES
            </li>
          </Link>
        </ul>
      </nav>
      <div className="flex items-end justify-end">
        <ConnectButton />
      </div>
    </motion.header>
  );
};

export default Header;

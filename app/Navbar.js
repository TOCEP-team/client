import Link from "next/link";
import { IoMenuOutline } from "react-icons/io5";

const Navbar = () => {
  return (
    <nav className="py-2 max-w-[1440px] lg:w-3/4 px-2 z-10 mx-auto grid grid-cols-6">
      <div className="col-span-1 flex space-x-2 cursor-pointer">
        <IoMenuOutline className="text-2xl text-gray-500" />
        <h1 className="font-medium text-gray-800">CATEGORIES</h1>
      </div>
      <div className="border-x border-gray-400 col-span-4 flex justify-start px-4 space-x-8">
        <Link
          href="#"
          className="text-[15px] font-medium text-gray-800 hover:underline"
        >
          FOR INSTRUCTORS
        </Link>
        <Link
          href="#"
          className="text-[15px] font-medium text-gray-800 hover:underline"
        >
          FOR SUBCRIBLES
        </Link>
        <Link
          href="#"
          className="text-[15px] font-medium text-gray-800 hover:underline"
        >
          FOR MARKETERS
        </Link>
      </div>
      <div className="col-span-1 justify-end flex">
        <Link href="#about" className="flex flex-col items-end justify-end ">
          <h1 className="text-[15px] font-medium text-gray-800 hover:underline">
            ABOUT US
          </h1>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;

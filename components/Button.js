import Link from "next/link"

const ButtonLink = ({link, children}) => {
  return (
    <Link href={link} className="border border-gray-400 rounded-md px-4 py-2 items-center justify-center text-center mt-4 hover:bg-gray-200 hover:font-bold">
      {children}
    </Link>
  )
}

export default ButtonLink

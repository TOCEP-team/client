import Link from "next/link"
import React from "react"

export default function BreadcrumbRoundedElevatedIconPreview({breadcrumbs}) {
  return (
    <>
      {/* <!-- Component: Elevated breadcrumb with leading icon --> */}
      <nav aria-label="Breadcrumb">
        <ol className="flex h-14 list-none items-stretch gap-2 rounded pb-4 ">
          {breadcrumbs.map((item, index) => {
            return (
              <li
                className={`${
                  index === 0
                    ? "flex items-center gap-2"
                    : index === breadcrumbs.length - 1
                    ? "flex flex-1 items-center"
                    : index === breadcrumbs.length - 2
                    ? "flex items-center gap-2"
                    : "hidden items-center gap-2 md:flex"
                }`}
                key={index}
              >
                <Link
                  href={item.path}
                  className={`${
                    index === breadcrumbs.length - 1
                      ? "pointer-events-none max-w-[20ch] items-center gap-1 truncate whitespace-nowrap text-slate-400"
                      : "flex max-w-[20ch] items-center gap-1 truncate whitespace-nowrap text-slate-700 transition-colors hover:text-emerald-500"
                  }`}
                >
                  {index === 0 ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                      aria-labelledby={`aria-main-title-0${index} aria-main-description-0${index}`}
                      role="link"
                    >
                      <title id="title">Home</title>
                      <desc id="description">
                        Home button indicating the homepage of the website.
                      </desc>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                  ) : (
                    item.path
                  )}
                </Link>

                {index !== breadcrumbs.length - 1 && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 flex-none stroke-slate-700 transition-transform md:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    aria-hidden="true"
                    aria-labelledby={`aria-title-0${index} aria-description-0${index}`}
                    role="graphics-symbol"
                  >
                    <title id={`title-0${index}`}>Arrow</title>
                    <desc id={`description-0${index}`}>
                      Arrow icon that points to the next page in big screen
                      resolution sizes and previous page in small screen
                      resolution sizes.
                    </desc>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
      {/* <!-- End Elevated breadcrumb with leading icon --> */}
    </>
  )
}

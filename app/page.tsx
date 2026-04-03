import LatestBlogs from "@/components/page/LatestBlogs"
import { geologica, alegreyna } from "@/lib/fonts"
import Link from "next/link"
import { Suspense } from "react"

const ArrowUpRight = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M2 12L12 2M12 2H5M12 2v7" />
  </svg>
)

const page = async () => {
  return (
    <div className="bg-[#f0f2f4] dark:bg-[#151718] min-h-screen px-4">
      <div className="max-w-xl w-full mx-auto pt-16 flex flex-col gap-10">

        <section>
          <div className="flex items-start justify-between mb-4">
            <h1 className={`${geologica.className} text-3xl font-bold dark:text-white`}>
              Hey there. 👋
            </h1>
            <Link href="/about" className="text-md text-gray-700 dark:text-gray-300 flex items-center gap-1 mt-2">
              Read more <ArrowUpRight />
            </Link>
          </div>
          <p className={`${alegreyna.className} text-2xl leading-relaxed text-gray-800 dark:text-gray-300`}>
            I'm James. I work in the Quality Engineering team at{" "}
            <Link href="https://pdax.ph/" className="text-blue-600 dark:text-blue-400 hover:underline">
              Philippine Digital Asset Exchange
            </Link>
            , and I’m based in the Philippines. In my free time, I enjoy watching{" "}
            <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              anime
            </Link>
            , riding my{" "}
            <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              motorcycle
            </Link>
            , and occasionally writing{" "}
            <Link href="#" className="text-blue-600 dark:text-blue-400 hover:underline">
              blogs
            </Link>{" "}
            about what I’m learning and experiences from my daily life.
          </p>
        </section>


        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className={`${geologica.className} text-3xl font-bold dark:text-white`}>
              Latest Blogs
            </h2>
            <Link href="/blog" className="text-md text-gray-700 dark:text-gray-300 flex items-center gap-1">
              View all <ArrowUpRight />
            </Link>
          </div>

          <Suspense fallback={<div className={`text-bg w-[100%] h-[200px] flex items-center justify-center text-2xl ${alegreyna.className}`}>Loading Blogs...</div>}>
            <LatestBlogs />
          </Suspense>
        </section>

      </div>
    </div>
  )
}

export default page
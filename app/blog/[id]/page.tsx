import type { Metadata } from "next"

import { geologica, alegreyna } from "@/lib/fonts"
import { supabase } from "@/lib/supabase"
import { timeAgo } from "@/lib/reusable/time"
import Link from "next/link"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const { id } = await params

    const { data: blog } = await supabase
        .from('blogs')
        .select('title')
        .eq('id', id)
        .single()

    return {
        title: blog?.title ?? "Blog — James",
    }
}

const IdPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params

    const { data: blog, error } = await supabase
        .from('blogs')
        .select('title, content, type, created_at')
        .eq('id', id)
        .single()

    if (error || !blog) return <div>Blog not found.</div>

    return (
        <div className="bg-[#f0f2f4] dark:bg-[#151718] min-h-screen px-4">
            <div className="max-w-xl w-full mx-auto pt-24 flex flex-col gap-8">

                <div className="flex flex-col gap-4">

                    <div className="flex items-center justify-between pb-4">
                        <div className="flex items-center gap-2">
                            <Link href='/'>
                                <img src='/pfp.png' className="w-[40px] h-[40px] rounded-full bg-gray-400" />
                            </Link>
                            <div>
                                <Link href='/'>
                                    <p className="text-sm font-medium dark:text-white">James Talamo</p>
                                </Link>
                                <p className="text-xs text-gray-400">{timeAgo(blog.created_at)} · {blog.type}</p>
                            </div>
                        </div>
                    </div>

                    <h1 className={`${geologica.className} text-4xl font-bold dark:text-white`}>
                        {blog.title}
                    </h1>

                    <p className={`${alegreyna.className} text-gray-700 dark:text-gray-300 text-2xl leading-relaxed`}>
                        {blog.content}
                    </p>
                </div>

            </div>
        </div>
    )
}

export default IdPage
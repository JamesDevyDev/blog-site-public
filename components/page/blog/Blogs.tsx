import { supabase } from '@/lib/supabase'
import { alegreyna } from "@/lib/fonts"
import Link from 'next/link'

import { timeAgo } from '@/lib/reusable/time'

type Blog = {
    id: number,
    title: string,
    created_at: string,
    type: string
}

const Blogs = async () => {

    const { data, error } = await supabase
        .from('blogs')
        .select('id ,title, type, created_at')
        .returns<Blog[]>()

    return (
        <div className="flex flex-col gap-3">
            {(!data || error) && <div className={`text-bg w-[100%] h-[200px] flex items-center justify-center text-2xl ${alegreyna.className}`}>Failed to fetch Blogs...</div>}

            {data?.map((post) => (
                <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="bg-white dark:bg-[#1e2122] py-7 border border-gray-200 dark:border-gray-700 rounded-md px-5 py-4 hover:shadow-md transition-shadow"
                >
                    <p className={`${alegreyna.className} text-lg font-semibold text-gray-900 dark:text-white mb-1`}>
                        {post.title}
                    </p>
                    <p className="text-sm text-gray-400">
                        Posted {timeAgo(post.created_at)} · {post.type}
                    </p>
                </Link>
            ))}
        </div>
    )
}

export default Blogs

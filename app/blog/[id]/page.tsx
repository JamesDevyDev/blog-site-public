import type { Metadata } from "next"

import { supabase } from "@/lib/supabase"
import { timeAgo } from "@/lib/reusable/time"
import Link from "next/link"
import Content from "@/components/page/blog/id/Content"
import { Suspense } from "react"

import { Skeleton } from "@/components/ui/skeleton"

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

    const { data: blog } = await supabase
        .from('blogs')
        .select('created_at, type')
        .eq('id', id)
        .single()

    return (
        <div className="bg-[#f0f2f4] dark:bg-[#151718] min-h-screen px-10">
            <div className="max-w-xl w-full mx-auto pt-10 flex flex-col gap-8">

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
                                <p className="text-xs text-gray-400">{timeAgo(blog?.created_at)} · {blog?.type}</p>
                            </div>
                        </div>
                    </div>

                    <Suspense fallback={
                        <div className='flex flex-col gap-4'>
                            <Skeleton className='h-[30px] w-[200px] ' />
                            <Skeleton className='h-[20px] w-[400px] ' />
                            <Skeleton className='h-[20px] w-[400px] ' />
                            <Skeleton className='h-[20px] w-[400px] ' />
                        </div>
                    }>

                        <Content id={id} />

                    </Suspense>
                </div>

            </div>
        </div>
    )
}

export default IdPage
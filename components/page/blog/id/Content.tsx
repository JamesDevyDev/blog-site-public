import { supabase } from "@/lib/supabase"
import { geologica, alegreyna } from "@/lib/fonts"

const Content = async ({ id }: { id: string }) => {

    const { data: blog, error } = await supabase
        .from('blogs')
        .select('title, content')
        .eq('id', id)
        .single()

    if (error || !blog) return <div>Blog not found.</div>

    return (
        <div className='flex flex-col gap-4'>
            <h1 className={`${geologica.className} text-4xl font-bold dark:text-white`}>
                {blog.title}
            </h1>

            <p className={`${alegreyna.className} text-gray-700 dark:text-gray-300 text-2xl leading-relaxed`}>
                {blog.content}
            </p>
        </div>

    )
}

export default Content

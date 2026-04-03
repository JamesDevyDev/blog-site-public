import { supabase } from "@/lib/supabase"
import { unstable_noStore as noStore } from "next/cache"

const PhotosComponent = async () => {
    noStore()

    const { data: photos } = await supabase
        .from("photos")
        .select("id, url, created_at")
        .order("created_at", { ascending: false })

    return (
        <div className="columns-2 gap-3">
            {photos?.map((photo) => (
                <div
                    key={photo.id}
                    className="break-inside-avoid mb-3 overflow-hidden rounded-xl relative group active:scale-[0.98] transition-transform duration-150"
                >
                    <img
                        src={photo.url}
                        alt={`Photo ${photo.id}`}
                        className="w-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105 group-active:blur-sm group-active:scale-105"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300">
                        <span className="bg-white/40 dark:bg-black/40 rounded-sm p-2 text-sm font-medium drop-shadow-lg">
                            {new Date(photo.created_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </span>
                        <div className=' h-[100%] w-[100%] absolute '></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PhotosComponent
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { Pencil, Trash2, X, Check, ThumbsUp, ThumbsDown } from "lucide-react"

type Blog = {
    id: string
    title: string
    type: string
    content: string
    created_at: string
}

type Photo = {
    id: number
    url: string
}

type Reaction = {
    id: number
    value: string
    created_at: string
}

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState<"blog" | "photo" | "reactions">("blog")

    // Blog state
    const [title, setTitle] = useState("")
    const [type, setType] = useState("")
    const [content, setContent] = useState("")
    const [blogLoading, setBlogLoading] = useState(false)

    // Blog list
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editData, setEditData] = useState<Partial<Blog>>({})

    // Photo state
    const [photo, setPhoto] = useState<File | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const [photoLoading, setPhotoLoading] = useState(false)
    const [photos, setPhotos] = useState<Photo[]>([])
    const [uploadError, setUploadError] = useState<string | null>(null)
    const [uploadSuccess, setUploadSuccess] = useState(false)

    // Reaction state
    const [likes, setLikes] = useState<Reaction[]>([])
    const [dislikes, setDislikes] = useState<Reaction[]>([])
    const [likeInput, setLikeInput] = useState("")
    const [dislikeInput, setDislikeInput] = useState("")
    const [editingReactionId, setEditingReactionId] = useState<number | null>(null)
    const [editingReactionTable, setEditingReactionTable] = useState<"likes" | "dislikes" | null>(null)
    const [editingReactionValue, setEditingReactionValue] = useState("")

    const fetchBlogs = async () => {
        const { data } = await supabase
            .from("blogs")
            .select("id, title, type, content, created_at")
            .order("created_at", { ascending: false })
        if (data) setBlogs(data)
    }

    const fetchPhotos = async () => {
        const { data } = await supabase
            .from("photos")
            .select("id, url")
            .order("created_at", { ascending: false })
        if (data) setPhotos(data)
    }

    const fetchReactions = async () => {
        const [{ data: likesData }, { data: dislikesData }] = await Promise.all([
            supabase.from("likes").select("id, value, created_at").order("created_at", { ascending: false }),
            supabase.from("dislikes").select("id, value, created_at").order("created_at", { ascending: false }),
        ])
        if (likesData) setLikes(likesData)
        if (dislikesData) setDislikes(dislikesData)
    }

    useEffect(() => {
        fetchBlogs()
        fetchPhotos()
        fetchReactions()
    }, [])

    const handleBlogSubmit = async () => {
        if (!title || !type || !content) return
        setBlogLoading(true)
        await supabase.from("blogs").insert({ title, type, content })
        setTitle(""); setType(""); setContent("")
        await fetchBlogs()
        setBlogLoading(false)
    }

    const handleDelete = async (id: string) => {
        await supabase.from("blogs").delete().eq("id", id)
        setBlogs((prev) => prev.filter((b) => b.id !== id))
    }

    const handleEditSave = async (id: string) => {
        await supabase.from("blogs").update(editData).eq("id", id)
        setEditingId(null)
        setEditData({})
        await fetchBlogs()
    }

    const handlePhotoDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files[0]
        if (file && file.type.startsWith("image/")) setPhoto(file)
    }

    const handlePhotoSubmit = async () => {
        if (!photo) return
        setPhotoLoading(true)
        setUploadError(null)
        setUploadSuccess(false)

        try {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
            const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

            if (!cloudName || !uploadPreset) {
                setUploadError("Missing Cloudinary config. Check your .env.local file.")
                setPhotoLoading(false)
                return
            }

            const formData = new FormData()
            formData.append("file", photo)
            formData.append("upload_preset", uploadPreset)
            formData.append("cloud_name", cloudName)

            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                { method: "POST", body: formData }
            )
            const cloudData = await res.json()

            if (cloudData.error) {
                setUploadError(`Cloudinary error: ${cloudData.error.message}`)
                setPhotoLoading(false)
                return
            }

            if (!cloudData.secure_url) {
                setUploadError("Upload succeeded but no URL was returned.")
                setPhotoLoading(false)
                return
            }

            const { error: supabaseError } = await supabase
                .from("photos")
                .insert({ url: cloudData.secure_url })

            if (supabaseError) {
                setUploadError(`Supabase error: ${supabaseError.message}`)
                setPhotoLoading(false)
                return
            }

            await fetchPhotos()
            setPhoto(null)
            setUploadSuccess(true)
            setTimeout(() => setUploadSuccess(false), 3000)
        } catch (err: any) {
            setUploadError(`Unexpected error: ${err?.message ?? "Unknown"}`)
        }

        setPhotoLoading(false)
    }

    const handlePhotoDelete = async (id: number) => {
        await supabase.from("photos").delete().eq("id", id)
        setPhotos((prev) => prev.filter((p) => p.id !== id))
    }

    const handleAddReaction = async (table: "likes" | "dislikes") => {
        const value = table === "likes" ? likeInput.trim() : dislikeInput.trim()
        if (!value) return
        await supabase.from(table).insert({ value })
        if (table === "likes") setLikeInput("")
        else setDislikeInput("")
        await fetchReactions()
    }

    const handleReactionDelete = async (table: "likes" | "dislikes", id: number) => {
        await supabase.from(table).delete().eq("id", id)
        if (table === "likes") setLikes((prev) => prev.filter((r) => r.id !== id))
        else setDislikes((prev) => prev.filter((r) => r.id !== id))
    }

    const handleReactionEditSave = async () => {
        if (!editingReactionId || !editingReactionTable || !editingReactionValue.trim()) return
        await supabase.from(editingReactionTable).update({ value: editingReactionValue.trim() }).eq("id", editingReactionId)
        setEditingReactionId(null)
        setEditingReactionTable(null)
        setEditingReactionValue("")
        await fetchReactions()
    }

    const ReactionTag = ({ r, table }: { r: Reaction, table: "likes" | "dislikes" }) => {
        const isEditing = editingReactionId === r.id && editingReactionTable === table
        const isLike = table === "likes"

        if (isEditing) {
            return (
                <div className="flex items-center gap-1.5">
                    <Input
                        value={editingReactionValue}
                        onChange={(e) => setEditingReactionValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleReactionEditSave()}
                        className="h-8 text-sm dark:bg-[#151718] dark:border-[#2a2d2e]"
                        autoFocus
                    />
                    <button onClick={handleReactionEditSave} className="text-green-400 hover:text-green-300 transition-colors cursor-pointer">
                        <Check className="w-4 h-4" />
                    </button>
                    <button onClick={() => { setEditingReactionId(null); setEditingReactionTable(null); setEditingReactionValue("") }} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            )
        }

        return (
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm border
                ${isLike
                    ? "bg-green-900/40 text-green-400 border-green-800"
                    : "bg-red-900/40 text-red-400 border-red-800"
                }`}
            >
                <span>{r.value}</span>
                <button
                    onClick={() => { setEditingReactionId(r.id); setEditingReactionTable(table); setEditingReactionValue(r.value) }}
                    className="hover:text-white transition-colors cursor-pointer"
                >
                    <Pencil className="w-3 h-3" />
                </button>
                <button
                    onClick={() => handleReactionDelete(table, r.id)}
                    className="hover:text-white transition-colors cursor-pointer"
                >
                    <X className="w-3 h-3" />
                </button>
            </div>
        )
    }

    return (
        <div className="bg-[#f0f2f4] dark:bg-[#151718] min-h-screen px-10">
            <div className="max-w-xl w-full mx-auto pt-10 flex flex-col gap-8 pb-16">

                <div>
                    <h1 className="text-2xl font-bold dark:text-white">Admin</h1>
                    <p className="text-sm text-gray-400 mt-1">Manage your content</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white dark:bg-[#1e2021] p-1 rounded-xl w-fit">
                    {(["blog", "photo", "reactions"] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-5 py-1.5 rounded-lg text-sm font-medium transition-all capitalize cursor-pointer
                                ${activeTab === tab
                                    ? "bg-black text-white dark:bg-white dark:text-black"
                                    : "text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Blog Tab */}
                {activeTab === "blog" && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4 bg-white dark:bg-[#1e2021] p-6 rounded-2xl">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">New Blog Post</h2>
                            <Input
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="dark:bg-[#151718] dark:border-[#2a2d2e]"
                            />
                            <Input
                                placeholder="Type (e.g. essay, note, update)"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="dark:bg-[#151718] dark:border-[#2a2d2e]"
                            />
                            <Textarea
                                placeholder="Content"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                rows={8}
                                className="dark:bg-[#151718] dark:border-[#2a2d2e] resize-none"
                            />
                            <Button
                                onClick={handleBlogSubmit}
                                disabled={blogLoading || !title || !type || !content}
                                className="w-full cursor-pointer"
                            >
                                {blogLoading ? "Posting..." : "Post Blog"}
                            </Button>
                        </div>

                        <div className="flex flex-col gap-3">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">All Posts</h2>
                            {blogs.length === 0 && <p className="text-sm text-gray-400">No posts yet.</p>}
                            {blogs.map((blog) => (
                                <div key={blog.id} className="bg-white dark:bg-[#1e2021] rounded-2xl p-4 flex flex-col gap-3">
                                    {editingId === blog.id ? (
                                        <div className="flex flex-col gap-3">
                                            <Input
                                                value={editData.title ?? blog.title}
                                                onChange={(e) => setEditData((p) => ({ ...p, title: e.target.value }))}
                                                className="dark:bg-[#151718] dark:border-[#2a2d2e]"
                                            />
                                            <Input
                                                value={editData.type ?? blog.type}
                                                onChange={(e) => setEditData((p) => ({ ...p, type: e.target.value }))}
                                                className="dark:bg-[#151718] dark:border-[#2a2d2e]"
                                            />
                                            <Textarea
                                                value={editData.content ?? blog.content}
                                                onChange={(e) => setEditData((p) => ({ ...p, content: e.target.value }))}
                                                rows={5}
                                                className="dark:bg-[#151718] dark:border-[#2a2d2e] resize-none"
                                            />
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => handleEditSave(blog.id)} className="cursor-pointer">
                                                    <Check className="w-3.5 h-3.5 mr-1" /> Save
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => { setEditingId(null); setEditData({}) }} className="cursor-pointer">
                                                    <X className="w-3.5 h-3.5 mr-1" /> Cancel
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex flex-col gap-1 min-w-0">
                                                <p className="text-sm font-medium dark:text-white truncate">{blog.title}</p>
                                                <p className="text-xs text-gray-400 capitalize">{blog.type}</p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                <button
                                                    onClick={() => { setEditingId(blog.id); setEditData({}) }}
                                                    className="text-gray-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(blog.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Photo Tab */}
                {activeTab === "photo" && (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-4 bg-white dark:bg-[#1e2021] p-6 rounded-2xl">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">New Photo</h2>
                            <div
                                onDrop={handlePhotoDrop}
                                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                                onDragLeave={() => setDragOver(false)}
                                onClick={() => document.getElementById("photo-input")?.click()}
                                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
                                    ${dragOver
                                        ? "border-black dark:border-white bg-gray-50 dark:bg-[#151718]"
                                        : "border-gray-200 dark:border-[#2a2d2e] hover:border-gray-400 dark:hover:border-gray-500"
                                    }`}
                            >
                                {photo ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <img src={URL.createObjectURL(photo)} className="max-h-[200px] rounded-lg object-cover" />
                                        <p className="text-xs text-gray-400">{photo.name}</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2">
                                        <p className="text-sm text-gray-400">Drop a photo here</p>
                                        <p className="text-xs text-gray-300 dark:text-gray-600">or click to browse</p>
                                    </div>
                                )}
                            </div>
                            <input
                                id="photo-input"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) setPhoto(file)
                                }}
                            />
                            <Button
                                onClick={handlePhotoSubmit}
                                disabled={photoLoading || !photo}
                                className="w-full cursor-pointer"
                            >
                                {photoLoading ? "Uploading..." : "Upload Photo"}
                            </Button>
                            {uploadError && <p className="text-sm text-red-500 text-center">{uploadError}</p>}
                            {uploadSuccess && <p className="text-sm text-green-500 text-center">Photo uploaded successfully!</p>}
                        </div>

                        <div className="flex flex-col gap-3">
                            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">All Photos</h2>
                            {photos.length === 0 && <p className="text-sm text-gray-400">No photos yet.</p>}
                            <div className="columns-2 gap-3">
                                {photos.map((p) => (
                                    <div key={p.id} className="break-inside-avoid mb-3 relative group overflow-hidden rounded-xl">
                                        <img src={p.url} className="w-full object-cover" />
                                        <button
                                            onClick={() => handlePhotoDelete(p.id)}
                                            className="absolute top-2 right-2 bg-black/60 hover:bg-red-500 text-white rounded-full p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all cursor-pointer"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Reactions Tab */}
                {activeTab === "reactions" && (
                    <div className="flex flex-col gap-6">

                        {/* Likes */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <ThumbsUp className="w-4 h-4 text-green-500" />
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                                    Likes <span className="text-green-500">{likes.length}</span>
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g. Programming"
                                    value={likeInput}
                                    onChange={(e) => setLikeInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddReaction("likes")}
                                    className="dark:bg-[#151718] dark:border-[#2a2d2e]"
                                />
                                <Button onClick={() => handleAddReaction("likes")} disabled={!likeInput.trim()} className="cursor-pointer shrink-0">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {likes.length === 0 && <p className="text-sm text-gray-400">No likes yet.</p>}
                                {likes.map((r) => <ReactionTag key={r.id} r={r} table="likes" />)}
                            </div>
                        </div>

                        {/* Dislikes */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <ThumbsDown className="w-4 h-4 text-red-500" />
                                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
                                    Dislikes <span className="text-red-500">{dislikes.length}</span>
                                </h2>
                            </div>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="e.g. Ads"
                                    value={dislikeInput}
                                    onChange={(e) => setDislikeInput(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleAddReaction("dislikes")}
                                    className="dark:bg-[#151718] dark:border-[#2a2d2e]"
                                />
                                <Button onClick={() => handleAddReaction("dislikes")} disabled={!dislikeInput.trim()} variant="destructive" className="cursor-pointer shrink-0">
                                    Add
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {dislikes.length === 0 && <p className="text-sm text-gray-400">No dislikes yet.</p>}
                                {dislikes.map((r) => <ReactionTag key={r.id} r={r} table="dislikes" />)}
                            </div>
                        </div>

                    </div>
                )}

            </div>
        </div>
    )
}

export default AdminPage
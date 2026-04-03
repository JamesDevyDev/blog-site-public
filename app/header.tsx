'use client'
import Link from "next/link"
import { ModeToggle } from "@/components/darkmode/lightmode"
import { Button } from "@/components/ui/button"
import { ChevronDown, Home } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navLinkClass = 'text-bg  hover:text-foreground hover:bg-muted rounded-sm px-3 py-2 text-sm font-medium transition-colors h-9 flex items-center'

const Header = () => {
    return (
        <div className='dark:bg-[#1a1d1e] bg-[#ffffff] w-full h-[65px] fixed top-0 left-0 border-b flex items-center px-10'>
            <div className='max-w-xl w-full mx-auto flex items-center justify-between'>

                <Link href='/' className='rounded-[100%]  flex items-center justify-center'>
                    <Button
                        className='rounded-[100%] cursor-pointer h-[40px] w-[40px] relative'
                        variant="outline"
                    >
                        <Home className='w-3.5 h-3.5' />
                    </Button>
                </Link>

                <div className='flex items-center h-[65px]'>
                    <Link href='/blog' className={navLinkClass}>Blog</Link>
                    <Link href='/about' className={navLinkClass}>About</Link>

                    <div className="relative flex items-center ">
                        <DropdownMenu modal={false}>
                            <DropdownMenuTrigger className={`${navLinkClass} gap-1 outline-none shrink-0 cursor-pointer`}>
                                More
                                <ChevronDown className="h-3.5 w-3.5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                    <Link href='/photos'><DropdownMenuItem className='cursor-pointer py-2 px-4'>Photos</DropdownMenuItem></Link>
                                </DropdownMenuGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <ModeToggle />

            </div>
        </div>
    )
}

export default Header
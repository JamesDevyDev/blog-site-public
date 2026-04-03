import { FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'
import Link from 'next/link'

const Footer = () => {
    return (
        <div className='bg-[#f0f2f4] dark:bg-[#151718] h-[65px] flex items-center px-4 justify-center'>

            <div className='max-w-xl w-full mx-auto flex items-center justify-between '>

                <Link href='https://jamestalamo.com' className='text-gray-700 dark:text-gray-300 text-sm font-medium'>jamestalamo.com</Link>

                <div className='flex items-center gap-4'>
                    <a href='https://instagram.com/jamesx4rr' className='text-muted-foreground hover:text-foreground transition-colors'>
                        <FaInstagram className='w-4 h-4' />
                    </a>
                    <a href='https://www.linkedin.com/in/jamestalamo/' className='text-muted-foreground hover:text-foreground transition-colors'>
                        <FaLinkedin className='w-4 h-4' />
                    </a>

                    <a href='https://github.com/jamesdevydev' className='text-muted-foreground hover:text-foreground transition-colors'>
                        <FaGithub className='w-4 h-4' />
                    </a>

                </div>

                <div className='text-gray-700 dark:text-gray-300 text-sm font-medium'>
                    {new Date().getFullYear()}
                </div>

            </div>
        </div>
    )
}

export default Footer
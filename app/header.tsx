const Header = () => {
    return (
        <div className='w-[100%] h-[65px] bg-[#1a1d1e] fixed top-0 left-0 border-b border-[#9ba1a6]/30 flex items-center px-6'>
            <div className='max-w-2xl w-full mx-auto flex items-center justify-between'>
                {/* Logo */}
                <div className='bg-[#2a2d2e] w-[40px] h-[40px] rounded-[100%]'>
                    
                </div>

                {/* Nav Links */}
                <div className='flex gap-6'>
                    <a href='#' className='text-[#9ba1a6] hover:text-white text-sm'>Home</a>
                    <a href='#' className='text-[#9ba1a6] hover:text-white text-sm'>About</a>
                    <a href='#' className='text-[#9ba1a6] hover:text-white text-sm'>Contact</a>
                </div>

                <div className='bg-[#2a2d2e] hover:bg-[#fff] w-[40px] h-[40px] rounded-[100%] cursor-pointer'>

                </div>
            </div>
        </div>
    )
}

export default Header
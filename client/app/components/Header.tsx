'use client'
import React, {FC, useState} from 'react'

type Props = {
    open: boolean,
    setOpen: (value: boolean) => void,
    activeItem: number,
}

const Header:FC<Props> = (props) => {
    const [active, setActive] = useState(false);
    const [opneSidebar, setOpneSidebar] = useState(false);
    return (
        <div className='w-full relative'>
            {/* <div
                className={`${
                    active ? 'dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500'
                        : 'w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow'
                }`}
            >
            </div> */}
        </div>
    );
};

export default Header;
import React, {useState} from 'react';

const CheckIcon= () => {
    const [isHovered, setIsHovered] = useState(false);

    return(
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className='border-2 cursor-pointer hover:bg-[#375A28] rounded-md border-[#375A28]'>
        <svg className='p-0 w-[1.53rem] flex items-center text-center box-border justify-center' viewBox="0 -8 72 72" xmlns="http://www.w3.org/2000/svg">
        <g>
        {isHovered ? (
                <>
            <path fill="#3E3F40" d="M61.07,12.9,57,8.84a2.93,2.93,0,0,0-4.21,0L28.91,32.73,19.2,23A3,3,0,0,0,15,23l-4.06,4.07a2.93,2.93,0,0,0,0,4.21L26.81,47.16a2.84,2.84,0,0,0,2.1.89A2.87,2.87,0,0,0,31,47.16l30.05-30a2.93,2.93,0,0,0,0-4.21Z"/>
        </>
      ) : (
        <>
            <path fill="#375A28" d="M61.07,12.9,57,8.84a2.93,2.93,0,0,0-4.21,0L28.91,32.73,19.2,23A3,3,0,0,0,15,23l-4.06,4.07a2.93,2.93,0,0,0,0,4.21L26.81,47.16a2.84,2.84,0,0,0,2.1.89A2.87,2.87,0,0,0,31,47.16l30.05-30a2.93,2.93,0,0,0,0-4.21Z"/>
        </>
      )}
    
        </g>
    </svg>       
      </div>
    
    )
}

export default CheckIcon;

import {useState} from 'react';



const BackIcon = () => {
    const [isHovered, setIsHovered] = useState(false);

    return(
        <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className='border-2 box-border cursor-pointer hover:bg-[#969696] rounded-md border-[#969696]'>
        <g>
        {isHovered ? (
                <>
            <svg className="p-0 w-[1.53rem] flex items-center text-center box-border justify-center" viewBox="0 0 2050 2050" data-name="Layer 3" id="Layer_3" xmlns="http://www.w3.org/2000/svg"><defs></defs><title/><path fill='#3E3F40' d="M1582.2,1488.7a44.9,44.9,0,0,1-36.4-18.5l-75.7-103.9A431.7,431.7,0,0,0,1121.4,1189h-60.1v64c0,59.8-33.5,112.9-87.5,138.6a152.1,152.1,0,0,1-162.7-19.4l-331.5-269a153.5,153.5,0,0,1,0-238.4l331.5-269a152.1,152.1,0,0,1,162.7-19.4c54,25.7,87.5,78.8,87.5,138.6v98.3l161,19.6a460.9,460.9,0,0,1,404.9,457.4v153.4a45,45,0,0,1-45,45Z"/></svg>
        </>
      ) : (
        <>
            <svg className="p-0 w-[1.53rem] flex items-center text-center box-border justify-center" viewBox="0 0 2050 2050" data-name="Layer 3" id="Layer_3" xmlns="http://www.w3.org/2000/svg"><defs></defs><title/><path fill='#969696' d="M1582.2,1488.7a44.9,44.9,0,0,1-36.4-18.5l-75.7-103.9A431.7,431.7,0,0,0,1121.4,1189h-60.1v64c0,59.8-33.5,112.9-87.5,138.6a152.1,152.1,0,0,1-162.7-19.4l-331.5-269a153.5,153.5,0,0,1,0-238.4l331.5-269a152.1,152.1,0,0,1,162.7-19.4c54,25.7,87.5,78.8,87.5,138.6v98.3l161,19.6a460.9,460.9,0,0,1,404.9,457.4v153.4a45,45,0,0,1-45,45Z"/></svg>
        </>
      )}
    
        </g>   
      </div>
    
    )
}

export default BackIcon;
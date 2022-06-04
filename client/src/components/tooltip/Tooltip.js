import "./Tooltip.scss";
import React, { useEffect, useState } from 'react'

function Tooltip(props) {
    const [isMouseInside,setIsMouseInside] = useState(false);

    useEffect(() => {

    },[])

    const onHover = () => {
        if(!isMouseInside){
            setIsMouseInside(true);
        }
       
    }

    const onLeave = () => {

        if(isMouseInside){
            setIsMouseInside(false);
        }
        
    }

  return (
    <div className="tooltip-wrapper">
        <div className={isMouseInside ? "tooltip-active" : "tooltip"}>
           <div className="tooltip-text">
               {props.text}
           </div>
        </div>
        <div className="tooltip-content"  onMouseEnter={onHover} onMouseLeave={onLeave}>
             {props.content}
        </div>
       
    </div>
  )
}

export default Tooltip
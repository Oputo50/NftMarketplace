import React, { useEffect } from 'react';
import "./Loader.css";

function Loader(props) {

    useEffect(() => {
    
    },[props.isActive])

  return (
      <div className={props.isActive ? 'loaderWrapper-active' : 'loaderWrapper'}>
             <div className='lds-hourglass loader'></div>
             <div><h1 style={{'color':'black'}}>{props.message}</h1></div>
      </div>

  )
}

export default Loader
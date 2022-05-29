import React, { useEffect } from 'react';
import "./Loader.css";

function Loader(props) {

    useEffect(() => {
        console.log("hey loader",props.isActive);

    },[props.isActive])

  return (
      <div className={props.isActive ? 'loaderWrapper-active' : 'loaderWrapper'}>
             <div className='lds-hourglass loader'></div>7
             <div><h1 style={{'color':'black'}}>Loading ...</h1></div>
      </div>

  )
}

export default Loader
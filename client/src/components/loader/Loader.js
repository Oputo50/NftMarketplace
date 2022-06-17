import React, { useEffect } from 'react';
import "./Loader.css";

function Loader(props) {

    useEffect(() => {
    
    },[props.isActive])

  return (
      <div className={props.isActive ? 'loaderWrapper-active' : 'loaderWrapper'}>
             <div className='lds-hourglass loader'></div>
             <div><h1 style={{'color':'black'}}>{props.message}</h1></div>
             {props.isTransaction && <div><h4 style={{'color':'black'}}>If you see Metamask's transaction confirmation and loader doesn't stop, please refresh the screen.</h4></div>}
      </div>

  )
}

export default Loader
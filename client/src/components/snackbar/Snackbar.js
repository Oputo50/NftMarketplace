import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import "./Snackbar.css";
import ReactDOM from "react-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function Snackbar(props) {
    const [closeTimeout, setCloseTimeout] = useState(null);

    useEffect(() => {
        beginCloseTimeout();
    },[]);


    const closeSnackBar = () => {
        clearTimeout(closeTimeout);
        ReactDOM.unmountComponentAtNode(document.getElementById('snackbar-fixed-container'));
    }


    const beginCloseTimeout = () => {
        if (props.timer) {
            const timeout = setTimeout(() => closeSnackBar(), props.timer);
            setCloseTimeout(timeout);
        }
    }

  return (
    <div className={`snackbar-container ${props.messageType}-container`}
            onMouseEnter={() => clearTimeout(closeTimeout)}
            onMouseLeave={() => beginCloseTimeout()}>
            <div>
                <div className="snackbar-info-container">
                    <div>
                        <div className={`snackbar-icon ${props.messageType}-snackbar-icon`}></div>
                    </div>
                    <div>
                        <h5 className="rubik-text">{props.title}</h5>
                        <h5 className="muted-rubik-text">  {props.message}</h5>
                    </div>
                </div>
                <div className='exit-icon'>
                    <FontAwesomeIcon onClick={() => closeSnackBar()} icon={faTimes} size={"1x"} color={"black"} id="close-snackbar-icon" />
                </div>
            </div>
        </div>
  )
}

export default Snackbar
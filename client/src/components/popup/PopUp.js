import React, { useEffect, useState, useRef } from "react";
import './PopUp.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";


const PopUp = (props) => {
  const wrapperRef = useRef(null);
  const [open,setOpen] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target) && open && event.target.className !== "loaderWrapper-active") {
        console.log(props.isLoading);
        setOpen(false);
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);


  return (
    <div className="popup" >

      <div ref={wrapperRef}>
        <button onClick={() => setOpen(!open)}> {props.buttonLabel} </button>
        {open && (
          <>
            <div className="popup-content">
              <div className="exit">
                <FontAwesomeIcon className="icon" onClick={() => setOpen(false)} icon={faTimes} size={"2x"}  />
              </div>
              {props.content}
            </div>

          </>
        )}
      </div>
    </div>
  )
}

export default PopUp;
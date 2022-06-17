import React, { useEffect, useState, useRef } from "react";
import './PopUp.scss';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const PopUp = (props) => {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [Child, setChild] = useState();

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

  useEffect(() => {

    setChild(React.cloneElement(props.content, { openModal: setOpen }))

  }, [props.content])

  return (
    <div className="popup" >

      <div ref={wrapperRef}>
        <button onClick={() => setOpen(!open)}> {props.buttonLabel} </button>
        {open && (
          <>
            <div className="popup-content">
              <div id='exit' className="exit">
                <FontAwesomeIcon className="icon" onClick={() => setOpen(false)} icon={faTimes} size={"2x"} />
              </div>
              {Child}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PopUp;
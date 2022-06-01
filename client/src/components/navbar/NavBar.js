import React, { useState } from 'react';
import {Link} from "react-router-dom";
import "./NavBar.scss";
import {SidebarData} from "./NavBarData";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTimes, faAlignJustify} from "@fortawesome/free-solid-svg-icons"

function NavBar() {
    const [sidebar,setSidebar] = useState(false);

    const showSidebar = (event) => {
      setSidebar(!sidebar);
    }


    return (
      <>
       <div className = {sidebar ? "sidebar-active" : "sidebar"}>
       <div className="header">
              <FontAwesomeIcon onClick={showSidebar} icon={faTimes}></FontAwesomeIcon>
        </div>
        <ul className="sidebarList">
          {SidebarData.map((obj,key)=>{
            return (
              
              <Link to={obj.link} key={key}>
              <li className="row" key={key}>
                <div key={key}>
                  <span className="sideBarFont">{obj.title}</span>
                <div className="listIcon"> {obj.icon} </div>
                </div>
              </li>
              </Link>
            )
          })

          }
        </ul>
      </div>
      <div style={{'textAlign':'left'}}>
        <FontAwesomeIcon onClick={showSidebar} icon={faAlignJustify} className = {sidebar ? "menuIcon-hidden" : "menuIcon"}></FontAwesomeIcon>
      </div>
      </>
    );
   
};

export default NavBar;
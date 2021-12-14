import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHome, faHammer, faIcons} from "@fortawesome/free-solid-svg-icons"
import "./NavBar.css";

export const SidebarData =  [
  {
      title: "Home",
      icon: <FontAwesomeIcon icon={faHome}/>,
      link: "/home"
  },
  {
    title: "Mint",
    icon: <FontAwesomeIcon icon={faHammer}/>,
    link: "/mint"
  },
  {
    title: "My Nfts",
    icon: <FontAwesomeIcon icon={faIcons}/>,
    link: "/myNfts"
  }
];


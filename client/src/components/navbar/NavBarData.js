import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faHome, faHammer, faWallet, faShop} from "@fortawesome/free-solid-svg-icons"

export const SidebarData =  [
  {
      title: "Home",
      icon: <FontAwesomeIcon icon={faHome}/>,
      link: "/"
  },
  {
    title: "Mint",
    icon: <FontAwesomeIcon icon={faHammer}/>,
    link: "/mint"
  },
  {
    title: "My Nfts",
    icon: <FontAwesomeIcon icon={faWallet}/>,
    link: "/myNfts"
  },
  {
    title: "Marketplace",
    icon: <FontAwesomeIcon icon={faShop}/>,
    link: "/marketplace"
  }
];


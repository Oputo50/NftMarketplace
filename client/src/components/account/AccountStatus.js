import React, { useEffect, Component, useState } from 'react';
import { ethers } from 'ethers';
import './AccountStatus.scss';

const AccountStatus = (props) => {

    const [isConnected, setIsConnected] = useState(false);
    const [connectedAcc, setconnectedAcc] = useState('');

    useEffect(() => {
        setIsConnected(props.isConnected);
        if (props.isConnected) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            signer.getAddress().then(function (res) {
                setconnectedAcc(res);
            })
        }
    }, [])


    return (
        <div className='accountStatus'>
            <span>{connectedAcc}</span>
        </div>
    )
}

export default AccountStatus
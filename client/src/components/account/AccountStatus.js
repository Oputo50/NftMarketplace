import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import './AccountStatus.scss';

const AccountStatus = (props) => {

    const [connectedAcc, setconnectedAcc] = useState('');

    useEffect(() => {
        if (props.isConnected) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            signer.getAddress().then(function (res) {
                setconnectedAcc(res);
            })
        }
    }, [props.isConnected])


    return (
        <div id='accountStatus' className='accountStatus'>
            <span>{connectedAcc}</span>
        </div>
    )
}

export default AccountStatus
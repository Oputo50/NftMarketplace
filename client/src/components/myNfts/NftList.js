import React, { useState, useEffect } from "react";
import MyTokenContract from "../../contracts/MyToken.json";
import { ethers } from "ethers";
import PopUp from "../popup/SendNft";


const List = (props) => {

    const [nftData, setNftData] = useState();

    useEffect(() => {

        listNfts()

    }, [])


    const listNfts = async () => {
        let nftIds = [];

        let nftObjects = [];

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        const signer = provider.getSigner();

        var myNftContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, signer);

        try {
            //fetches the ids of the owned Nfts
            await myNftContract.connect(signer).getOwnedNfts().then(function (result) {
                for (let i = 0; i < result.length; i++) {
                    nftIds.push(result[i].toNumber());
                }
            })
            //builds Objects with token's metadata
            buildNftObjects(nftIds).then(function (res) {
                nftObjects = res;
                setNftData(res)
            })


        } catch (err) {
            console.log(err);
            console.log("deu merda")
        }


    }

    const buildNftObjects = async (nftIds) => {
        let nftObjects = [];

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        const signer = provider.getSigner();

        var myNftContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, signer);

        try {
            for (let i = 0; i <= nftIds.length; i++) {
                //gets all token's URIs to append to pinata's gateway url in order to fetch the token's metadata
                await myNftContract.connect(signer).tokenURI(nftIds[i]).then(function (result) {
                    fetch("https://gateway.pinata.cloud/" + result).then(function (response) {
                        response.json().then(function (res) {
                            nftObjects.push(res)
                        });
                    });

                })

            }
        } catch (error) {
            console.log(error);
        }


        return nftObjects;
    }



    return (
        <div className="App">
            {nftData && (
                <div>
                    <ul className="list-group">
                        {
                            nftData.map((nft, index) => (
                                <li key={index} className="list-group-item list-group-item-action">
                                    <div>
                                        <p>{nft.name}</p>
                                        <PopUp tokenAddress={props.tokenAddress}></PopUp>
                                        <img src={"https://gateway.pinata.cloud/ipfs/" + nft.hash}></img>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                </div>

            )}
        </div>

    )


}

export default List;


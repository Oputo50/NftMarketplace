import React, {useState, useEffect} from "react";
import MyTokenContract from "C:/Users/pedro/OneDrive/Ambiente de Trabalho/NftCreator/Editor/client/src/contracts/MyToken.json";
import {ethers} from "ethers";
import PopUp from "./PopUp";


const List = (props) => {

    const [nftData,setNftData] = useState();

    useEffect (() => {

        listNfts()
    
      
    },[])


    const listNfts = async () => {
        let nftIds = [];

        let nftObjects = [];

       

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        const signer = provider.getSigner();

        var myNftContract = new ethers.Contract(props.tokenAddress,MyTokenContract.abi,signer);

        try{
           await myNftContract.connect(signer).getOwnedNfts().then(function(result){
                for(let i = 0; i < result.length; i++){
                   nftIds.push(result[i].toNumber());
                }
            })

          buildNftObjects(nftIds).then(function(res){
              console.log("nfts objects: " + res);
              nftObjects = res;

              console.log("returning: " + nftObjects);

             setNftData(res)
          })


        } catch(err){
           console.log(err);
           console.log("deu merda")
        }
      
       
    }

    const buildNftObjects = async (nftIds) => {
        let nftObjects = [];

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        const signer = provider.getSigner();

        var myNftContract = new ethers.Contract(props.tokenAddress,MyTokenContract.abi,signer);

        try {
            for(let i = 0; i <= nftIds.length; i++) {

                await myNftContract.connect(signer).tokenURI(nftIds[i]).then(function(result){
                    console.log("TOKEN URI: " + result);
                    fetch("https://gateway.pinata.cloud/"+result).then(function(response){

                    const nftMetadata = response.json().then(function(res){
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


        
    return(
        <div className ="App">
            {nftData && (
                 <div>
                <ul className="list-group">
                {
                 nftData.map((nft,index)=> (
              
                 <li key={index} className="list-group-item list-group-item-action">
                  <div>
                  <p>{nft.name}</p>
                  <PopUp tokenAddress={props.tokenAddress}></PopUp>
                  <img src={"https://gateway.pinata.cloud/ipfs/"+nft.hash}></img>
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


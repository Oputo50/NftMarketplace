import React, {Component} from "react";
import MyTokenContract from "C:/Users/pedro/OneDrive/Ambiente de Trabalho/newDapp/Editor/client/src/contracts/MyToken.json";
import {ethers} from "ethers";
import { isCommunityResourcable } from "@ethersproject/providers";

export default class List extends Component{
       
    constructor(props){
        super(props);

        this.state = {
           nfts: [] ,
           tokenAddress: ""
        }
        
    }

    componentDidMount(){
        console.log("Component did mount: " + this.state.tokenAddress);
        this.setState({tokenAddress: this.props.tokenAddress})
        this.listNfts().then((res) => {
            console.log(res);
            this.setState({nfts: res})
        })
    }


    listNfts = async () => {
        let nftIds = [];

        const nftText = [];

        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

        var myNftContract = new ethers.Contract(this.props.tokenAddress,MyTokenContract.abi, provider);

        console.log("NFT: " + this.state.tokenAddress);

        try{
           await myNftContract.connect(provider).getOwnedNfts().then(function(result){
                for(let i = 0; i < result.length; i++){
                   nftIds.push(result[i].toNumber());
                }
            })
        
        } catch(err){
           console.log(err);
        }

        for(let i = 0; i < nftIds.length; i++){
            await myNftContract.connect(provider).getNftText(nftIds[i]).then(function(res){
               nftText.push(res.toString());
            }) 
        } 

        return nftText;
       
    }

    render() {
        console.log("list on render:  " + this.state.nfts);

        return(
            
           <ul>
                  {
                    this.state.nfts.map((text,index)=> (
                       <li key={index}>{text}</li>
                             ))
                  }
           </ul> 
        )
    }
    
}


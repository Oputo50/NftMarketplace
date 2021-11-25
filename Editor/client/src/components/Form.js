import React, {Component} from "react";
import MyTokenContract from "C:/Users/pedro/OneDrive/Ambiente de Trabalho/newDapp/Editor/client/src/contracts/MyToken.json";
import Web3 from "web3";


class Form extends Component {
    
    constructor(props){
        super(props);

        this.state = {
           text: "",
           account: ""
        }
    }
    
    mintNft = async (text) => {

        console.log("MINTING");
    
        const web3 = new Web3(window.ethereum);

        const accounts = await web3.eth.getAccounts();

        console.log(accounts[0]);
    
        var myContract = new web3.eth.Contract(MyTokenContract.abi,this.props.tokenAddress);
    
        await myContract.methods.mint(text).send({from: accounts[0], to: this.props.tokenAddress});

        console.log("Nft minted with text" + text);
    
        };

    handleTextChange = (event) => {
        this.setState({
            text: event.target.value
        })
    }

    handleSubmit = (event) => {
       this.mintNft(`${this.state.text}`);
       alert(`${this.state.text}`)
       event.preventDefault();
    }

    render() {
        const{text} = this.state;
        return(
            <form onSubmit={this.handleSubmit}>
                <div class="form-group">
                    <label>Type your NFT text here: </label>
                    <input type="text" class="form-control form-control-lg" value = {text} onChange={this.handleTextChange}></input>
                    <button type="submit">Submit</button>
                </div>
            </form>
        )
    }
}

export default Form
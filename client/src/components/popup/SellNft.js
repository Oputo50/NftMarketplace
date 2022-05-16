import React from 'react'

function SellNft() {
    const [open,setOpen] = useState(false);
    const [toAddress,setToAddress] = useState("");

    const handlePriceChange = (event) => {
        console.log(toAddress);
        setToAddress(event.target.value);
    }

    const sellNft = () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
        const signer = provider.getSigner();

        let marketplaceContract = new ethers.Contract(props.marketAddress, Marketplace.abi, provider);
        let myNftContract = new ethers.Contract(props.tokenAddress, MyTokenContract.abi, provider);
        myNftContract.connect(signer).approve(props.marketAddress, props.tokenId).then(function (res) {
            console.log(res);
            console.log("approving");
        })

        marketplaceContract.connect(signer).createMarketItem()

    }

    return (
        <div className='sellNft'>
            <button onClick={()=>setOpen(!open)}></button>

            {open && (
            <div className="sendNft-popUp">
                <div>
                    <h5>Please enter NFT Price</h5>
                    <input onChange={handlePriceChange} className="mt-3" type="number"></input>
                </div>
                <div className="sendNftDiv">
                <button onClick={sendNft} className="btn btn-primary btn-sm">Sell</button>
                <button onClick={()=>setOpen(false)} className="mt-1 btn btn-secondary btn-sm">Cancel</button>
                </div>
            </div>
        )}
        </div>
    )
}

export default SellNft
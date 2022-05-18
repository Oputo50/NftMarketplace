import React from 'react'

function MarketItem(props) {

  return (
    <div className='marketItem'>
        <div className="image">
          <h1>{props.hash}</h1>
        </div>
        <div className="info">
            <div className="left">

            </div>
            <div className="right">
                
            </div>
        </div>
    </div>
  )
}

export default MarketItem
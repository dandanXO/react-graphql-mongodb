import React from 'react';
import './spinner.css'

const spinner = props =>{
  return(
    <div className="spinner">
       <div className="lds-hourglass" />
    </div>
  )
}

export default spinner
import './Loader.css'
import React from 'react';

const Loader = ({text = "Loading..."}) => (
  <div className="animate-pulse">{text}</div>
);

export default Loader;

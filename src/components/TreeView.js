import './TreeView.css'
import React from 'react';
import ReactJson from 'react-json-view';

const TreeView = ({src}) => (
  <div className="tree-view">
    <ReactJson
      src={src}
      enableClipboard={false}
      collapsed={2}
    />
  </div>
);

export default TreeView;

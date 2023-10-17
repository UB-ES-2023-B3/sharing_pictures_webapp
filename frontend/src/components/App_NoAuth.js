
import UploadFloating_NoAuth from './UploadFloating_NoAuth.js';
import PinterestLayout_NoAuth from './PinterestLayout_NoAuth.js';
import '../../static/css/styles.css';
import React, { Component } from 'react';

export default class App_NoAuth extends Component {
  constructor(props) {
    super(props);
  }

  render() {
        return (
            <div>
                <PinterestLayout_NoAuth />
                <UploadFloating_NoAuth />
            </div>
        );
  }
}


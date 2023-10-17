import { ChakraProvider } from '@chakra-ui/react'
import PinterestLayout from './PinterestLayout.js';
import '../../static/css/styles.css';
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
function Home (){
  
    return (
        <div>
          <PinterestLayout />
        </div>
    );
  
}
export default Home;
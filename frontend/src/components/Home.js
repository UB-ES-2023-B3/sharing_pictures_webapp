import { ChakraProvider } from '@chakra-ui/react'
import PinterestLayout from './PinterestLayout.js';
import '../../static/css/styles.css';
import * as React from 'react'
import NavBar from './NavBar.js';
import { Component } from 'react';
import { render } from "react-dom";
function Home (){
  
    return (
      <ChakraProvider>
        <div>
          <NavBar />
        </div>
        <div>
          <PinterestLayout />
        </div>

      </ChakraProvider>
    );
  
}
export default Home;
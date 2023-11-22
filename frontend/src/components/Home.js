import { ChakraProvider } from '@chakra-ui/react'
import PinterestLayout from './PinterestLayout.js';
import '../../static/css/styles.css';
import * as React from 'react'
import { Component } from 'react';
import { render } from "react-dom";
import UploadFloating from './UploadFloating.js';
import SearchBar from './SearchBar.js';
import NavBar from './NavBar.js';
function Home (){
  
    return (
     
        
        <div>
          <ChakraProvider>
          <NavBar />
          <PinterestLayout />
          <UploadFloating />
          </ChakraProvider>
        </div>

      
    );
  
}
export default Home;
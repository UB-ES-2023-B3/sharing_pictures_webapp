import { ChakraProvider } from '@chakra-ui/react'
import PinterestLayout_NoAuth from './PinterestLayout_NoAuth.js';
import '../../static/css/styles.css';
import * as React from 'react';
import NavBar_NoAuth from './NavBar_NoAuth.js';
import UploadFloating_NoAuth from './UploadFloating_NoAuth.js';
function Home_NoAuth() {

    return (


        <div>
            <ChakraProvider>
            <NavBar_NoAuth />
            <PinterestLayout_NoAuth />
            <UploadFloating_NoAuth />
            </ChakraProvider>
        </div>


    );

}
export default Home_NoAuth;
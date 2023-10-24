import { ChakraProvider } from '@chakra-ui/react'
import PinterestLayout_NoAuth from './PinterestLayout_NoAuth.js';
import '../../static/css/styles.css';
import * as React from 'react'


import UploadFloating_NoAuth from './UploadFloating_NoAuth.js';
function Home_NoAuth (){
  
    return (
     
       
        <div>
            
          <PinterestLayout_NoAuth />
          <UploadFloating_NoAuth />
         
        </div>

      
    );
  
}
export default Home_NoAuth;
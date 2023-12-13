import React from 'react';
import {
    Button,
    ButtonGroup,
    Menu,
    MenuButton,
    Flex,
    Spacer,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider,
    Input,
    IconButton,
    Box,
    Avatar,
    Text
} from '@chakra-ui/react'
import { useState, useEffect } from 'react';
import styles from "../../static/css/navbar.css"

import { HamburgerIcon, SearchIcon, ChatIcon, BellIcon, AtSignIcon } from '@chakra-ui/icons'
import SearchBar from './SearchBar';
function NavBar() {

    const [inicio, setinicio] = useState(true);
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [explorar, setexplorar] = useState(false);
    const [userFetched,setUserFetched] = useState(false);
    const [username,setUsername]=useState("");
    const [email,setEmail]=useState("");
    const [logo, setLogo]=useState("");
    //useEffect(() => onChangeValue({alarm }), [alarm])

    const handleLogout = () => {
        fetch('/api/logout/')
          .then(response => {
            window.location.href="/";
          })
          .catch(error => {
            console.error('Error en la solicitud al backend:', error);
          });
      };
      const fetchUser = () => {
    
        // Fetch more posts from the API and append them to the existing posts
        fetch("/api/get_logged_in_user/")
          .then((response) => response.json())
          .then((data) => {
            setUsername(data.username);
            avatarprofile(data.username);
            setUserFetched(true);
          })
          .catch((error) => {
            console.error('Error loading more posts:', error);
          });
      };

      const avatarprofile = (user) => {
      
        fetch('/api/get_avatar/', {
        
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: user}),

        })
        .then((response) => response.json())
        .then((data) => {
          setEmail(data.email);
          setLogo(data.avatar);
        })
        .catch((error) => {
          console.error('Error loading more posts:', error);
        });
  
          
      }
      useEffect(() => {
        
        if(!userFetched){
          fetchUser();
        }
        
      }, []);
     
    return (
        <div>
            
            <Flex  width="full" align="center" justifyContent="center" position="relative">
                <div align="left" >
                    <a href="/"><img src="../media/logo/logo-removebg.png" width='100' // Cambiar el tamaño del logo
                        height='100' // Cambiar el tamaño del logo
                        style={{ borderRadius: '20%', overflow: 'hidden', transform: 'scale(1.5)'}} /></a>
                </div>
                <Spacer />
                <Box display="flex" alignItems="center" width="60%" justifyContent="space-between">
                    <SearchBar />
                </Box>
                <Spacer />
                <>
                    <a href={`/profile/${username}`}>
                    <Avatar name='Dan Abrahmov' size='sm' src={`../media/${logo}`}/>
                    </a>
                </>

                <Menu>
                    <MenuButton as={Button} borderRadius={30} variant='ghost' >
                        <MenuItem icon={<HamburgerIcon />}></MenuItem>
                    </MenuButton>
                    <MenuList>
                        <>
                            <MenuGroup title='Actually in' display='flex' flexDirection='row' alignItems='center'>
                                <Box display="flex" alignItems="center">
                                  <a href={`/profile/${username}`}>
                                    <Avatar size='lg' name='Kola Tioluwani' src={`../media/${logo}`}/>
                                    </a>
                                    <Box marginLeft='4'>
                                        <Text as='b'>{username}</Text>
                                        <Text>{email}</Text>
                                    </Box>
                                </Box>
                            </MenuGroup>
                            <MenuGroup title='More options'>
                              
                                <MenuItem borderRadius={15} onClick={handleLogout}>Log Out </MenuItem>
                            </MenuGroup>
                        </>
                    </MenuList>
                </Menu>

            </Flex>
            <hr style={{ margin: '0' }} />
        </div>
     


    );
}

export default NavBar;
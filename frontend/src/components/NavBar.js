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
    //useEffect(() => onChangeValue({alarm }), [alarm])

    const handleLogout = () => {
        fetch('/api/logout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Puedes incluir datos en el cuerpo si es necesario para el logout
          // body: JSON.stringify({}),
        })
          .then(response => {
            if (response.ok) {
              // Si la solicitud de logout fue exitosa, puedes realizar alguna acción adicional en el frontend
              console.log('Sesión cerrada exitosamente');
              // Ejemplo de redirección o actualización de la interfaz de usuario
              // window.location.href = '/'; // Redirige a la página principal después de cerrar sesión
            } else {
              console.error('Error al cerrar sesión');
            }
          })
          .catch(error => {
            console.error('Error en la solicitud al backend:', error);
          });
      };
    return (
        <div>
            
            <Flex  width="full" align="center" justifyContent="center" >
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

                    <Avatar name='Dan Abrahmov' size='sm' />
                </>

                <Menu>
                    <MenuButton as={Button} borderRadius={30} variant='ghost' >
                        <MenuItem icon={<HamburgerIcon />}></MenuItem>
                    </MenuButton>
                    <MenuList>
                        <>
                            <MenuGroup title='Actualmente en' display='flex' flexDirection='row' alignItems='center'>
                                <Box display="flex" alignItems="center">
                                    <Avatar size='lg' name='Kola Tioluwani' src='https://bit.ly/tioluwani-kolawole' />
                                    <Box marginLeft='4'>
                                        <Text as='b'>Name</Text>
                                        <Text>Type</Text>
                                        <Text>Email</Text>
                                    </Box>
                                </Box>
                            </MenuGroup>
                            <MenuGroup title='Mas opciones'>
                              
                                <MenuItem borderRadius={15} onClick={handleLogout}>Cerrar sessión </MenuItem>
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
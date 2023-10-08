
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
function NavBar() {

    const [inicio, setinicio] = useState(true);
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [explorar, setexplorar] = useState(false);
    //useEffect(() => onChangeValue({alarm }), [alarm])

    return (
        <div>
            <Flex width="full" align="center" justifyContent="center" padding={"10px"}>
                <div align="left">
                    <a href="/"><img width='100' height='100' /></a>
                </div>

                <Button borderRadius={30} variant='ghost' style={{ color: inicio ? "white" : "black", backgroundColor: inicio ? "black" : "white" }} onClick={() => { setinicio(!inicio), setexplorar(!explorar) }}>
                    Inicio
                </Button>
                <Button borderRadius={30} variant='ghost' style={{ color: explorar ? "white" : "black", backgroundColor: explorar ? "black" : "white" }} onClick={() => { setexplorar(!explorar), setinicio(!inicio) }}>
                    Explorar
                </Button>
                <Button borderRadius={30} variant='ghost'>
                    Crear
                </Button>

                <Box display="flex" alignItems="center" width="60%" borderRadius={30} boxShadow="lg" backgroundColor="#E6E6E6" justifyContent="space-between">
                    <Input marginLeft='5px' variant="unstyled" placeholder="Buscar" borderRadius={30} backgroundColor="#E6E6E6" width="90%" />
                    <IconButton aria-label="Search database" variant="ghost" borderRadius={30} icon={<SearchIcon />} />
                </Box>

                {isLoggedIn ? (
                    // Si el usuario está autenticado, mostrar los iconos
                    <>
                        <IconButton aria-label='Search database' size='lg' variant='ghost' borderRadius={30} icon={<BellIcon />} />
                        <IconButton aria-label='Search database' size='lg' variant='ghost' borderRadius={30} icon={<ChatIcon />} />
                        <Avatar name='Dan Abrahmov' size='sm' />
                    </>
                ) : (
                    // Si el usuario no está autenticado, mostrar los botones de Iniciar Sesión y Registrarse
                    <>
                        <Button borderRadius={30} variant='ghost'>
                            Iniciar Sesión
                        </Button>
                        <Button borderRadius={30} variant='ghost'>
                            Registrarse
                        </Button>
                    </>
                )}
                <Menu>
                    <MenuButton as={Button} borderRadius={30} variant='ghost' >
                        <MenuItem icon={<HamburgerIcon />}></MenuItem>
                    </MenuButton>
                    <MenuList>
                        {isLoggedIn ? (
                            // Si el usuario está autenticado, mostrar las opciones para usuarios autenticados
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

                                <MenuItem isDisabled style={{ margin: '10px 0', pointerEvents: 'none' }}></MenuItem> {/* Espacio vacío sin cursor interactivo */}
                                <MenuGroup title='Tus cuentas'>
                                    <MenuItem borderRadius={15}>Añadir cuentas</MenuItem>
                                    <MenuItem borderRadius={15}>Convertir en cuenta para empresas </MenuItem>
                                </MenuGroup>
                                <MenuItem isDisabled style={{ margin: '10px 0', pointerEvents: 'none' }}></MenuItem> {/* Espacio vacío sin cursor interactivo */}
                                <MenuGroup title='Mas opciones'>
                                    <MenuItem borderRadius={15}>Centro de denuncias e infracciones</MenuItem>
                                    <MenuItem borderRadius={15}>Ajuestes</MenuItem>
                                    <MenuItem borderRadius={15}>Optimiza tu feed de inicio</MenuItem>
                                    <MenuItem borderRadius={15}>Obtener ayuda</MenuItem>
                                    <MenuItem borderRadius={15}>Ver términos del servicio</MenuItem>
                                    <MenuItem borderRadius={15}>Ver Política de privacidad </MenuItem>
                                    <MenuItem borderRadius={15}>Cerrar sessión </MenuItem>
                                </MenuGroup>
                            </>
                        ) : (
                            // Si el usuario no está autenticado, mostrar las opciones para usuarios no autenticados
                            <>
                                <MenuGroup title='Cuentas'>
                                    <MenuItem borderRadius={15}>Iniciar Sesión</MenuItem>
                                    <MenuItem borderRadius={15}>Registrarse</MenuItem>
                                </MenuGroup>
                                <MenuItem isDisabled style={{ margin: '10px 0', pointerEvents: 'none' }}></MenuItem> {/* Espacio vacío sin cursor interactivo */}
                                <MenuGroup title='Mas opciones'>
                                    <MenuItem borderRadius={15}>Centro de denuncias e infracciones</MenuItem>
                                    <MenuItem borderRadius={15}>Ajuestes</MenuItem>
                                    <MenuItem borderRadius={15}>Obtener ayuda</MenuItem>
                                    <MenuItem borderRadius={15}>Ver términos del servicio</MenuItem>
                                    <MenuItem borderRadius={15}>Ver Política de privacidad </MenuItem>
                                </MenuGroup>
                            </>
                        )}
                    </MenuList>
                </Menu>

            </Flex>
        </div>


    );
}

export default NavBar;
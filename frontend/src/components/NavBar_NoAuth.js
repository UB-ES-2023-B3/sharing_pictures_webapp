
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
    const [hovered, setHovered] = useState(false);

    const [inicio, setinicio] = useState(true);
    const [isLoggedIn, setisLoggedIn] = useState(false);
    const [explorar, setexplorar] = useState(false);
    //useEffect(() => onChangeValue({alarm }), [alarm])

    return (
        <div>
            <Flex width="full" align="center" justifyContent="center" padding={"10px"}>
                <div align="left">
                    <a href="/"><img src="../media/logo/logo-removebg.png" width='100' height='100' /></a>
                </div>
                <Spacer />
                <Box display="flex" alignItems="center" width="60%" justifyContent="space-between">
                </Box>
                <>
                    <Box marginRight='2%'>
                        <a href="/login" >
                            <Button
                                borderRadius={30}
                                backgroundColor={hovered ? '#9A2E36' : 'red'}
                                opacity={hovered ? '80%' : '100%'}
                                color={hovered ? 'black' : 'white'}
                                variant='ghost'
                                onMouseEnter={() => setHovered(true)}
                                onMouseLeave={() => setHovered(false)}
                            >
                                Login
                            </Button>
                        </a>
                        <a href="/register">
                            <Button borderRadius={30} backgroundColor='#E6E6E6' variant='ghost'>
                                Register
                            </Button>
                        </a>
                    </Box>
                </>
            </Flex>
            <hr style={{ margin: '0' }} />
        </div>


    );
}

export default NavBar;
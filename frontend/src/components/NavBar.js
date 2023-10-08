
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


} from '@chakra-ui/react'

import styles from "../../static/css/navbar.css"

import {  HamburgerIcon} from '@chakra-ui/icons'
function NavBar() {

    return (
        <div>
            <Flex width="full" align="center" justifyContent="center" padding={"10px"} backgroundColor="#CDFCF6">
            <div align="left">
            <h1>SharingPictures</h1>
            </div>
            <Spacer />
            <Menu>
                <MenuButton as={Button} colorScheme='pink' variant='ghost' >
                    <MenuItem icon={<HamburgerIcon />}></MenuItem>
                </MenuButton>
                <MenuList>
                    <MenuGroup title='Profile'>
                        <MenuItem>My Account</MenuItem>
                        <MenuItem>Payments </MenuItem>
                    </MenuGroup>
                    <MenuDivider />
                    <MenuGroup title='Help'>
                        <MenuItem>Docs</MenuItem>
                        <MenuItem>FAQ</MenuItem>
                    </MenuGroup>
                </MenuList>
            </Menu>
            </Flex>
        </div>


    );
}

export default NavBar;
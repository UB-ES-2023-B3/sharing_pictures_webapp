import React, { useState, useRef } from 'react';
import ImageCard from './ImageCard';
import { Link } from 'react-router-dom'; // Importar Link
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Flex,
} from "@chakra-ui/react";

function Card(props) {
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [popOpen, setPopOpen] = useState(false);
  const imageRef = useRef(null);
  const originalOpacity = isMouseOver ? 0.1 : 1;

  var typeCard = "small";
  if (props.size > 250000) {
    typeCard = "large";
  } else if (props.size < 250000 && props.size > 100000) {
    typeCard = "medium";
  }

  const handleClick = () => {
    setPopOpen(true);
  };

  const handleClosePopover = () => {
    setPopOpen(false);
    // Enfocar nuevamente la imagen al cerrar el popover
    if (imageRef.current) {
      imageRef.current.style.opacity = originalOpacity;
      imageRef.current.focus();
    }
  };

  return (
    <div
    onClick={() => handleClick()}
      onMouseEnter={() => setIsMouseOver(true)}
      onMouseLeave={() => setIsMouseOver(false)}
      ref={imageRef}
      tabIndex={0}
      style={{
        ...styles.card,
        ...styles[typeCard],
        backgroundImage: `url(${props.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: originalOpacity,
        transition: 'opacity 0.5s',
      }}
    >
      <div onClick={() => handleClick()}>
        {/* Your image card content */}
      </div>
      <Modal isOpen={popOpen} onClose={handleClosePopover} initialFocusRef={undefined} size="md" placement="top">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box mt={4}>
              <Flex direction="column" align="center">
                <Box mb={4}>
                  <p style={{ textAlign: 'center' }}>Please log in or register to visualize the image</p>
                </Box>
                <Flex>
                  {/* Usar Link para redirigir */}
                  <Link to="/login">
                    <Button
                      size="lg"
                      colorScheme="red"
                      width="auto"
                      mr={2}
                    >
                      Login
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="lg"
                      colorScheme="red"
                      width="auto"
                    >
                      Register
                    </Button>
                  </Link>
                </Flex>
              </Flex>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

const styles = {
  card: {
    margin: '15px 10px',
    padding: 0,
    borderRadius: '16px',
    backgroundColor: 'red',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  small: {
    gridRowEnd: 'span 26',
  },
  medium: {
    gridRowEnd: 'span 33',
  },
  large: {
    gridRowEnd: 'span 45',
  },
};

export default Card;

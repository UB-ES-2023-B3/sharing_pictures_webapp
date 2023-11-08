import React, { useState } from 'react';
import ImageCard from './ImageCard';
import { useHistory } from 'react-router-dom';
import {
    IconButton,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";
import axios from 'axios';

function Card(props) {
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [isMouseOverHeart, setIsMouseOverHeart] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isClicked, setisClicked] = useState(false)
    // const { key, size, image, description } = props;
    var typeCard = "small";
    if (props.size > 250000) {
        typeCard = "large";
    } else if (props.size < 250000 && props.size > 100000) {
        typeCard = "medium";
    }
    const extractHashtags = (description) => {
        // Expresión regular para encontrar hashtags (#)
        const hashtagRegex = /#(\w+)/g;
        const hashtags = [];
        let match;

        while ((match = hashtagRegex.exec(description)) !== null) {
            hashtags.push(match[1]); // El grupo 1 contiene el texto del hashtag sin el #
        }

        return hashtags;
    };
    const handleButtonClicked = (event) => {

        event.stopPropagation(); // Evita la propagación del clic al contenedor

        fetch('api/likes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: props.user, post_id: props.id }),
        })
            .then(response => {
                // Manejar la respuesta del servidor si es necesario
                console.log('Backend response:');
            })
            .catch(error => {
                // Manejar errores si la solicitud falla
                console.error('Error en la solicitud al backend:');
            });



        setisClicked(!isClicked);
    }
    const handleIsLiked = (event) => {

       

        fetch('api/get_is_liked/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: props.user, post_id: props.id }),
        })
            .then(response => response.json())
            .then(result => {
                if (result.message === 'Sacar like') {
                    // Si el mensaje es "Sacar like", establece isClicked en false
                    setisClicked(true);
                } else if (result.message === 'añadir like') {
                    // Si el mensaje es "añadir like", establece isClicked en true
                    setisClicked(false);
                }

            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    const handleClick =(size, image, description, id) => {
            // Definir la acción que se realizará al hacer clic en el Card
            //window.location.href = "../viewImage?key=${key}&size=${size}&image=${image}&description=${description}";
            //window.location.href = `../viewImage/${size}/${image}`;
            //window.location.href = 'viewImage/'
            window.location.href = (`/viewImage/?size=${size}&image=${image}&description=${description}&id=${id}`);
        };
        const handleMouseEnter = () => {
            handleIsLiked();
            setIsMouseOver(true);
        }

        const handleMouseLeave = () => {
            setIsMouseOver(false);
        }
        const handleMouseEnterHeart = () => {
            setIsMouseOverHeart(true);
        }

        const handleMouseLeaveHeart = () => {
            setIsMouseOverHeart(false);
        }
        const handleImageClick = () => {
           
            if (!isMouseOverHeart) {
                
                handleClick(props.size, props.image, props.description, props.id);
            }
            
        }

        return (
            <div
                onClick={handleImageClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}

                style={{
                    ...styles.card,
                    ...styles[typeCard],
                    backgroundImage: `url(${props.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: !isMouseOver ? 1 : 0.7,
                    position: 'relative',
                    transition: 'opacity 0.5s',
                }}
            >
                {isMouseOver && (
                    <IconButton
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        variant='link'
                        zIndex={1}
                        onClick={handleButtonClicked}
                        icon={
                            <FiHeart
                                className='heart'
                                fill={isClicked ? "red" : "#1a1b1b"}
                                opacity={isClicked ? 1 : 0.5}
                                color={isClicked ? "red" : "white"}
                                boxSize={8}
                            />
                        }
                        style={{
                            position: 'absolute',
                            top: '10px',
                            right: '10px',
                        }}
                    />
                )}
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
        image: {
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'cover',
        },
    };

    export default Card;

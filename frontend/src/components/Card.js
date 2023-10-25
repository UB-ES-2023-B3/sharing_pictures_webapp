import React, { useState } from 'react';
import ImageCard from './ImageCard';
import { useHistory } from 'react-router-dom';
import {
    IconButton,
} from "@chakra-ui/react";
import { FiHeart } from "react-icons/fi";

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
        setisClicked(!isClicked);
    }

    const handleClick = (size, image, description) => {
        // Definir la acción que se realizará al hacer clic en el Card
        //window.location.href = "../viewImage?key=${key}&size=${size}&image=${image}&description=${description}";
        //window.location.href = `../viewImage/${size}/${image}`;
        //window.location.href = 'viewImage/'
        const hashtags = extractHashtags(description);
        const descriptionWithoutHashtags = description.replace(/#(\w+)/g, '');
        window.location.href = (`/viewImage/?size=${size}&image=${image}&description=${description}&descriptionWithoutHashtags=${descriptionWithoutHashtags}&hashtags=${hashtags}`);
    };
    const handleMouseEnter = () => {
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
            handleClick(props.size, props.image, props.description);
        }
    }
    console.log(props.description)
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

import React, { useState } from 'react';
import ImageCard from './ImageCard';
import { useHistory } from 'react-router-dom';

function Card(props) {
    const [isMouseOver, setIsMouseOver] = useState(false);
    const [posts, setPosts] = useState([]);
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
    const handleClick = (size, image,description)  => {
        // Definir la acción que se realizará al hacer clic en el Card
        //window.location.href = "../viewImage?key=${key}&size=${size}&image=${image}&description=${description}";
        //window.location.href = `../viewImage/${size}/${image}`;
        //window.location.href = 'viewImage/'
        const hashtags = extractHashtags(description);
        const descriptionWithoutHashtags = description.replace(/#(\w+)/g, '');
        window.location.href = (`/viewImage/?size=${size}&image=${image}&description=${description}&descriptionWithoutHashtags=${descriptionWithoutHashtags}&hashtags=${hashtags}`);
    };
    console.log(props.description)
    return (
        <div
            onClick={() => handleClick(props.size, props.image,props.description)}
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
            style={{
                ...styles.card,
                ...styles[typeCard],
                backgroundImage: `url(${props.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                opacity: isMouseOver ? 0.1 : 1, // Cambiar la opacidad cuando el mouse está sobre la imagen
                transition: 'opacity 0.5s', // Agregar una transición para suavizar el cambio de opacidad
            }}
        >  </div>
        
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

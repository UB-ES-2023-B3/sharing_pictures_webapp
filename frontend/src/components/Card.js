import React from 'react';

function Card(props) {
    console.log(props.size)
    var typeCard = "small"
    if (props.size > 250000){
        typeCard = "large"
    }else if(props.size < 250000 && props.size >100000 ){
        typeCard = "medium"
    }
    return (
        <div style={{
            ...styles.card,
            ...styles[typeCard],
            backgroundImage: `url(${props.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}>
             
        </div>

        
    )
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
        gridRowEnd: 'span 26'
    },
    medium: {
        gridRowEnd: 'span 33'
    },
    large: {
        gridRowEnd: 'span 45'
    },
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        objectFit: 'cover',
    }
}

export default Card;
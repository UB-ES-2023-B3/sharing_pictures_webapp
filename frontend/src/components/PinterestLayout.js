

import Card from './Card.js';
import React, { useState, useEffect } from 'react';

function PinterestLayout() {
    const [posts, setPosts] = useState([]);

    const fetchPostData = () => {
        fetch("api/load_pictures/")
            .then(response => {
                return response.json()
            })
            .then(data => {
                const shuffledPosts = data.pictures.sort(() => Math.random() - 0.5);
                setPosts(shuffledPosts);
            })
    }

    useEffect(() => {
        fetchPostData()
    }, [])
    
    return (
        <div style={styles.pin_container}>
        {posts.map((post, index) => (
            <Card
                key={index}
                size={post.image_size}
                image={post.image_url}
                description = {post.description}
            />
        ))}
    </div>

    )
}
/*
<div style={styles.pin_container}>
        {posts.map((post, index) => (
            <Card
                key={index}
                size={post.image_size}
                image={post.image_url}
            />
        ))}
    </div>

    <div style={styles.pin_container}>
            {posts.length > 0 && (
                <ul>{posts.map((posts => (
                    <li>{posts.image_url}</li>
                )))}</ul>

            )}
        </div>
*/


const styles = {
    pin_container: {
        margin: 0,
        padding: 0,
        width: '80vw',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 250px)',
        gridAutoRows: '10px',
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        justifyContent: 'center',

    }
}

export default PinterestLayout;
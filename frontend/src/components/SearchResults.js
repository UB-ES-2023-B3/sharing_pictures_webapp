import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import Card from './Card.js';

function PinterestSearchLayout() {
    const [results, setResults] = useState({ pictures: [], profiles: [] });
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const sentinelRef = useRef(null);
    const maxLoadCount = 10000;
    let loadCount = 0;

    const fetchSearchResults = () => {
        axios.all([
            axios.get(`/api/search_pictures/?q=${query}`),
            axios.get(`/api/search/?q=${query}`)
        ]).then(axios.spread((pictureResponse, profileResponse) => {
            const newPictures = pictureResponse.data.pictures;
            const newProfiles = profileResponse.data.profiles;
            
            if (loadCount + newPictures.length > maxLoadCount) {
                const remainingResults = maxLoadCount - loadCount;
                setResults({
                    pictures: [...results.pictures, ...newPictures.slice(0, remainingResults)],
                    profiles: [...results.profiles, ...newProfiles]
                });
                loadCount = maxLoadCount;
            } else {
                setResults({
                    pictures: [...results.pictures, ...newPictures],
                    profiles: [...results.profiles, ...newProfiles]
                });
                loadCount += newPictures.length;
            }
        })).catch(error => {
            console.error('There was an error fetching search results', error);
        });
    };

    const handleIntersect = (entries) => {
        if (entries[0].isIntersecting) {
            fetchSearchResults();
        }
    };

    useEffect(() => {
        fetchSearchResults();
    }, [query]);

    useEffect(() => {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1,
        };

        const observer = new IntersectionObserver(handleIntersect, options);

        if (sentinelRef.current) {
            observer.observe(sentinelRef.current);
        }

        return () => {
            if (sentinelRef.current) {
                observer.unobserve(sentinelRef.current);
            }
        };
    }, []);

    return (
        <div style={styles.pin_container}>

            <div style={styles.user_container}>
                <h3>Users</h3>
                <div>
                    {results.profiles.map((profile, index) => (
                        <button
                            key={index}
                            onClick={() => window.location.href = `/profile/${profile.username}`}
                            style={styles.user}
                        >
                            <img src={profile.profileimg} alt={profile.username} style={styles.user_image} />
                            {profile.username}
                        </button>
                    ))}
                </div>
            </div>

            
            <div style={styles.pictures_container}>
                <h3>Pictures</h3>
                <div style={styles.pictures}>
                    {results.pictures.map((picture, index) => (
                        <Card
                            key={index}
                            size={picture.image_size}
                            image={picture.image_url}
                            description={picture.description}
                        />
                    ))}
                </div>
            </div>
            
            <div ref={sentinelRef} style={{ height: '10px' }}></div>
        </div>
    );
}

const styles = {
    pin_container: {
        margin: 0,
        padding: 0,
        width: '90vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    
    user_container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
    },
    
    user: {
        marginRight: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    user_image: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginBottom: '5px',
    },
    pictures_container: {
        width: '100%',
    },
    pictures: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '10px',
    }
    
};

export default PinterestSearchLayout;

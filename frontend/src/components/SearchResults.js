import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function SearchResults(props) {
    const [results, setResults] = useState([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        axios.get(`/api/search/?q=${query}`).then(response => {
            setResults(response.data);
        }).catch(error => {
            console.error('There was an error fetching all results', error);
        });
    }, [query]);

    return (
        <div className="search-results-page">
            <div className="user-results">
                <h3>Users</h3>
                    {results.users && results.users.map((user) => (
                        <div key={user.id}>
                            {user.username}
                        </div>
                    ))}
            </div>
        {/* Optionally, you can also display the picture results like this: */}
            <div className="picture-results">
                <h3>Pictures</h3>
                    {results.pictures && results.pictures.map((picture) => (
                        <div key={picture.image_url}>
                            <img src={picture.image_url} alt={picture.description} />
                        </div>
                    ))}
            </div>
        </div>
    );
}

export default SearchResults;

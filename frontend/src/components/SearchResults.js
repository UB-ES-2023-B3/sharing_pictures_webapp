import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

function SearchResults(props) {
    const [results, setResults] = useState([]);
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');

    useEffect(() => {
        axios.get(`/api/search/?q=${query}`).then(response => {
            setResults(response.data.users);
        }).catch(error => {
            console.error('There was an error fetching all results', error);
        });
    }, [query]);

    return (
        <div className="search-results-page">
            {results.map((user) => (
                <div key={user.id}>
                    {user.username}
                </div>
            ))}
        </div>
    );
}

export default SearchResults;

import React, { useState } from 'react';
import axios from 'axios'; 

function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ users: []});
    const [error, setError] = useState(null); // to hold error messages

    const handleShowMore = () => {
        window.location.href = `/search_results?q=${query}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.get(`/api/search/?q=${query}`).then(response => {           
            setResults(response.data);
            setError(null);
        }).catch(error => {
            setError(error.response.data.error);
        });
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    placeholder="Search for users or posts..."
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" disabled={!query.trim()}>Search</button>
            </form>

            {/* Display errors if they exist */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* Display up to 5 search results */}
            {!error && results.users.slice(0, 5).map((user) => (
                <div key={user.id}>
                    {user.username}
                </div>
            ))}

            {/* Display 'Show More' link if there are results */}
            {!error && (
                <div className="show-more" onClick={handleShowMore}>
                    Show more results
                </div>
            )}
        </div>
    );
}

export default SearchBar;

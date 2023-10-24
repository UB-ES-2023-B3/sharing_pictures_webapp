// SearchBar.js
import React, { useState } from 'react';
import axios from 'axios'; 


function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);  // to hold search results

    const handleShowMore = () => {
        window.location.href = `/search_results?q=${query}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.get(`/api/search/?q=${query}`).then(
            response =>{
                setResults(response.data.users);
            }).catch(error => {
                console.error('There was an error',error);
            }
        );
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    placeholder="Search for users or hashtags..."
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" disabled={!query.trim()}>Search</button>
            </form>

            {/* Optionally display search results */}
            {/* Display up to 5 search results */}
            {results.slice(0, 5).map((user) => (
                <div key={user.id}>
                    {user.username}
                </div>
            ))}
            {/* Display 'Show More' link if more than 5 results */}
            {results.length > 0 && (
                <div className="show-more" onClick={handleShowMore}>
                    Show more results
                </div>
            )}
        </div>
    );
}

export default SearchBar;

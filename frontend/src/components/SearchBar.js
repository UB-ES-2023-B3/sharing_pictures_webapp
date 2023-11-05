import React, { useState } from 'react';
import axios from 'axios'; 
import './SearchBar.css';


function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ profiles: []});
    const [error, setError] = useState(null); // to hold error messages
    const [searched, setSearched] = useState(false);

    const handleShowMore = () => {
        window.location.href = `/search_results?q=${query}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        axios.get(`/api/search/?q=${query}`).then(response => {           
            setResults(response.data);
            setError(null);
            setSearched(true);
        }).catch(error => {
            setError(error.response.data.error);
            setSearched(true);
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
    
            {/* Display up to 5 search results or a 'no results' message */}
            {searched && !error && (
                results.profiles.length > 0 ? (
                    results.profiles.slice(0, 5).map((profile) => (
                        <button 
                            key={profile.id} 
                            className="search-result-button"
                            onClick={() => window.location.href = `/profile/${profile.username}`} 
                            >
                            <img src={profile.profileimg} alt={profile.username} className="profile-image" />
                            {profile.username}
                        </button>
                    ))
                ) : (
                    <div className="no-results">
                        No users found.
                    </div>
                )
            )}
    
            {/* Display 'Show More' link if there are results */}
            {searched && (
                <div className="show-more" onClick={handleShowMore}>
                    Show more results and posts
                </div>
            )}
        </div>
    );
}

export default SearchBar;

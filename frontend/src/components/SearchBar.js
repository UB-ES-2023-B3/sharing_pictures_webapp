import React, { useState , useEffect} from 'react';
import axios from 'axios'; 
import './SearchBar.css';


function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState({ profiles: []});
    const [error, setError] = useState(null); // to hold error messages
    const [searched, setSearched] = useState(false);

    const debounce = (func, delay) => {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    };

    const search = (searchQuery) => {
        axios.get(`/api/search/?q=${searchQuery}`).then(response => {           
            setResults(response.data);
            setError(null);
            setSearched(true);
        }).catch(error => {
            setError(error.response?.data?.error || 'An error occurred');
            setSearched(true);
        });
    };

    const debouncedSearch = debounce(() => search(query), 100);

    useEffect(() => {
        if (query.trim() !== '') {
            debouncedSearch();
        } else {
            setResults({ profiles: [] });
            setSearched(false);
        }
    }, [query]);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        search(query);
    };

    return (
        <div className="search-bar">
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={query}
                    placeholder="Search for users or posts..."
                    onChange={handleChange}
                />
                <button type="submit" onClick={() => window.location.href = `/search_results?q=${query}`} disabled={!query.trim()}>Search</button>
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

        </div>
    );
}

export default SearchBar;

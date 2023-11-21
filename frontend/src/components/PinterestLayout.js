import React, { useState, useEffect, useRef } from 'react';
import Card from './Card.js';

function PinterestLayout() {
  const [explorePosts, setExplorePosts] = useState([]); // State for explore posts
  const [followingPosts, setFollowingPosts] = useState([]); // State for following posts
  const [username, setUsername] = useState("");
  const [activeTab, setActiveTab] = useState('explore'); // State to manage the active tab

  const sentinelRef = useRef(null);
  const maxLoadCount = 10000; // Maximum number of pictures to load
  let loadCount = 0; // Counter to keep track of loaded pictures

  const fetchFollowingPictures = () => {
    fetch("api/load_following_pictures/")
      .then(response => response.json())
      .then(data => {
        setFollowingPosts(data.pictures); // Assuming the data returned has a 'pictures' field
      })
      .catch(error => {
        console.error('Error loading following pictures:', error);
      });
  };

  const fetchExplorePosts = () => {
    fetch("api/load_pictures/")
      .then((response) => response.json())
      .then((data) => {
        const newPosts = data.pictures;
        if (loadCount + newPosts.length > maxLoadCount) {
          const remainingPosts = maxLoadCount - loadCount;
          setExplorePosts((prevPosts) => [...prevPosts, ...newPosts.slice(0, remainingPosts)]);
          loadCount = maxLoadCount;
        } else {
          setExplorePosts((prevPosts) => [...prevPosts, ...newPosts]);
          loadCount += newPosts.length;
        }
      })
      .catch((error) => {
        console.error('Error loading explore posts:', error);
      });
  };

  const fetchUser = () => {
    fetch("api/get_logged_in_user/")
      .then((response) => response.json())
      .then((data) => {
        setUsername(data.username);
      })
      .catch((error) => {
        console.error('Error loading user data:', error);
      });
  };

  const handleIntersect = (entries) => {
    if (entries[0].isIntersecting && activeTab === 'explore') {
      fetchExplorePosts();
    }
  };

  useEffect(() => {
    if (activeTab === 'following') {
      fetchFollowingPictures();
    } else {
      fetchExplorePosts();
    }
    fetchUser();
  }, [activeTab]);

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
  }, [sentinelRef, activeTab]);

  return (
    <div className="container mx-auto px-4 sm:px-8 max-w-3xl">
      <div className="text-center mt-6">
        <div className="mb-4 border-b border-gray-200 dark:border-gray-700 inline-block">
          <ul
            className="flex flex-wrap -mb-px text-lg font-medium text-center"
            id="myTab"
            data-tabs-toggle="#myTabContent"
            role="tablist"
          >
            <li role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'explore'
                    ? 'border-red-600 text-red-600'
                    : 'hover:text-red-600 dark:hover-text-red-300'
                }`}
                id="explore-tab"
                type="button"
                role="tab"
                aria-selected={activeTab === 'explore'}
                onClick={() => setActiveTab('explore')}
              >
                Explore
              </button>
            </li>
            <li role="presentation">
              <button
                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                  activeTab === 'following'
                    ? 'border-red-600 text-red-600'
                    : 'hover:text-red-600 dark:hover-text-red-300'
                }`}
                id="following-tab"
                type="button"
                role="tab"
                aria-selected={activeTab === 'following'}
                onClick={() => setActiveTab('following')}
              >
                Following
              </button>
            </li>
          </ul>
        </div>
      </div>
      <div id="myTabContent">
        {activeTab === 'explore' && (
          <div style={styles.pin_container}>
            {explorePosts.map((post, index) => (
              <Card
                key={index}
                size={post.image_size}
                image={post.image_url}
                id={post.post_id}
                description={post.description}
                user={username}
              />
            ))}
            <div ref={sentinelRef} style={{ height: '10px' }}></div>
          </div>
        )}
        {activeTab === 'following' && (
          <div style={styles.pin_container}>
            {followingPosts.map((post, index) => (
              <Card
                key={index}
                size={post.image_size}
                image={post.image_url}
                id={post.post_id}
                description={post.description}
                user={username}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  pin_container: {
    margin: 0,
    padding: 0,
    width: '90vw',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gridAutoRows: '10px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    justifyContent: 'center',
  },
};

export default PinterestLayout;

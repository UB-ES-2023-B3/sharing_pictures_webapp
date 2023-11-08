import React, { useState, useEffect, useRef } from 'react';
import Card_NoAuth from './Card_NoAuth.js';
import Swal from 'sweetalert2';

function PinterestLayout_NoAuth() {
  const [posts, setPosts] = useState([]);
  const sentinelRef = useRef(null);
  const maxLoadCount = 50; // Maximum number of pictures to load
  let loadCount = 0; // Counter to keep track of loaded pictures

  const fetchPostData = () => {
    if (loadCount >= maxLoadCount) {
      // When the maximum count is reached, display the SweetAlert dialog
      showMaxPostsAlert();
      return;
    }

    // Fetch more posts from the API and append them to the existing posts
    fetch("api/load_pictures/")
      .then((response) => response.json())
      .then((data) => {
        const newPosts = data.pictures;

        if (loadCount + newPosts.length > maxLoadCount) {
          const remainingPosts = maxLoadCount - loadCount;
          setPosts((prevPosts) => [...prevPosts, ...newPosts.slice(0, remainingPosts)]);
          loadCount = maxLoadCount; // Update loadCount
        } else {
          setPosts((prevPosts) => [...prevPosts, ...newPosts]);
          loadCount += newPosts.length; // Update the load count
        }
      })
      .catch((error) => {
        console.error('Error loading more posts:', error);
      });
  };

  const showMaxPostsAlert = () => {
    // Display SweetAlert dialog when the maximum count is reached
    Swal.fire({
      icon: 'info',
      title: 'Maximum Pictures Reached',
      text: 'To see more pictures, please log in or register.',
      showCancelButton: true,
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      stopKeydownPropagation: false,
      confirmButtonText: 'Login',
      confirmButtonColor: '#dc3545',
      confirmButtonTextColor: '#fff',
      cancelButtonColor: '#dc3545',
      cancelButtonTextColor: '#fff',
      cancelButtonText: 'Register',
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/login";
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        window.location.href = "/register";
      }
    });
  };

  const handleIntersect = (entries) => {
    if (entries[0].isIntersecting) {
      fetchPostData();
    }
  };

  useEffect(() => {
    fetchPostData(); // Initial data load
  }, []);

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
      {posts.map((post, index) => (
        <Card_NoAuth
          key={index}
          size={post.image_size}
          image={post.image_url}
          description={post.description}
        />
      ))}
      <div ref={sentinelRef} style={{ height: '10px' }}></div>
    </div>
  );
}

const styles = {
  pin_container: {
    margin: 0,
    padding: 0,
    width: '90vw', // Increase the width of the container
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', // Adjust columns to maintain picture quality
    gridAutoRows: '10px',
    position: 'absolute',
    left: '50%',
    transform: 'translateX(-50%)',
    justifyContent: 'center',
  },
};

export default PinterestLayout_NoAuth;

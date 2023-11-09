document.addEventListener('DOMContentLoaded', function() {
    const pictureContainer = document.getElementById('picture-container');
    const loadMoreContainer = document.getElementById('load-more-container');
  
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };
  
    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(loadMoreContainer);
  
    function handleIntersect(entries, observer) {
      if (entries[0].isIntersecting) {
        // User has scrolled to the bottom
        loadMorePictures();
      }
    }
  
    function loadMorePictures() {
      // Send an AJAX request to your Django view to fetch more pictures
      fetch('/load_more_pictures/')  // Use the correct URL for your project
        .then(response => response.json())
        .then(data => {
          const morePictures = data.pictures;
          for (const picture of morePictures) {
            const img = document.createElement('img');
            img.src = picture;
            img.alt = 'Picture';
            pictureContainer.appendChild(img);
          }
        })
        .catch(error => {
          console.error('Error loading more pictures:', error);
        });
    }
  });
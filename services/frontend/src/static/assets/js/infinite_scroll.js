document.addEventListener('DOMContentLoaded', function() {
    const loadMoreContainer = document.getElementById('load-more-container');
    const pictureContainer = document.getElementById('picture-container');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
    };

    if (Cookies.get('picturesSeen')) {
        // redirect to login page if user is not logged in
        window.location.href = '/login';
    }

    const observer = new IntersectionObserver(handleIntersect, options);
    observer.observe(loadMoreContainer);

    let loadCount = 12; // Initialize a counter to keep track of loaded pictures
    const maxLoadCount = 50; // Set the maximum number of pictures to load

    function handleIntersect(entries, observer) {
        if (entries[0].isIntersecting) {
            if (loadCount < maxLoadCount) {
                // User has scrolled to the bottom, and the load count is within the limit
                loadMorePictures();
            } else {
                // Load limit reached, stop making requests
                observer.unobserve(loadMoreContainer);

                Cookies.set('picturesSeen', 'true');

                const dialogContainer = document.createElement('div');
                dialogContainer.innerHTML = `
                    <div class="fixed bottom-0 left-0 w-full bg-red-500 text-white py-4 px-6 rounded-t-lg shadow-md">
                        <h2 class="text-xl font-semibold">You have reached the end of the pictures</h2>
                        <p class="mt-2">Please log in or register to see more content:</p>
                        <div class="mt-4">
                            <a href="/login" class="text-white font-semibold hover:underline">Login</a>
                            <span class="mx-2">or</span>
                            <a href="/register" class="text-white font-semibold hover:underline">Register</a>
                        </div>
                    </div>
                `;
                document.body.appendChild(dialogContainer);


            }
        }
    }

    function loadMorePictures() {
        // Send an AJAX request using the URL variable
        fetch(loadMoreURL)
            .then(response => response.json())
            .then(data => {
                const morePosts = data.pictures;

                morePosts.forEach(post => {
                    if (loadCount < maxLoadCount) {
                        const postHTML = `
                            <div class="bg-white rounded-lg overflow-hidden shadow-md">
                                <img src="${post.image_url}" alt="${post.title}" class="w-full h-40 object-cover">
                                <div class="p-4">
                                    <h2 class="text-xl font-semibold text-gray-800">${post.description}</h2>
                                    <p class="text-gray-600 mt-2">${post.created_at}</p>
                                </div>
                            </div>
                        `;

                        const postElement = document.createElement('div');
                        postElement.innerHTML = postHTML;
                        pictureContainer.appendChild(postElement);
                        loadCount++; // Increment the load count
                    }
                });
            })
            .catch(error => {
                console.error('Error loading more posts:', error);
            });
    }
});

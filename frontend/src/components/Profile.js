import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Card from './Card';
import axios from 'axios';

function Profile() {
const [profileData, setProfileData] = useState(null);
const [likedPosts, setLikedPosts] = useState(null);
const [activeTab, setActiveTab] = useState('my-posts');
const { username } = useParams();
const [isHoveringProfilePicture, setIsHoveringProfilePicture] = useState(false);

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
    const overlayButtonStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent', // Add a semi-transparent background
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        opacity: isHoveringProfilePicture ? 1 : 0,
        transition: 'opacity 0.3s', // Add a smooth transition effect
        maxWidth: '100%', // Ensures the overlay doesn't exceed the image width
        maxHeight: '100%', // Ensures the overlay doesn't exceed the image height
        };

useEffect(() => {
const apiUrl = `/api/profile/${username}`;

fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
    const profileData = {
        user_object: {
        first_name: data.user_object.fields.first_name,
        last_name: data.user_object.fields.last_name,
        username: data.user_object.fields.username,
        },
        user_profile: {
        profileimg: data.profile_image,
        bio: data.user_profile.fields.bio,
        },
        user_followers: data.user_followers,
        user_following: data.user_following,
        is_own_profile: data.is_own_profile,
        uploaded_pictures: data.uploaded_posts,
        
    };
    
    fetch(`/api/load_liked_pictures`)
    .then((response) => response.json())
    .then((likedData) => {
        // Ensure likedData.pictures exists and is an array
        setLikedPosts(likedData.pictures || []);
        console.log(likedData.pictures);
    })
    .catch((error) => console.error('Error fetching liked posts: ', error));

setProfileData(profileData);
})
    .catch((error) => {
    console.error('Error fetching profile data: ', error);
    Swal.fire({
        icon: 'error',
        title: "404 Profile doesn't exist",
        text: 'The profile you are looking for does not exist, please go back and try again.',
        confirmButtonText: 'Back',
        confirmButtonColor: '#d33',
        allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
        window.history.back();
        }
    });
    });
}, [username]);

const handleProfileEditError = () => {

    Swal.fire({
        icon: 'error',
        title: 'Oops... Something went wrong updating your profile!',
        text: 'Please check that your first name, last name and bio are not longer than 30, 30 and 100 characters respectively.',

    });
}

const handleEditProfile = () => {
    Swal.fire({
        title: 'Edit Profile',
        html: `
        <div style="text-align: center; overflow-x: hidden;">
        <div class="w-full max-w-md mx-auto">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <br>
                <label for="swal-first-name" class="block text-sm font-medium text-gray-700">First Name</label>
                <input id="swal-first-name" class="swal2-input w-full border border-gray-300 rounded-lg" placeholder="First Name" value="${profileData.user_object.first_name}">
            </div>
        </div>
    
        <div class="w-full max-w-md mx-auto">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <br>
                <label for="swal-last-name" class="block text-sm font-medium text-gray-700">Last Name</label>
                <input id="swal-last-name" class="swal2-input w-full border border-gray-300 rounded-lg" placeholder="Last Name" value="${profileData.user_object.last_name}">
            </div>
        </div>
    
        <div class="w-full max-w-md mx-auto">
            <div style="display: flex; flex-direction: column; align-items: center;">
                <br>
                <label for="swal-bio" class="block text-sm font-medium text-gray-700">Bio</label>
                <textarea id="swal-bio" class="swal2-textarea w-full border border-gray-300 rounded-lg" placeholder="Your description">${profileData.user_profile.bio}</textarea>
            </div>
        </div>
    </div>
    
        `,
        showCancelButton: true,
        confirmButtonText: 'Save',
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        showLoaderOnConfirm: true,
        preConfirm: () => {
        const firstName = Swal.getPopup().querySelector('#swal-first-name').value;
        const lastName = Swal.getPopup().querySelector('#swal-last-name').value;
        const bio = Swal.getPopup().querySelector('#swal-bio').value;
    
        console.log('firstName:', firstName);
        console.log('lastName:', lastName);
        console.log('bio:', bio);
    
        return { firstName, lastName, bio };
        },
    }).then((result) => {
        if (result.isConfirmed) {
        const { firstName, lastName, bio } = result.value;

        if (firstName.length > 30 || lastName.length > 30 || bio.length > 100){
            handleProfileEditError();
            return;
        }

        setProfileData((prevData) => ({
            ...prevData,
            user_object: {
            ...prevData.user_object,
            first_name: firstName,
            last_name: lastName,
            },
            user_profile: {
            ...prevData.user_profile,
            bio: bio,
            },
        }));
        
        axios
            .post('/api/update_profile/', {
            first_name: firstName,
            last_name: lastName,
            bio: bio,
            }, { headers: { 'Content-Type': 'application/json' } })
            .then((response) => {
            console.log(response);
            Swal.fire({
                icon: 'success',
                title: 'Profile Updated',
            });
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops... Something went wrong updating your profile!',
                    text: error.response.data.message,
                });
            });
        }
    });
    };

if (!profileData) {
return <div>Loading...</div>;
}

const handleProfilePictureSelect = (event) => {
    const file = event.target.files[0];
    //check if file is an image and less than 4mb
    // and also if its png jpg or jpeg
    if (
        file.type !== 'image/jpeg' &&
        file.type !== 'image/jpg' &&
        file.type !== 'image/png'
        ) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Only JPG, JPEG and PNG files are allowed!',
        });
        return;
    }
    if (file.size > 4 * 1024 * 1024) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'File size cannot exceed 4MB!',
        });
        return;
    };

    handleProfilePictureUpload(file);

};

const handleProfilePictureUpload = (selectedFile) => {
    if (selectedFile) {
        const formData = new FormData();
        formData.append('profileimg', selectedFile);
    
        axios
        .post('/api/update_profile_picture/', formData)
        .then((response) => {
            console.log(response);
    
            setProfileData((prevData) => ({
            ...prevData,
            user_profile: {
                ...prevData.user_profile,
                profileimg: response.data.profileimg,
            },
            }));
    
            Swal.fire({
            icon: 'success',
            title: 'Profile Picture Updated',
            });
        })
        .catch((error) => {
            Swal.fire({
            icon: 'error',
            title: 'Oops... Something went wrong updating your profile picture!',
            text: error.response.data.message,
            });
        });
    }
    };
    


const myPosts = profileData.uploaded_pictures ? (
    <div style={styles.pin_container}>
      {profileData.uploaded_pictures.map((picture, index) => (
        <Card
          key={index}
          size={picture.image_size}
          image={`/media/${picture.fields.image}`}
          description={picture.fields.description}
        />
      ))}
    </div>
  ) : (
    <div className="text-center">No posts available.</div>
  );

  const likedPostsSection = profileData.is_own_profile && likedPosts && likedPosts.length > 0 ? (
    <div style={styles.pin_container}>
        {likedPosts.map((picture, index) => (
            <Card
                key={index}
                size={picture.image_size}
                image={picture.image_url}
                description={picture.description}
            />
        ))}
    </div>
) : profileData.is_own_profile ? (
    <div className="text-center">No liked posts available.</div>
) : null;



return (
<div className="bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-60">
    <div className="bg-white bg-opacity-90 p-4 container">
        <div className="relative">
            <div className="profile-picture">
                <div className="flex justify-center">
                    <div
                        style={{
                            position: 'relative',
                            display: 'inline-block',
                        }}
                        onMouseEnter={() => {
                            // put true if its own profile
                            if(profileData.is_own_profile){
                                setIsHoveringProfilePicture(true);
                            }
                        }}
                        onMouseLeave={() => {
                            setIsHoveringProfilePicture(false);
                        }}
                    >
                        <img
                            src={`/media/profile_images/${profileData.user_profile.profileimg}`}
                            alt="Profile Picture"
                            className={`h-36 w-36 rounded-full mx-auto mb-4 ${profileData.is_own_profile ? 'cursor-pointer' : ''}`}
                            style={{
                                filter: isHoveringProfilePicture ? 'brightness(50%)' : 'none',
                                position: 'relative'
                            }}
                            onClick={() => {
                                if(profileData.is_own_profile){
                                    document.getElementById('profile-picture-input').click();
                                }   
                            }}
                        />
                        {isHoveringProfilePicture && (
                            <label htmlFor="profile-picture-input" style={overlayButtonStyle}>
                                <div className="overlay">
                                    <p className="text-sm font-semibold text-white cursor-pointer">Change Picture</p>
                                </div>
                            </label>
                        )}
                    </div>
                    <input
                        type="file"
                        id="profile-picture-input"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleProfilePictureSelect}
                    />
                </div>


                <div className="text-3xl font-semibold text-center">
                    {profileData.user_object.first_name} {profileData.user_object.last_name}
                </div>
                <div className="text-lg text-gray-600 text-center">
                    @{profileData.user_object.username}
                </div>
                <div className="text-lg text-gray-600 text-center">
                    Followers: {profileData.user_followers} Following: {profileData.user_following}
                </div>
                <div className="text-lg text-gray-600 text-center">
                    {profileData.user_profile.bio}
                </div>
                {profileData.is_own_profile ? (
                    <div className="flex justify-center mt-4 space-x-4">
                        <button
                            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:text-red-300"
                            onClick={handleEditProfile}
                        >
                            Edit Profile
                        </button>
                    </div>
                ) : null}
            </div>
        </div>
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
                                activeTab === 'my-posts'
                                    ? 'border-red-600 text-red-600'
                                    : 'hover:text-red-600 dark:hover-text-red-300'
                            } tab-button`}
                            id="my-posts-tab"
                            data-tabs-target="#my-posts"
                            type="button"
                            role="tab"
                            aria-controls="my-posts"
                            aria-selected={activeTab === 'my-posts'}
                            onClick={() => setActiveTab('my-posts')}
                        >
                            Posts
                        </button>
                    </li>
                    {profileData.is_own_profile && (
                    <li role="presentation">
                        <button
                            className={`inline-block p-4 border-b-2 rounded-t-lg ${
                                activeTab === 'liked-posts'
                                    ? 'border-red-600 text-red-600'
                                    : 'hover:text-red-600'
                            }`}
                            type="button"
                            onClick={() => setActiveTab('liked-posts')}
                        >
                            Liked
                        </button>
                    </li>
                    )}
                </ul>
            </div>
        </div>
        <div id="myTabContent">
            {activeTab === 'my-posts' ? myPosts : null}
            {activeTab === 'liked-posts' ? likedPostsSection : null}
        </div>
    </div>
</div>
);
}

export default Profile;


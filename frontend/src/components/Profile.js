import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Card from './Card';

function Profile() {
const [profileData, setProfileData] = useState(null);
const [activeTab, setActiveTab] = useState('my-posts');
const { username } = useParams();

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

    console.log('profileData: ', profileData);
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

if (!profileData) {
return <div>Loading...</div>;
}

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

return (
<div className="bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-60">
<div className="bg-white bg-opacity-90 p-4 container">
    <div className="relative">
    <div className="profile-picture">
        <div className="flex justify-center">
        <img
            src={`/media/profile_images/${profileData.user_profile.profileimg}`}
            alt="Profile Picture"
            className={`h-36 w-36 rounded-full mx-auto mb-4`}
            ></img>
        </div>

    </div>
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
        </ul>
        </div>
    </div>
    <div id="myTabContent">
          {activeTab === 'my-posts' ? myPosts : null}
        </div>
    </div>

);
    
}
    

export default Profile;


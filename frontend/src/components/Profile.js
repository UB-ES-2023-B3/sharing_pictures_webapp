import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Profile() {
    const [profileData, setProfileData] = useState(null);
    const [activeTab, setActiveTab] = useState('my-posts');
    const { username } = useParams();
    
    useEffect(() => {
        const apiUrl = `/api/profile/${username}`;

        fetch(apiUrl)
            .then((response) => response.json())
            .then((data) => {
                // Map the context data to the expected structure
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
                };

                console.log('profileData: ', profileData);
                setProfileData(profileData);
            })
            .catch((error) => console.error('Error fetching profile data:', error));
    }, [username]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    if (!profileData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="bg-cover bg-center bg-no-repeat bg-fixed bg-opacity-60">
            <div className="bg-white bg-opacity-90 p-4 container">
                <img
                    src={`/media/${profileData.user_profile.profileimg}`}
                    alt="Profile Picture"
                    className="h-36 w-36 rounded-full mx-auto mb-4"
                />
                <div className="text-3xl font-semibold text-center">{profileData.user_object.first_name} {profileData.user_object.last_name}</div>
                <div className="text-lg text-gray-600 text-center">@{profileData.user_object.username}</div>
                <div className="text-lg text-gray-600 text-center">
                    Followers: {profileData.user_followers} Following: {profileData.user_following}
                </div>
                <div className="text-lg text-gray-600 text-center">
                    {profileData.user_profile.bio}
                </div>

                {profileData.is_own_profile && (
                    <div className="flex justify-center mt-4 space-x-4">
                        <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:text-red-300">
                            Edit Profile
                        </button>
                    </div>
                )}
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
                                    activeTab === 'my-posts' ? 'border-red-600 text-red-600' : 'hover:text-red-600 dark:hover-text-red-300'
                                } tab-button`} 
                                id="my-posts-tab" 
                                data-tabs-target="#my-posts" 
                                type="button" 
                                role="tab" 
                                aria-controls="my-posts" 
                                aria-selected={activeTab === 'my-posts'}
                                onClick={() => handleTabClick('my-posts')}
                            >
                                My Posts
                            </button>
                        </li>
                        <li className="mr-2" role="presentation">
                            <button 
                                className={`inline-block p-4 border-b-2 rounded-t-lg ${
                                    activeTab === 'liked-posts' ? 'border-red-600 text-red-600' : 'hover:text-red-600 dark:hover-text-red-300'
                                } tab-button`} 
                                id="liked-posts-tab" 
                                data-tabs-target="#liked-posts" 
                                type="button" 
                                role="tab" 
                                aria-controls="liked-posts" 
                                aria-selected={activeTab === 'liked-posts'}
                                onClick={() => handleTabClick('liked-posts')}
                            >
                                Liked Posts
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div id="myTabContent">
                {/* My Posts Tab Content */}
                {activeTab === 'my-posts' && (
                    <div className="my-posts p-4 rounded-lg bg-white" id="my-posts" role="tabpanel" aria-labelledby="my-posts-tab">
                        <div className="post-grid">
                            {/* Sample My Posts */}
                            <div className="post">
                                <div className="bg-white rounded-lg shadow-lg">
                                    <img src="https://via.placeholder.com/400" alt="My Post 1" className="w-full h-96 object-cover rounded-t-lg" />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold">My Post Title</h3>
                                        <p className="text-gray-600">My Post Description</p>
                                    </div>
                                </div>
                            </div>
                            {/* Add more "My Posts" here */}
                        </div>
                    </div>
                )}

                {/* Liked Posts Tab Content */}
                {activeTab === 'liked-posts' && (
                    <div className="liked-posts p-4 rounded-lg bg-white" id="liked-posts" role="tabpanel" aria-labelledby="liked-posts-tab">
                        <div className="post-grid">
                            {/* Sample Liked Posts */}
                            <div className="post">
                                <div className="bg-white rounded-lg shadow-lg">
                                    <img src="https://via.placeholder.com/400" alt="Liked Post 1" className="w-full h-96 object-cover rounded-t-lg" />
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold">Liked Post Title</h3>
                                        <p className="text-gray-600">Liked Post Description</p>
                                    </div>
                                </div>
                            </div>
                            {/* Add more "Liked Posts" here */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;

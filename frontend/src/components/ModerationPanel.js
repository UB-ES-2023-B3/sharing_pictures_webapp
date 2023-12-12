import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


const ModerationPanel = () => {
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState('posts');

    useEffect(() => {
        fetch("/api/moderation_panel/")
            .then(response => response.json())
            .then(data => {
                setPosts(data.reported_posts);
                setUsers(data.reported_users);
                console.log(data.reported_users);
            })
            .catch(error => {
                Swal.fire({
                    title: 'Error!',
                    text: 'You do not have permission to view this page.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#d33',
                }).then(() => {
                    window.location.href = '/';
                });
            });
    }, []);

    const onDeleteUser = (userId) => {
      fetch(`/api/delete_user/${userId}/`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error deleting user');
          }
        })
        .then(data => {
          setUsers(users.filter(user => user.id !== userId));
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    const deleteReportUser = (userId) => {
      fetch(`/api/delete_rep_user/${userId}/`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error deleting report');
          }
        }
        )
        .then(data => {
          setUsers(users.filter(user => user.id !== userId));
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    const onDeletePost = (postId) => {
      fetch(`/api/delete_post/${postId}/`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error deleting post');
          }
        })
        .then(data => {
          setPosts(posts.filter(post => post.post_id !== postId));
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };

    const deleteReport = (postId) => {
      fetch(`/api/delete_rep/${postId}/`, {
        method: 'DELETE',
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Error deleting report');
          }
        })
        .then(data => {
          setPosts(posts.filter(post => post.post_id !== postId));
        })
        .catch(error => {
          console.error('Error:', error);
        });
    };


  return (
    <div className="min-h-screen p-8 bg-white-ash bg-white px-6 py-4 mb-4 mx-auto align-center align-middle justify-center w-full md:w-3/4 lg:w-1/2">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Moderation Panel</h2>
      
        <div className="flex mb-4">
            <button 
                className={`px-4 py-2 ${activeTab === 'posts' ? 'text-red-500' : ''}`}
                onClick={() => setActiveTab('posts')}
            >
                Posts
            </button>
            <button 
                className={`px-4 py-2 ${activeTab === 'users' ? 'text-red-500' : ''}`}
                onClick={() => setActiveTab('users')}
            >
                Users
            </button>
        </div>

        {activeTab === 'posts' ? (
            posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-xl font-semibold text-gray-500">No reported posts</p>
                </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="flex flex-col md:flex-row items-start border-b border-gray-200 py-4">
                    {posts.map((post) => (
                  <div key={post.id} className="flex flex-col md:flex-row items-start border-b border-gray-200 py-4">
                    <div className="relative md:w-1/3 mb-4 md:mb-0 cursor-pointer">
                      <img
                        src={post.image_url}
                        alt="post"
                        className="h-auto w-full transition-opacity duration-300"
                        onClick={() => window.open(post.image_url)}
                      ></img>
                      <div onClick={() => window.open(post.image_url)} className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center w-full h-full bg-black bg-opacity-0 opacity-0 hover:bg-opacity-50 hover:opacity-100 transition-opacity duration-300">
                        <span className="fas fa-eye text-white text-4xl"></span>
                      </div>
                    </div>
                    <div className="w-full md:w-1/2 md:pl-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-red-500">{post.title}</h3>
                        <p>Uploaded by: {post.uploader}</p>
                        <p>Reported by: {post.user}</p>
                        <p>Reported at: {post.created_at}</p>
                        <p>Description: {post.description}</p>
                      </div>
                      <div className="flex flex-col justify-end">
                        <button
                          onClick={() => onDeletePost(post.post_id)}
                          className="px-5 py-2.5 mr-2 mb-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-lg"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => deleteReport(post.post_id)}
                          className="px-5 py-2.5 mr-2 mb-2  text-sm font-medium text-green-500 transition duration-150 ease-in-out border border-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-lg"
                        >
                          Maintain
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
          ))
            )
        ) : (
            users.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-4">
                    <p className="text-xl font-semibold text-gray-500">No reported users</p>
                </div>
            ) : (
              users.map((user) => (
                <div key={user.id} className="flex flex-col md:flex-row items-start border-b border-gray-200 py-4">
                  <div className="relative md:w-1/3 mb-4 md:mb-0 cursor-pointer">
                    <img
                      src={user.avatar}
                      alt="profile"
                      className="h-auto w-full rounded-full transition-opacity duration-300"
                      onClick={() => window.open(user.profile_picture)}
                    ></img>
                    <div onClick={() => window.open('/profile/' + user.reported_user)} className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center w-full h-full bg-black bg-opacity-0 opacity-0 hover:bg-opacity-50 hover:opacity-100 transition-opacity duration-300">
                      <span className="fas fa-eye text-white text-4xl"></span>
                    </div>
                  </div>
                  <div className="w-full md:w-1/2 md:pl-4 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-red-500">{user.name}</h3>
                      <p>Username: {user.reported_user}</p>
                      <p>Reported by: {user.user}</p>
                      <p>Reported at: {user.created_at}</p>
                      <p>Descriptiont of report: {user.description}</p>
                    </div>
                    <div className="flex flex-col justify-end">
                      <button
                        onClick={() => onDeleteUser(user.id)}
                        className="px-5 py-2.5 mr-2 mb-2 text-sm font-medium text-white transition duration-150 ease-in-out bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 rounded-lg"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => deleteReportUser(user.id)}
                        className="px-5 py-2.5 mr-2 mb-2  text-sm font-medium text-green-500 transition duration-150 ease-in-out border border-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300 rounded-lg"
                      >
                        Maintain
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )
        )}
    </div>
);


};

export default ModerationPanel;
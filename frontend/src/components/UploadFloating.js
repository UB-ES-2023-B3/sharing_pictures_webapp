import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const UploadFloating = () => {
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        const handleUploadClick = () => {
            document.body.style.overflow = 'hidden';
            Swal.fire({
                html: `
                    <h1 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Upload an Image</h1>
                    <form id="imageUploadForm" action="/api/upload/" method="post" encType="multipart/form-data" class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 dark-text-white">Upload an image:</label>
                            <input class="block w-full text-sm text-gray-900 dark-text-gray-200 border border-gray-300 rounded-md cursor-pointer bg-gray-100 dark-bg-gray-700 focus:outline-none" id="file_input" type="file" name="image">
                            <p class="mt-1 text-xs text-gray-500 dark-text-gray-300" id="file_input_help">Supported formats: JPG, JPEG & PNG</p>
                        </div>
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 dark-text-white">Give a description:</label>
                            <textarea id="image-description" class="w-full p-2 text-sm text-gray-900 dark-text-gray-200 border border-gray-300 rounded-md focus:outline-none placeholder-gray-400" placeholder="Image Description" name="description"></textarea>
                        </div>
                        <div class="mb-4" id="image-preview-container">
                            <div id="image-preview" style="text-align: center;">
                                <img src="" style="max-width: 100%; max-height: 50vh;" id="previewImage">
                            </div>
                        </div>
                        <button id="publish-button" class="block w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105">Publish Post</button>
                    </form>
                `,
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: true,
                customClass: {
                    closeButton: 'text-gray font-bold py-2 px-2',
                    content: 'p-5',
                },
                didOpen: () => {
                  document.body.style.overflow = 'hidden';
                  const imageUpload = document.getElementById('file_input');
                  const imageDescription = document.getElementById('image-description');
                  const publishButton = document.getElementById('publish-button');
                  const imagePreview = document.getElementById('image-preview').querySelector('img');
              
                  imageUpload.type = 'file';
                  imageUpload.accept = '.jpg,.jpeg,.png';
                  imageUpload.multiple = false;
                  imageUpload.required = true;
              
                  imageUpload.addEventListener('change', (e) => {
                    const selectedFile = e.target.files[0];
                    if (selectedFile) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            imagePreview.src = event.target.result;
                        };
                        const validTypes = /jpeg|jpg|png/i; // Expresión regular
                        if (!validTypes.test(selectedFile.type)) {
                            Swal.showValidationMessage('Invalid file type');
                            // Clear input
                            imageUpload.value = '';
                            publishButton.disabled = true;
                            publishButton.style.cursor = 'not-allowed'; 
                            imagePreview.src = '';
                            return;
                        } else if (selectedFile.size > 4000000) {
                            Swal.showValidationMessage('File size must be less than 4MB!');
                            imageUpload.value = '';
                            publishButton.disabled = true;
                            publishButton.style.cursor = 'not-allowed';
                            imagePreview.src = '';
                            return;
                        }
                        Swal.resetValidationMessage();
                        publishButton.disabled = false;
                        publishButton.style.cursor = 'pointer'; 
                        reader.readAsDataURL(selectedFile);
                        setSelectedImage(selectedFile); 
                    }
                });
               
                  publishButton.addEventListener('click', handlePublish);
              },
              willClose: () => {
                  document.body.style.overflow = '';
                  const publishButton = document.getElementById('publish-button');
                  publishButton.removeEventListener('click', handlePublish);
              },
            });
        };

        const handlePublish = () => {
          const image = selectedImage.value;
          const description = document.getElementById('image-description').value;
        
          // If all checks passed, send the request
          const formData = new FormData();
          formData.append('image', image);
          formData.append('description', description);
        
          axios.post('/api/upload/', formData)
            .then((response) => {
              console.log(response);
            })
            .catch((error) => {
              if (error.response) {
                showErrorResponse(error.response);
              }
            });
        };

        const showErrorResponse = (response) => {
            Swal.fire({
                icon: 'error',
                title: 'Oops... ' + response.status,
                text: 'Something went wrong when uploading the image.',
                footer: '<a href>Why do I have this issue?</a>',
            });
        };

        document.getElementById('upload-button').addEventListener('click', handleUploadClick);

        return () => {
            document.getElementById('upload-button').removeEventListener('click', handleUploadClick);
            
        };
    }, []);

    return (
        <div id="upload-button" className="fixed bottom-6 right-6">
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-5 px-5 rounded-full shadow-lg">
                <i className="fas fa-cloud-upload-alt text-4xl"></i>
            </button>
        </div>
    );
};

export default UploadFloating;

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const UploadFloating = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const handleUploadClick = () => {
    document.body.style.overflow = 'hidden';
      Swal.fire({
        title: 'Create a Post',
        html: `
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload an image:</label>
        <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" aria-describedby="file_input_help" id="file_input" type="file">
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">Supported formats: BMP, JPEG, PNG, TIFF & WEBP.</p>
        <br>
        <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Give a description:</label>
        <textarea id="image-description" class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 placeholder-gray-400" placeholder="Image Description"></textarea>
        <div id="image-preview" style="text-align: center; max-height: 400px;">
        <br>
          <img src="" style="max-width: 100%; max-height: 100%;" align="center">
        </div>
        <button id="publish-button" class="block w-full mt-4 bg-red-500 hover-bg-red-700 text-white font-bold py-2 px-4 rounded-full shadow-md cursor-pointer transition duration-300 ease-in-out transform hover-scale-100">Publish Post</button>
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

          imageUpload.addEventListener('change', (e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              // Previsualizar la imagen seleccionada
              const reader = new FileReader();
              reader.onload = (event) => {
                setSelectedImage(event.target.result);
                imagePreview.src = event.target.result; // Actualizamos la previsualización
              };
              reader.readAsDataURL(selectedFile);
            }
          });

          publishButton.addEventListener('click', () => {
            /*
            axios.post('/api/post/', { image: selectedImage, description: imageDescription.value, }).then((response) => {
                console.log(response);
            }).catch((error) => {
                console.log(error);
            });
            */
            Swal.close();
          });
        },
        willClose: () => {
          document.body.style.overflow = '';
        },
      });
    };

    document.getElementById('upload-button').addEventListener('click', handleUploadClick);

    return () => {
      document.getElementById('upload-button').removeEventListener('click', handleUploadClick);
    };
  }, []);

  return (
    <div id="upload-button" className="fixed bottom-6 right-6">
      <button className="bg-red-500 hover-bg-red-700 text-white font-bold py-5 px-5 rounded-full shadow-lg">
        <i className="fas fa-cloud-upload-alt text-4xl"></i>
      </button>
    </div>
  );
};

export default UploadFloating;


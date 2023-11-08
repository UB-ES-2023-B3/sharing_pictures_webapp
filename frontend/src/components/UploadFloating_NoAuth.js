import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

const UploadFloating_NoAuth = () => {
    useEffect(() => {
        const handleUploadClick = () => {
            document.body.style.overflow = "hidden";
            Swal.fire({
                html: `
                    <div class="flex flex-col items-center justify-center">
                        <h1 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                            Upload an Image
                        </h1>
                        <p class="mb-3 text-sm text-gray-900 dark:text-gray-200">
                            Please log in or register to upload an image.
                        </p>
                        <div class="flex flex-col sm:flex-row justify-between w-full">
                            <a
                                href="/login"
                                class="block w-full sm:w-5/12 bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 mb-2 sm:mb-0"
                            >
                                Login
                            </a>
                            <a
                                href="/register"
                                class="block w-full sm:w-5/12 bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md shadow-md cursor-pointer transition duration-300 ease-in-out transform hover:scale-105"
                            >
                                Register
                            </a>
                        </div>
                    </div>
                `,
                showCloseButton: true,
                showCancelButton: false,
                showConfirmButton: false,
                allowOutsideClick: true,
                customClass: {
                    closeButton: "text-gray font-bold py-2 px-2",
                    content: "p-5 sm:w-96",
                },
                didOpen: () => {
                    document.body.style.overflow = "hidden";
                },
                didClose: () => {
                    document.body.style.overflow = "auto";
                },
            });
        };
        const uploadButton = document.getElementById('upload-button');
        uploadButton.addEventListener('click', handleUploadClick);
        return () => {
            uploadButton.removeEventListener('click', handleUploadClick);
        };
    }, []);

    return (
        <button
            id="upload-button"
            className="fixed bottom-6 right-6 bg-red-500 hover:bg-red-700 text-white font-bold py-5 px-5 rounded-full shadow-lg"
            aria-label="Upload an image"
            role="button"
        >
            <i className="fas fa-cloud-upload-alt text-4xl"></i>
        </button>
    );
};

export default UploadFloating_NoAuth;
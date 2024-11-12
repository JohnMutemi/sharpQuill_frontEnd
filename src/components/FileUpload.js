import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import './fileupload.css';

const FileUpload = ({ assignmentId }) => {
  const onDrop = useCallback(
    (acceptedFiles) => {
      const formData = new FormData();
      formData.append('file', acceptedFiles[0]);

      fetch(`http://127.0.0.1:5555/upload/${assignmentId}`, {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Example for JWT token
        },
      })
        .then((response) => response.json())
        .then((data) => {
          alert(data.message);
        })
        .catch((error) => {
          console.error('Error uploading file:', error);
        });
    },
    [assignmentId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div
      {...getRootProps()}
      className={`dropzone ${isDragActive ? 'is-active' : ''}`}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag 'n' drop some files here, or click to select files</p>
      )}
    </div>
  );
};

export default FileUpload;

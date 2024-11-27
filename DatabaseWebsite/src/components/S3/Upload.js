import React, { useState } from 'react';
import axios from 'axios';

function ImageUpload() {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        try {
            const response = await axios.post('/get-signed-url', {
                fileName: selectedFile.name,
                fileType: selectedFile.type,
            });

            const presignedUrl = response.data.url;

            await axios.put(presignedUrl, selectedFile, {
                headers: {
                    'Content-Type': selectedFile.type,
                },
            });

            console.log('Upload successful!');
        } catch (error) {
            console.error('Upload failed:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Upload</button>
        </div>
    );
}

export default ImageUpload;
import axios from 'axios';


const FACE_API_URL = 'https://facedetectionapi-rj35.onrender.com';

export const detectFaceFromImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(`${FACE_API_URL}/detect`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Face Detection API Error:', error);
    throw error;
  }
};

// analyzeFace
export const analyzeFace = async (imageBase64) => {
  try {
    const response = await axios.post(`${FACE_API_URL}/analyze`, {
      image: imageBase64
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('❌ Face Analysis API Error:', error);
    throw error;
  }
};
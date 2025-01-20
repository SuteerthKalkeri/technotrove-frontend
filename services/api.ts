import axios from 'axios';
import { Platform } from 'react-native';

const api = axios.create({
  baseURL: Platform.OS === 'android' ? 'http://10.0.2.2:8080' : 'http://localhost:8080',
});


// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // Replace localhost with 10.0.2.2 in all image URLs
    if (response.data) {
      const updatedData = JSON.stringify(response.data).replace(
        /http:\/\/localhost:8080/g,
        'http://10.0.2.2:8080'
      );
      response.data = JSON.parse(updatedData);
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

import axios from 'axios';

export const fetchUser = async () => {
  try {
    const token = localStorage.getItem('authToken');
    const res = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/getuser`,
      {}, // empty body, since you’re sending token in headers
      {
        headers: {
          'authToken': token, // use the token you retrieved
        },
      }
    );
    return res;
  } catch (error) {
    console.log(error.message);
    return {};
  }
};

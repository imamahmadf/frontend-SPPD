import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;

// Fungsi login
export const login = (email, password) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/login`,
      { email, password }
    );
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user)); // Simpan user
    dispatch(loginSuccess(data));
  } catch (error) {
    console.error("Login failed", error);
  }
};

// Fungsi register
export const register = (name, email, password, role) => async () => {
  try {
    await axios.post(
      `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/register`,
      {
        name,
        email,
        password,
        role,
      }
    );
    console.log("Register berhasil");
  } catch (error) {
    console.error("Register gagal", error);
  }
};

// Fungsi Logout
export const performLogout = () => (dispatch) => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // Hapus user dari localStorage
  dispatch(logout());
  window.location.href = "/login";
};

export default authSlice.reducer;
console.log("aaa");
export const selectIsAuthenticated = (state) => !!state.auth.token;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_REACT_APP_API_BASE_URL}/user/refresh`,
          {},
          { withCredentials: true } // Pastikan refresh token dikirim sebagai httpOnly cookie
        );
        localStorage.setItem("token", res.data.accessToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${res.data.accessToken}`;
        return axios(originalRequest);
      } catch (err) {
        console.error("Refresh token gagal, logout...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

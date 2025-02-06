import axios from "axios";

const API_URL = "http://localhost:3000"; // 📌 URL du backend NestJS

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});


export const registerUser = (userData) => api.post("/auth/register", userData);

// 📌 Fonction pour se connecter
export const loginUser = (userData) => api.post("/auth/login", userData);

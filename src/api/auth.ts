import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/auth", // ✅ notice `/api/auth`
  withCredentials: true, // only if you're using cookies (optional)
});

export const loginUser = (email: string, password: string) =>
  API.post("/login", { email, password });

export const registerUser = (name: string, email: string, password: string, role: string) =>
  API.post("/signup", { name, email, password });

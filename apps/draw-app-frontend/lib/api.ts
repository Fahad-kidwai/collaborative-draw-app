import { SignupRequest, SignupResponse, SigninRequest, SigninResponse, ApiError, Shape } from "@/types";
import { API_BASE_URL } from "@/config";
import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from "axios";

type Shapes = Shape[]

/**
 * Database shape object returned from the API
 */
interface DatabaseShape {
  id: number;
  roomId: number;
  data: string; // JSON string that needs to be parsed
  userId: string;
}

/**
 * Create axios instance with base configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

/**
 * Request interceptor to automatically add auth token
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor for centralized error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      // Server responded with error status
      const apiError = error.response.data;
      const errorMessage =
        apiError?.error ||
        apiError?.errors?.issues?.[0]?.message ||
        `Request failed with status ${error.response.status}`;
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - clear token
        removeToken();
      }
      
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error("Network error: No response from server"));
    } else {
      // Something else happened
      return Promise.reject(error);
    }
  }
);

/**
 * Sign up a new user
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>("/signup", data);
  return response.data;
}

/**
 * Sign in an existing user
 */
export async function signin(data: SigninRequest): Promise<SigninResponse> {
  const response = await apiClient.post<SigninResponse>("/signin", data);
  return response.data;
}

/**
 * Store authentication token in localStorage
 */
export function storeToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("auth_token", token);
  }
}

/**
 * Get authentication token from localStorage
 */
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

/**
 * Remove authentication token from localStorage
 */
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}


/**
 * Get existing shapes for a room
 */
export async function getExistingShapes(roomId: string | number): Promise<Shapes> {
  const response = await apiClient.get<{ shapes: DatabaseShape[] }>(`/shapes/${roomId}`);
  console.log(response.data);
  const parsedShapes = response.data.shapes.map((shape: DatabaseShape) => JSON.parse(shape.data) as Shape);
    return parsedShapes;
}





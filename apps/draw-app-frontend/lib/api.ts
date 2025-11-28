const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface SignupRequest {
  username: string;
  name: string;
  password: string;
}

export interface SigninRequest {
  username: string;
  password: string;
}

export interface SignupResponse {
  userId: string;
}

export interface SigninResponse {
  token: string;
}

export interface ApiError {
  error?: string;
  errors?: {
    issues?: Array<{
      path: string[];
      message: string;
    }>;
  };
}

/**
 * Makes an API request with proper error handling
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const error: ApiError = data;
    throw new Error(
      error.error || 
      error.errors?.issues?.[0]?.message || 
      `Request failed with status ${response.status}`
    );
  }

  return data as T;
}

/**
 * Sign up a new user
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  return apiRequest<SignupResponse>("/signup", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Sign in an existing user
 */
export async function signin(data: SigninRequest): Promise<SigninResponse> {
  return apiRequest<SigninResponse>("/signin", {
    method: "POST",
    body: JSON.stringify(data),
  });
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


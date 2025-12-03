export type Tool = "circle" | "rect" | "pencil"|"erase";

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
export type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "pencil";
      points: Array<{ x: number; y: number }>;
    };

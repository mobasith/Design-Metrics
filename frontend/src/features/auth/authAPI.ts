import axios from "../../services/apiClient";
import { SignInData, SignInResponse } from "./authTypes";

export const signIn = async (data: SignInData): Promise<SignInResponse> => {
  const response = await axios.post("/api/users/login", data);
  return response.data;
};

import axios from "axios";
import { API_LINK } from "./base-api";

export const AddSearchHandler = async (userId: string, searches: string) => {
  try {
    const resp = await axios.post(`${API_LINK}/userSearch/storeUserSearch`, {
      userId,
      searches: [searches],
    });
  } catch (error) {
    console.log("Error in storing search: ", error);
  }
};

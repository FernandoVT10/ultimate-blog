import axios from "axios";

import { Tag } from "@customTypes/collections";

import { AxiosError } from "axios";

export async function getTags(): Promise<Tag[]> {
  try {
    const res = await axios.get("/tags");

    if(res.status === 200) {
      return res.data;
    }

    return [];
  } catch {
    return [];
  }
}

export async function createTag(name: Tag["name"]): Promise<{ success: boolean; error?: string; }> {
  try {
    const res = await axios.post("/tags", { name }, {
      withCredentials: true
    });

    if(res.status === 204) return { success: true };
  } catch(error) {
    if(error instanceof AxiosError) {
      const res = error.response;

      if(res && res.status === 400) {
        const validationError = res.data.errors[0];

        if(validationError.message) {
          return {
            success: false,
            error: validationError.message
          };
        }
      }
    }
  }

  return {
    success: false,
    error: "There was an unexpected error trying to create the tag"
  };
}

// TODO: remove this after no longer needed
export type { Tag };

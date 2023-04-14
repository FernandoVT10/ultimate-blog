import axios from "axios";

import { AUTH_COOKIE_KEY } from "@config/constants";

export async function checkAdminStatusFromServer(authToken: string | undefined): Promise<boolean> {
  if(!authToken) return false;

  try {
    const res = await axios.get("admin/status", {
      headers: {
        Cookie: `${AUTH_COOKIE_KEY}=${authToken}`
      }
    });

    if(res.data.isLogged) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

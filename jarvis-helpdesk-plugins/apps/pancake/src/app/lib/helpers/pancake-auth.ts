import { PancakeConstants } from "../constants/pancake";

export async function getPancakeUserAccessToken(): Promise<string | undefined> {
  if (chrome && chrome.cookies) {
    return new Promise((resolve) => {
      chrome.cookies.get(
        { url: "https://pancake.vn", name: PancakeConstants.ACCESS_TOKEN_KEY },
        (cookie) => {
          resolve(cookie?.value);
        }
      );
    });
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${PancakeConstants.ACCESS_TOKEN_KEY}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(";").shift();
  }
  return undefined;
}

export async function fetchAndStoreAccessToken(): Promise<string | undefined> {
  const token = await getPancakeUserAccessToken();
  if (token) {
    chrome.storage.local.set({ pancakeAccessToken: token });
  }
  return token;
}

export async function getStoredAccessToken(): Promise<string | undefined> {
  return new Promise((resolve) => {
    chrome.storage.local.get("pancakeAccessToken", (result) => {
      resolve(result["pancakeAccessToken"]);
    });
  });
}

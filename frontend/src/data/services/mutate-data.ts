import { getStrapiURL } from "@/lib/utils";
import { getAuthToken } from "./get-token";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mutateData(method: string, path: string, payload?: any) {
  const baseUrl = getStrapiURL();
  const authToken = await getAuthToken();
  const url = new URL(path, baseUrl);

  if (!authToken) throw new Error("No auth token found");

  try {
    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body:
        method !== "DELETE" && payload ? JSON.stringify(payload) : undefined,
    });

    if (response.status === 204) {
      return null;
    }

    // Перевіряємо, чи є відповідь JSON, перш ніж парсити
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return data;
    }

    // Якщо відповідь не JSON, повертаємо текстове значення
    return await response.text();
  } catch (error) {
    console.log("error", error);
    throw error;
  }
}

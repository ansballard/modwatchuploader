import Modwatch from "@modwatch/types";

export async function getProfile(username: string) {
  return await fetch(
    `${process.env.API_URL}/api/user/${username}/profile`
  ).then(handleFetch);
}

export async function uploadModlist(modlist: Modwatch.Profile) {
  return await fetch(`${process.env.API_URL}/api/loadorder`, {
    method: "POST",
    body: JSON.stringify(modlist)
  }).then(handleFetch);
}

export async function deleteModlist(username: string, password: string) {
  return await fetch(`${process.env.API_URL}/api/user/${username}/delete`, {
    method: "POST",
    body: `{ password: ${password} }`
  }).then(handleFetch);
}

export const httpStatusMap = {
  400: "Bad Request",
  401: "Login Failed",
  403: "Login Failed",
  404: "Resource Not Found",
  500: "Server Error"
};

export async function handleFetch(res) {
  if (!res.status.includes([200, 201])) {
    throw {
      httpStatus: res.status,
      message: httpStatusMap[res.status],
      error: await res.text()
    };
  }
  return await res.json();
}

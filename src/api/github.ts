export const fecthGitHubUser = async (username: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/users/${username}`,
  );

  if (!res.ok) throw new Error("User Not Found");

  const data = await res.json();

  console.log(data);

  return data;
};

export const searchGitHubUser = async (query: string) => {
  const res = await fetch(
    `${import.meta.env.VITE_GITHUB_API_URL}/search/users?q=${query}`,
  );

  if (!res.ok) throw new Error("User Not Found");

  const data = await res.json();

  return data.items;
};

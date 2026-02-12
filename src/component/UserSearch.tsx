import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { FaGithubAlt } from "react-icons/fa";

const UserSearch = () => {
  const [userName, setUsername] = useState("");
  const [submittedUserName, setSubmittedUsername] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", submittedUserName],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_GITHUB_API_URL}/users/${submittedUserName}`,
      );

      if (!res.ok) throw new Error("User Not Found");

      const data = await res.json();

      console.log(data);

      return data;
    },
    enabled: !!submittedUserName,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmittedUsername(userName.trim());
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Enter GitHub Username...."
          value={userName}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      {isLoading && <p className="status">Loading...</p>}
      {error && <p className="status error">{error.message}</p>}
      {data && (
        <div className="user-card">
          <img src={data.avatar_url} alt={data.name} className="avatar" />
          <h2>{data.name || data.login}</h2>
          <p className="bio">{data.bio}</p>
          <a
            href={data.html_url}
            className="profile-btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithubAlt /> View Github Profile
          </a>
        </div>
      )}
    </>
  );
};

export default UserSearch;

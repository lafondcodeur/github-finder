import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { fecthGitHubUser } from "../api/github";
import UserCard from "./UserCard";

const UserSearch = () => {
  const [userName, setUsername] = useState("");
  const [submittedUserName, setSubmittedUsername] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", submittedUserName],
    queryFn: () => fecthGitHubUser(submittedUserName),
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
      {data && <UserCard user={data} />}
    </>
  );
};

export default UserSearch;

import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { fecthGitHubUser } from "../api/github";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearchers";

const UserSearch = () => {
  const [userName, setUsername] = useState("");
  const [submittedUserName, setSubmittedUsername] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentUsers");
    return stored ? JSON.parse(stored) : [];
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", submittedUserName],
    queryFn: () => fecthGitHubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) return;
    setSubmittedUsername(trimmed);

    setRecentUsers((prev) => {
      const updated = [trimmed, ...prev.filter((u) => u !== trimmed)];
      return updated.slice(0, 5);
    });
  };

  useEffect(() => {
    localStorage.setItem("recentUsers", JSON.stringify(recentUsers));
  }, [recentUsers]);

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

      {recentUsers.length > 0 && (
        <RecentSearches
          users={recentUsers}
          onSelect={(userName) => {
            setUsername(userName);
            setSubmittedUsername(userName);
          }}
        />
      )}
    </>
  );
};

export default UserSearch;

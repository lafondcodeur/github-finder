import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { fecthGitHubUser, searchGitHubUser } from "../api/github";
import UserCard from "./UserCard";
import RecentSearches from "./RecentSearchers";
import { useDebounce } from "use-debounce";
import SuggestionsDropdown from "./SuggestionsDropDown";

const UserSearch = () => {
  const [userName, setUsername] = useState("");
  const [submittedUserName, setSubmittedUsername] = useState("");
  const [recentUsers, setRecentUsers] = useState<string[]>(() => {
    const stored = localStorage.getItem("recentUsers");
    return stored ? JSON.parse(stored) : [];
  });

  const [debouncedUsername] = useDebounce(userName, 300);
  const [showSuggestions, setShowSuggestion] = useState(false);

  //Query to fetch specific user
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["user", submittedUserName],
    queryFn: () => fecthGitHubUser(submittedUserName),
    enabled: !!submittedUserName,
  });

  //Query to fetch suggestions to user search
  const { data: suggestions } = useQuery({
    queryKey: ["github-user-suggestions", debouncedUsername],
    queryFn: () => searchGitHubUser(debouncedUsername),
    enabled: debouncedUsername.length > 1,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = userName.trim();
    if (!trimmed) return;
    setSubmittedUsername(trimmed);
    setUsername("");

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
        <div className="dropdown-wrapper">
          <input
            type="text"
            placeholder="Enter GitHub Username...."
            value={userName}
            onChange={(e) => {
              const val = e.target.value;
              setUsername(val);
              setShowSuggestion(val.trim().length > 1);
            }}
          />
          {showSuggestions && suggestions?.length > 0 && (
            <SuggestionsDropdown
              suggestions={suggestions}
              show={showSuggestions}
              onSelect={(selected) => {
                setUsername(selected);
                setShowSuggestion(false);
                if (submittedUserName !== selected) {
                  setSubmittedUsername(selected);
                } else {
                  refetch();
                }

                setRecentUsers((prev) => {
                  const updated = [
                    selected,
                    ...prev.filter((u) => u !== selected),
                  ];
                  return updated.slice(0, 5);
                });
              }}
            />
          )}
        </div>

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

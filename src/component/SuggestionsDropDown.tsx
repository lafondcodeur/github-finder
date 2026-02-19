import type { GitHubUser } from "../type";

type suggestionsDropdownProps = {
  suggestions: GitHubUser[];
  show: boolean;
  onSelect: (username: string) => void;
};

const SuggestionsDropdown = ({
  suggestions,
  show,
  onSelect,
}: suggestionsDropdownProps) => {
  if (!show || suggestions.length == 0) return null;
  return (
    <ul className="suggestions">
      {suggestions.slice(0, 5).map((user: GitHubUser) => (
        <li
          key={user.login}
          onClick={() => {
            onSelect(user.login);
          }}
        >
          <img src={user.avatar_url} alt={user.login} className="avatar-xs" />
          {user.login}
        </li>
      ))}
    </ul>
  );
};

export default SuggestionsDropdown;

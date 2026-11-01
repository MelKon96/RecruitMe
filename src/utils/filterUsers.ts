import type { IUser } from '../types/user';

export const filterUsers = (users: IUser[], search: string): IUser[] => {
  const searchWords = search.trim().toLowerCase().split(/\s+/).filter(Boolean);

  if (searchWords.length === 0) {
    return users;
  }

  return users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const skills = user.skills.map((skill) => skill.toLowerCase());

    return searchWords.every(
      (word) =>
        fullName.includes(word) || skills.some((skill) => skill.includes(word)),
    );
  });
};

import type { IUser } from '../types/user';
import type { IRawUser } from '../types/rawUser';
import { adaptUser } from '../utils/adapters';

interface IRawUsersResponse {
  users: IRawUser[];
  total: number;
  skip: number;
  limit: number;
}

const requestJson = async <T>(
  url: string,
  signal?: AbortSignal,
  errorMessage = 'Не удалось загрузить данные',
): Promise<T> => {
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
};

export const queryKeys = {
  user: (id: number) => ['user', id] as const,
  usersInfinite: ['users-infinite'] as const,
};

export const fetchUsers = async ({
  signal,
  limit = 10,
  skip = 0,
}: {
  signal?: AbortSignal;
  limit?: number;
  skip?: number;
} = {}): Promise<{ users: IUser[]; total: number }> => {
  const data = await requestJson<IRawUsersResponse>(
    `https://dummyjson.com/users?limit=${limit}&skip=${skip}`,
    signal,
  );

  return {
    users: data.users.map(adaptUser),
    total: data.total,
  };
};

export const fetchUsersPage = async ({
  pageParam = 0,
  signal,
}: {
  pageParam?: number;
  signal?: AbortSignal;
}) => {
  const limit = 10;
  const result = await fetchUsers({ signal, limit, skip: pageParam });
  const nextSkip = pageParam + limit;

  return {
    users: result.users,
    nextSkip: nextSkip < result.total ? nextSkip : null,
    total: result.total,
  };
};

export const fetchUserById = async (
  id: number,
  { signal }: { signal?: AbortSignal } = {},
): Promise<IUser> => {
  const user = await requestJson<IRawUser>(
    `https://dummyjson.com/users/${id}`,
    signal,
    'Пользователь не найден',
  );

  return adaptUser(user);
};

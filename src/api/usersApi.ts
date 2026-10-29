import type { IUser } from '../types/user';
import { adaptUser } from '../utils/adapters';

// Здесь можно импортировать общий тип сырого пользователя из одного модуля с адаптером, а не описывать IRawUser второй раз.
interface IRawUser {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  email: string;
  phone: string;
  company?: {
    title?: string;
    department?: string;
    name?: string;
  };
}

interface IRawUsersResponse {
  users: IRawUser[];
  total: number;
  skip: number;
  limit: number;
}

// 1. Обычный метод для MessagesPage и UserDetailPage (принимает limit и skip опционально)
export const fetchUsers = async ({
  signal,
  limit = 10,
  skip = 0,
}: { signal?: AbortSignal; limit?: number; skip?: number } = {}): Promise<{ users: IUser[]; total: number }> => {
  const response = await fetch(`https://dummyjson.com/users?limit=${limit}&skip=${skip}`, {
    signal,
  });

  // Здесь можно вынести проверку response.ok и response.json() в requestJson<T>(url, signal): то же самое повторяется в fetchUserById.
  if (!response.ok) {
    throw new Error('Не удалось загрузить пользователей');
  }

  const data: IRawUsersResponse = await response.json();

  return {
    users: data.users.map(adaptUser),
    total: data.total,
  };
};


// Здесь можно завести queryKeys (users, user(id), usersInfinite) рядом с функциями API: сейчас ключи ['users'], ['user', id] и ['users-infinite'] размазаны по страницам.
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
  const response = await fetch(`https://dummyjson.com/users/${id}`, { signal });

  if (!response.ok) {
    throw new Error('Пользователь не найден');
  }

  const user: IRawUser = await response.json();

  return adaptUser(user);
};
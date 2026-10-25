import type { IUser } from '../types/user';
import { adaptUser } from '../utils/adapters';

// Ответ от DummyJSON
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

// Получение списка пользователей
export const fetchUsers = async (): Promise<IUser[]> => {
  const response = await fetch('https://dummyjson.com/users?limit=50');

  if (!response.ok) {
    throw new Error('Не удалось загрузить пользователей');
  }

  const data: IRawUsersResponse = await response.json();

  return data.users.map(adaptUser);
};

// Получение одного пользователя по ID
export const fetchUserById = async (id: number): Promise<IUser> => {
  const response = await fetch(`https://dummyjson.com/users/${id}`);

  if (!response.ok) {
    throw new Error('Пользователь не найден');
  }

  const user: IRawUser = await response.json();

  return adaptUser(user);
};

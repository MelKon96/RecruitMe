import type { IUser } from '../types/user';
import { adaptUser } from '../utils/adapters';

// ответ от DummyJSON
interface IRawUsersResponse {
  users: Array<{
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
  }>;
  total: number;
  skip: number;
  limit: number;
}

// Функция для запроса всех пользователей
export const fetchUsers = async (): Promise<IUser[]> => {
  const response = await fetch('https://dummyjson.com/users?limit=50');

  if (!response.ok) {
    throw new Error('Failed to fetch users from API');
  }

  const data: IRawUsersResponse = await response.json();

  // Преобразуем каждого сырого пользователя через наш адаптер
  return data.users.map(adaptUser);
};

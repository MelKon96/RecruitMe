export interface IRawUser {
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
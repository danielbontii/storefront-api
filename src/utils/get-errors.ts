import { Category } from '../types/category';
import { User, UserDetails } from '../types/user';

const getInvalidDetailsError = async (
  fn: (userDetails: UserDetails) => Promise<User>,
  details: UserDetails
): Promise<unknown> => {
  let error;

  try {
    await fn(details);
  } catch (e) {
    error = e;
  }

  return error;
};

const getInvalidIdError = async (
  fn: (id: string) => Promise<User>,
  id: string
): Promise<unknown> => {
  let error;

  try {
    await fn(id);
  } catch (e) {
    error = e;
  }

  return error;
};

const getInvalidAuthPasswordError = (
  fn: (password: string) => string,
  password: string
): unknown => {
  let error;

  try {
    fn(password);
  } catch (e) {
    error = e;
  }

  return error;
};

const getCategoryError = async (
  fn: (category: string) => Promise<Category>,
  name: string
): Promise<unknown> => {
  let error;

  try {
    await fn(name);
  } catch (e) {
    error = e;
  }

  return error;
};

export {
  getInvalidDetailsError,
  getInvalidAuthPasswordError,
  getInvalidIdError,
  getCategoryError
};

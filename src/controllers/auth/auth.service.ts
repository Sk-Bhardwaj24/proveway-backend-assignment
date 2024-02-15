import { queryInterface } from '../../helpers/interface.helper';
import { Users } from '../../models/user.model';

export const findUser = async (query: queryInterface, field?: object): Promise<any> => {
  return await Users.findOne(query, field);
};
export const registerUser = async (data: object): Promise<any> => {
  return await Users.create(data);
};

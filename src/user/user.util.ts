import { ReqResUserDto } from 'src/apis/req-res/dtos/req-res-user.dto';
import { User } from './user.schema';

export class UserUtil {
  static mapUsersFromReqResUserDtos(reqResUsers: ReqResUserDto[]): User[] {
    return reqResUsers.map((reqResUser) =>
      this.mapUserfromReqResUserDto(reqResUser),
    );
  }

  static mapUserfromReqResUserDto(reqResUser: ReqResUserDto): User {
    return {
      userId: reqResUser.id,
      email: reqResUser.email,
      firstName: reqResUser.first_name,
      lastName: reqResUser.last_name,
      avatar: reqResUser.avatar,
    } as User;
  }
}

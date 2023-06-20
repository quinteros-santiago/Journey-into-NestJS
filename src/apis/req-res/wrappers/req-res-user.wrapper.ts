import { ReqResUserDto } from '../dtos/req-res-user.dto';
import { Type } from 'class-transformer';

export class ReqResUserWrapper {
  @Type(() => ReqResUserDto)
  readonly data: ReqResUserDto;
}

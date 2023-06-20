import { IsArray, ValidateNested } from 'class-validator';
import { ReqResUserDto } from '../dtos/req-res-user.dto';
import { Type } from 'class-transformer';

export class ReqResUsersWrapper {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReqResUserDto)
  readonly data: ReqResUserDto[];
}

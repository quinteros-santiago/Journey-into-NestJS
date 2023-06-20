import { IsEmail, IsNumber, IsString, IsUrl } from 'class-validator';

export class ReqResUserDto {
  @IsNumber()
  readonly id: number;

  @IsEmail()
  readonly email: string;

  @IsString()
  readonly first_name: string;

  @IsString()
  readonly last_name: string;

  @IsString()
  @IsUrl()
  readonly avatar: string;
}

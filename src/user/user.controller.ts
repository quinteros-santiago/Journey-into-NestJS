import {
  Controller,
  Post,
  Get,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserAvatarService } from './avatar/user-avatar.service';
import { User } from './user.schema';

@Controller('api')
export class UserController {
  constructor(
    private readonly avatarService: UserAvatarService,
    private readonly userService: UserService,
  ) {}

  @Post('users')
  async createUser(): Promise<User[]> {
    return this.userService.createUsers();
  }

  @Get('user/:userId')
  async getUser(@Param('userId', ParseIntPipe) userId: number): Promise<User> {
    return await this.userService.getUser(userId);
  }

  @Get('user/:userId/avatar')
  getUserAvatar(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<string> {
    return this.avatarService.getAvatar(userId);
  }

  @Delete('users')
  async deleteUsers(): Promise<void> {
    await this.userService.deleteUsers();
  }

  @Delete('user/:userId/avatar')
  async deleteUserAvatar(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<void> {
    await this.avatarService.deleteAvatar(userId);
  }
}

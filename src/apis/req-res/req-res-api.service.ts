import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  GatewayTimeoutException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { lastValueFrom, timeout } from 'rxjs';
import { ReqResUserDto } from './dtos/req-res-user.dto';
import { plainToClass } from 'class-transformer';
import { ReqResUserWrapper } from './wrappers/req-res-user.wrapper';
import { validateOrReject } from 'class-validator';
import { ReqResUsersWrapper } from './wrappers/req-res-users.wrapper';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ReqResApiService {
  private readonly logger = new Logger(ReqResApiService.name);
  private readonly reqResBaseUrl: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.reqResBaseUrl = this.configService.get<string>('REQ_RES_URL');
  }

  async getUser(userId: number): Promise<ReqResUserDto> {
    let axiosResponse: AxiosResponse;

    try {
      axiosResponse = await lastValueFrom(
        this.httpService
          .get(`${this.reqResBaseUrl}/users/${userId}`)
          .pipe(timeout(5000)),
      );
    } catch (exception) {
      this.handleGetUserError(exception);
    }
    const userWrapper = plainToClass(ReqResUserWrapper, axiosResponse.data);
    const reqResUser = userWrapper.data;

    try {
      await validateOrReject(reqResUser, {
        whitelist: true,
        validationError: { target: false },
      });
    } catch (exception) {
      this.handleClassValidatorError();
    }
    return reqResUser;
  }

  async getUsersPageable(page: number): Promise<ReqResUserDto[]> {
    let axiosResponse: AxiosResponse;

    try {
      axiosResponse = await lastValueFrom(
        this.httpService
          .get(`${this.reqResBaseUrl}/users?page=${page}`)
          .pipe(timeout(5000)),
      );
    } catch (exception) {
      this.handleGetUsersError(exception);
    }
    const usersWrapper = plainToClass(ReqResUsersWrapper, axiosResponse.data);

    try {
      await validateOrReject(usersWrapper, {
        whitelist: true,
        validationError: { target: false },
      });
    } catch (exception) {
      this.handleClassValidatorError();
    }
    return usersWrapper.data;
  }

  async getAvatar(avatarUrl: string): Promise<Buffer> {
    let axiosResponse: AxiosResponse<ArrayBuffer>;

    try {
      axiosResponse = await lastValueFrom(
        this.httpService
          .get(avatarUrl, { responseType: 'arraybuffer' })
          .pipe(timeout(5000)),
      );
    } catch (exception) {
      this.handleGetAvatarError(exception);
    }
    return Buffer.from(axiosResponse.data);
  }

  private handleGetUserError(exception: any): never {
    if (exception.message && exception.message === 'Timeout has occurred') {
      throw new GatewayTimeoutException('Request to external API timed out', {
        description: 'Gateway Timeout',
      });
    } else if (exception.response && 404 === exception.response.status) {
      throw new NotFoundException('User does not exist on external API.', {
        description: 'Not Found',
      });
    } else {
      this.logException(exception);
      throw new InternalServerErrorException(
        'There was a problem while getting user from external API',
        {
          description: 'Internal Server Error',
        },
      );
    }
  }

  private handleGetUsersError(exception: any): never {
    if (exception.message && exception.message === 'Timeout has occurred') {
      throw new GatewayTimeoutException('Request to external API timed out', {
        description: 'Gateway Timeout',
      });
    } else {
      this.logException(exception);
      throw new InternalServerErrorException(
        'There was a problem while getting users from external API',
        {
          description: 'Internal Server Error',
        },
      );
    }
  }

  private handleGetAvatarError(exception: any): never {
    if (exception.message && exception.message === 'Timeout has occurred') {
      throw new GatewayTimeoutException('Request to external API timed out', {
        description: 'Gateway Timeout',
      });
    } else {
      this.logException(exception);
      throw new InternalServerErrorException(
        'There was a problem while getting avatar from its url',
        {
          description: 'Internal Server Error',
        },
      );
    }
  }

  private handleClassValidatorError(): never {
    throw new BadRequestException(
      `The provided API '${this.reqResBaseUrl}' does not meet the validation requirements. Make sure you provided 'https://reqres.in/api' as the API.`,
      {
        description: 'Bad Request',
      },
    );
  }

  private logException(exception: any) {
    this.logger.error(exception);
  }
}

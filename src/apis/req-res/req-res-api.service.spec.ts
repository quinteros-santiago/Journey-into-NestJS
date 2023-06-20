import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { ReqResApiService } from './req-res-api.service';
import { AxiosResponse } from 'axios';
import {
  BadRequestException,
  GatewayTimeoutException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

describe('ReqResApiService', () => {
  let service: ReqResApiService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReqResApiService,
        { provide: HttpService, useValue: { get: jest.fn() } },
        {
          provide: ConfigService,
          useValue: { get: jest.fn(() => 'https://reqres.in/api') },
        },
      ],
    }).compile();

    service = module.get<ReqResApiService>(ReqResApiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUser', () => {
    const userId = 1;

    it('should return a user', async () => {
      const response: AxiosResponse<any> = {
        data: {
          data: {
            id: 1,
            email: 'test@test.com',
            first_name: 'John',
            last_name: 'Doe',
            avatar: 'https://reqres.in/img/faces/1-image.jpg',
          },
        },
        headers: {},
        config: null,
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      const user = await service.getUser(userId);
      expect(user).toEqual(response.data.data);
      expect(httpService.get).toBeCalledWith(
        `https://reqres.in/api/users/${userId}`,
      );
    });

    it('should throw GatewayTimeoutException when request times out', async () => {
      const errorResponse = new Error('Timeout has occurred');
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => errorResponse));

      await expect(service.getUser(userId)).rejects.toThrow(
        GatewayTimeoutException,
      );
      expect(httpService.get).toBeCalledWith(
        `https://reqres.in/api/users/${userId}`,
      );
    });

    it('should throw NotFoundException when user is not found', async () => {
      const errorResponse = { response: { status: 404 } };
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => errorResponse));

      await expect(service.getUser(userId)).rejects.toThrow(NotFoundException);
      expect(httpService.get).toBeCalledWith(
        `https://reqres.in/api/users/${userId}`,
      );
    });

    it('should throw InternalServerErrorException when unknown error occurs', async () => {
      const errorResponse = { response: { status: 500 } };
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => errorResponse));

      await expect(service.getUser(userId)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(httpService.get).toBeCalledWith(
        `https://reqres.in/api/users/${userId}`,
      );
    });

    it('should throw BadRequestException if the user data does not meet validation requirements', async () => {
      const invalidUserResponse: AxiosResponse<any> = {
        data: {
          id: 'not_a_number',
          email: 'not_an_email',
          anyprop: 'first_name missing',
          last_name: null,
          avatar: 'not_an_url',
        },
        headers: {},
        config: null,
        status: 200,
        statusText: 'OK',
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(invalidUserResponse));

      await expect(service.getUser(userId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getUsersPageable', () => {
    const page = 1;

    it('should return users', async () => {
      const response: AxiosResponse<any> = {
        data: {
          data: [
            {
              id: 1,
              email: 'test@test.com',
              first_name: 'John',
              last_name: 'Doe',
              avatar: 'https://reqres.in/img/faces/1-image.jpg',
            },
            {
              id: 2,
              email: 'janet.weaver@reqres.in',
              first_name: 'Janet',
              last_name: 'Weaver',
              avatar: 'https://reqres.in/img/faces/2-image.jpg',
            },
            {
              id: 3,
              email: 'emma.wong@reqres.in',
              first_name: 'Emma',
              last_name: 'Wong',
              avatar: 'https://reqres.in/img/faces/3-image.jpg',
            },
            {
              id: 4,
              email: 'eve.holt@reqres.in',
              first_name: 'Eve',
              last_name: 'Holt',
              avatar: 'https://reqres.in/img/faces/4-image.jpg',
            },
          ],
        },
        headers: {},
        config: null,
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockImplementationOnce(() => of(response));

      const users = await service.getUsersPageable(page);
      expect(users).toEqual(response.data.data);
      expect(httpService.get).toBeCalledWith(
        `https://reqres.in/api/users?page=${page}`,
      );
    });

    it('should throw GatewayTimeoutException when request times out', async () => {
      const errorResponse = new Error('Timeout has occurred');
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => errorResponse));

      await expect(service.getUsersPageable(page)).rejects.toThrow(
        GatewayTimeoutException,
      );
      expect(httpService.get).toBeCalledWith(
        `https://reqres.in/api/users?page=${page}`,
      );
    });

    it('should throw InternalServerErrorException when unknown error occurs', async () => {
      const errorResponse = { response: { status: 500 } };
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => errorResponse));

      await expect(service.getUsersPageable(page)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(httpService.get).toBeCalledWith(
        `https://reqres.in/api/users?page=${page}`,
      );
    });

    it('should throw BadRequestException if the user data does not meet validation requirements', async () => {
      const invalidUserResponse: AxiosResponse<any> = {
        data: {
          data: [
            {
              id: 'not_a_number',
              email: 'not_an_email',
              anyprop: 'first_name missing',
              last_name: null,
              avatar: 'not_an_url',
            },
            {
              id: 'not_a_number',
              email: 'not_an_email',
              anyprop: 'first_name missing',
              last_name: null,
              avatar: 'not_an_url',
            },
            {
              id: 'not_a_number',
              email: 'not_an_email',
              anyprop: 'first_name missing',
              last_name: null,
              avatar: 'not_an_url',
            },
            {
              id: 'not_a_number',
              email: 'not_an_email',
              anyprop: 'first_name missing',
              last_name: null,
              avatar: 'not_an_url',
            },
          ],
        },
        headers: {},
        config: null,
        status: 200,
        statusText: 'OK',
      };

      jest
        .spyOn(httpService, 'get')
        .mockImplementation(() => of(invalidUserResponse));

      await expect(service.getUsersPageable(page)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getAvatar', () => {
    const avatarUrl = 'https://reqres.in/img/faces/1-image.jpg';

    it('should return an avatar', async () => {
      const avatarArrayBuffer = new ArrayBuffer(8);
      const response: AxiosResponse<any> = {
        data: avatarArrayBuffer,
        headers: {},
        config: null,
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'get').mockImplementation(() => of(response));

      const result = await service.getAvatar(avatarUrl);

      expect(httpService.get).toBeCalledWith(
        'https://reqres.in/img/faces/1-image.jpg',
        { responseType: 'arraybuffer' },
      );
      expect(result).toBeInstanceOf(Buffer);
      expect(result).toEqual(Buffer.from(avatarArrayBuffer));
    });

    it('should throw GatewayTimeoutException when request times out', async () => {
      const errorResponse = new Error('Timeout has occurred');
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => errorResponse));

      await expect(service.getAvatar(avatarUrl)).rejects.toThrow(
        GatewayTimeoutException,
      );
      expect(httpService.get).toBeCalledWith(
        'https://reqres.in/img/faces/1-image.jpg',
        { responseType: 'arraybuffer' },
      );
    });

    it('should throw InternalServerErrorException when unknown error occurs', async () => {
      const errorResponse = { response: { status: 500 } };
      jest
        .spyOn(httpService, 'get')
        .mockImplementationOnce(() => throwError(() => errorResponse));

      await expect(service.getAvatar(avatarUrl)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(httpService.get).toBeCalledWith(
        'https://reqres.in/img/faces/1-image.jpg',
        { responseType: 'arraybuffer' },
      );
    });
  });
});

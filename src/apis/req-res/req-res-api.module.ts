import { Module } from '@nestjs/common';
import { ReqResApiService } from './req-res-api.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ReqResApiService],
  exports: [ReqResApiService],
})
export class ReqResApiModule {}

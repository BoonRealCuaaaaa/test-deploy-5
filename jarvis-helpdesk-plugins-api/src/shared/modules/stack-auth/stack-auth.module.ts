import { Module } from '@nestjs/common';

import { HttpRequestContextModule } from '../http-request-context/http-request-context.module';

import { StackAuthService } from './stack-auth.service';

@Module({
  imports: [HttpRequestContextModule],
  providers: [StackAuthService],
  exports: [StackAuthService],
})
export class StackAuthModule {}

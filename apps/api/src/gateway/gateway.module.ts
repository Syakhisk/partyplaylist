import { Module } from '@nestjs/common';
import { MessagingGateway } from 'src/gateway/gateway';
import { GatewaySessionManager } from 'src/gateway/gateway.session';

@Module({
  providers: [GatewaySessionManager, MessagingGateway],
  exports: [MessagingGateway],
})
export class GatewayModule {}

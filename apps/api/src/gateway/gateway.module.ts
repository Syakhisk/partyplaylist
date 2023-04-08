import { Module } from '@nestjs/common';
import { MessagingGateway } from 'src/gateway/gateway';
import { GatewayGuard } from 'src/gateway/gateway.guard';
import { GatewaySessionManager } from 'src/gateway/gateway.session';

@Module({
  providers: [GatewaySessionManager, MessagingGateway, GatewayGuard],
  exports: [GatewaySessionManager, MessagingGateway, GatewayGuard],
})
export class GatewayModule {}

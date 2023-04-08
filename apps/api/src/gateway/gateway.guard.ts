import { Injectable, ExecutionContext, Inject } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GatewaySessionManager } from 'src/gateway/gateway.session';

@Injectable()
export class GatewayGuard extends AuthGuard('firebase-auth') {
  constructor(
    @Inject(GatewaySessionManager)
    private readonly sessionManager: GatewaySessionManager,
  ) {
    super();
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const baseGuardResult = await super.canActivate(context);
    if (!baseGuardResult) return false;

    const { user } = context.switchToHttp().getRequest();
    const socket = this.sessionManager.getUserSocket(user.uid);
    return socket ? true : false;
  }
}

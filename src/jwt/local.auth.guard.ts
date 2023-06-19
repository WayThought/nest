import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
    constructor(private reflector: Reflector) {
        super()
    }

    canActivate(context: ExecutionContext) {
        return super.canActivate(context)
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new UnauthorizedException()
        } else {
            return user
        }
    }
}
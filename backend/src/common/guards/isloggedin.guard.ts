import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  forwardRef,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { UserDocument, User } from 'src/modules/user/schema/user.schema';
import { Model } from 'mongoose';



declare global {
  namespace Express {
    interface Request {
      user: Partial<UserDocument>;
    }
  }
}

@Injectable()
export class IsLoggedInGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = request.cookies.accessToken;

    if (!accessToken) {
      throw new BadRequestException({
        msg: 'Invalid Token',
        code: 'INVALID_TOKEN',
        details: {},
      });
    }

    let verifyToken: any;

    try {
      verifyToken = this.jwtService.verify(accessToken);

      if(!verifyToken.hasOwnProperty('userId')){
        throw new UnauthorizedException({
          msg: 'Invalid JWT Format.',
          code: 'UNAUTHORIZED'
        })
      }

      const user = await this.userModel
        .findById(verifyToken.userId)
        .select('-password');
      if (!user) {
        throw new UnauthorizedException({
          msg: 'Unauthorized',
          code: 'UNAUTHORIZED',
          details: {},
        });
      }

      request.user = user;
    } catch (error) {
      if(error instanceof BadRequestException || error instanceof UnauthorizedException) throw error

      if (error.name === 'TokenExpiredError') {
        throw new UnauthorizedException({
          msg: 'Token Expired',
          code: 'TOKEN_EXPIRED',
          details: {},
        });
      }

      throw new InternalServerErrorException({
        msg: "Internal Server Error.",
        code: 'INTERNAL_SERVER_ERROR',
        error
      })
    }

    return true;
  }
}

import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Put, Req, UseGuards } from '@nestjs/common';
import { AuthTokenGuard } from 'src/auth/guard';
import { UserService } from '../services';
import { IApiResponse } from 'src/common/interface';
import { IResponseUser } from '../interface';
import { UpdatedUserPassDto, UserUpdatedDto } from '../dto';

@Controller('user')
@UseGuards(AuthTokenGuard)
export class UserController {

  constructor(
    private readonly userService: UserService,
  ){}

  @Put(":userId")
  @HttpCode(HttpStatus.OK)
  public async updatedUser(
    @Body() userUpdate: UserUpdatedDto,
    @Param('userId', ParseUUIDPipe) userId: string,
  ) : Promise<IApiResponse<IResponseUser>> {
    const statusCode = HttpStatus.OK;
    const updatedUser = await this.userService.updatedUser(userId,userUpdate);

    return {
       statusCode,
       message: "Usuario actualizado",
       data: {
        user: updatedUser
       }
    }
  }

  @Get("correo/:correo")
  @HttpCode(HttpStatus.OK)
  public async findUserByEmail(
    @Param('correo') correo: string,
  ): Promise<IApiResponse<IResponseUser>> {
    const statusCode = HttpStatus.OK;
    const user = await this.userService.findUserEmail(correo);
    if (!user) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        message: "Usuario no encontrado",
        data: null
      };
    }
    return {
      statusCode,
      message: "Usuario encontrado",
      data: {
        user
      }
    };
  }

  @Put('password/:userId')
  @HttpCode(HttpStatus.OK)
  public async updatedUserPassword(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updPass: UpdatedUserPassDto,
  ): Promise<IApiResponse<IResponseUser>> {
    const statusCode = HttpStatus.OK;
    const updatedPass = await this.userService.updatedPassword(userId,updPass);
    return {
      statusCode,
      message: "Contraseña actualizada",
      data: {
        user: updatedPass
      }
    }
  }

}

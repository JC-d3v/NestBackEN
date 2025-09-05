import { createParamDecorator, ExecutionContext } from "@nestjs/common";
// TODO: AL SER UN DECORATOR COMUN SE RECOMIENDA QUE PASE A COMMON


export const RawHeaders = createParamDecorator(
  (data: string, context: ExecutionContext) => {

    const req = context.switchToHttp().getRequest();
    return req.rawHeaders;

  }
)
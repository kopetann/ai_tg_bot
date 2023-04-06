import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((__, req) => {
  console.log(req);
});

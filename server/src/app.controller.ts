import { Controller, Get, Post, Query, Body } from '@nestjs/common';


@Controller()
export class AppController {
  constructor() {}

  @Get('/api/getTest')
  getTest(@Query() query: any) {
    return query;
  }

  @Post('/api/postTest')
  postTest(@Body() body: any) {
    return { hello: 'world' };
  }
}

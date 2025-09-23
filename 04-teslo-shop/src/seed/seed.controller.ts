import { Controller, Get } from '@nestjs/common';
import { Auth } from '../auth/decorators';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Seed Data')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }


  @Get()
  // @Auth('ADMIN')
  exceuteSeed() {
    return this.seedService.runSeed();

  }
}

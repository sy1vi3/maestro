import { Module } from '@nestjs/common'
import { TeamService } from './team.service'
import { PublishModule } from '../../../utils/publish/publish.module'
import { PrismaModule } from '../../../utils/prisma/prisma.module'
import { TeamPublisher } from './team.broadcast'
import { TeamController } from './team.controller'

@Module({
  controllers: [TeamController],
  imports: [PublishModule, PrismaModule],
  providers: [TeamService, TeamPublisher],
  exports: [TeamService]
})
export class TeamModule {}

import { Payload, Publisher } from '@alecmmiller/nestjs-client-generator'
import { Injectable } from '@nestjs/common'
import { PublishService } from 'src/utils/publish/publish.service'

const DISPLAYS_TOPIC = 'displays'

function makeDisplayTopic (uuid: string): string {
  return `${DISPLAYS_TOPIC}/${uuid}`
}

@Injectable()
export class DisplaysPublisher {
  constructor (private readonly publisher: PublishService) {}
  // @question would `${DISPLAYS_TOPIC}/:uuid` be better here?
  @Publisher('displays/:uuid')
  async publishDisplay (uuid: string, @Payload({}) fieldId: string): Promise<void> {
    const topic = makeDisplayTopic(uuid)
    await this.publisher.broadcast(topic, fieldId)
  }
}

import { AUTH_TYPE, EventCode, EventStage, PathComponent, SetupStage } from '@18x18az/rosetta'
import { InputProcessor, SingleModule, addSimpleSingleBroadcast, addSimpleSinglePostHandler, addSimpleSingleSubscriber } from '../../components'

const processor: InputProcessor<SetupStage> = (input, current) => {
  const eventStage = input.get(PathComponent.EVENT_STATE) as EventStage | undefined
  const code = input.get(PathComponent.EVENT_CODE) as EventCode | undefined

  if (eventStage !== undefined && eventStage !== EventStage.SETUP) {
    return SetupStage.NONE
  }

  if (current === undefined && eventStage === EventStage.SETUP) {
    return SetupStage.EVENT_CODE
  }

  if (current === SetupStage.EVENT_CODE && code !== undefined) {
    if (code.eventCode === 'test') {
      console.log('Faking teams without TM')
      return SetupStage.DONE
    }
  }
}

export function setupEventSetup (): void {
  const module = new SingleModule(PathComponent.SETUP_STAGE, processor)

  addSimpleSingleSubscriber(module, PathComponent.EVENT_STATE)
  addSimpleSinglePostHandler(module, PathComponent.EVENT_CODE, AUTH_TYPE.LOCAL)

  addSimpleSingleBroadcast(module, PathComponent.SETUP_STAGE)
}

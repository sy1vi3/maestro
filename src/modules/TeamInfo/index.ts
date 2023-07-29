import { AUTH_TYPE, MessagePath, PathComponent, TeamInfo, TeamInfoTable } from '@18x18az/rosetta'
import { BroadcastBuilder, InputProcessor, SingleModule, addBroadcastOutput, addSimpleSingleBroadcast, addSimpleSingleDatabase, addSimpleSinglePostHandler } from '../../components'

interface Input {
  [PathComponent.TEAM_INFO]: TeamInfo[]
}

const processor: InputProcessor<Input, TeamInfoTable> = (input, current) => {
  const teams = input.teamInfo
  if (teams !== undefined) {
    const output: TeamInfoTable = {}
    teams.forEach((team, index) => {
      const identifier = index.toString()
      output[identifier] = team
    })
    console.log('team info received')
    return output
  }
}

const teamListBroadcaster: BroadcastBuilder<TeamInfoTable> = (identifier, value) => {
  const topic: MessagePath = [[], PathComponent.TEAM_LIST]
  const payload = Object.keys(value)

  return [topic, payload]
}

export async function setupTeamInfo (): Promise<void> {
  const module = new SingleModule<Input, TeamInfoTable>(PathComponent.TEAM_INFO, processor)

  addSimpleSinglePostHandler(module, PathComponent.TEAM_INFO, AUTH_TYPE.SERVICE)
  addSimpleSingleBroadcast(module, PathComponent.TEAM_INFO)
  addBroadcastOutput(module, teamListBroadcaster)

  await addSimpleSingleDatabase(module, undefined)
  console.log('Team Info module loaded')
}
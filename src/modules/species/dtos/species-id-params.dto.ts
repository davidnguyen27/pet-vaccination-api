import { IsUUID } from 'class-validator'

export class SpeciesIdParamsDto {
  @IsUUID()
  id!: string
}

import { IsUUID } from 'class-validator'

export class VetProfileIdParamsDto {
  @IsUUID()
  id!: string
}

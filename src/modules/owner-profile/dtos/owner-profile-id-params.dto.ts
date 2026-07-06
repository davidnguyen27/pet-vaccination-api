import { IsUUID } from 'class-validator'

export class OwnerProfileIdParamsDto {
  @IsUUID()
  id!: string
}

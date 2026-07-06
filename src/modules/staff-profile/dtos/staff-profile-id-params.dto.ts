import { IsUUID } from 'class-validator'

export class StaffProfileIdParamsDto {
  @IsUUID()
  id!: string
}

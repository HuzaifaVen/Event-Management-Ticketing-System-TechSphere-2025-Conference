import { IsBoolean, IsOptional, IsString } from "class-validator"
import { Column, Unique } from "typeorm"

export class CreateTicketDto {

    @IsString()
    eventId: string

    @IsString()
    pricingId: string

    // @IsString()
    // userId: string
    // @Column({ unique: true })
    // qrCode: string

    @IsOptional()
    @IsString()
    qrCode: string


    @IsOptional()
    @IsBoolean()
    isUsed: boolean
}

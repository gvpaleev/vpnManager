import { IsOptional, IsString } from 'class-validator';

export class CreateAccessKeyDto {
    @IsString()
    uid: string;

    // @IsString()
    // moneroAccountIndex: string;
}
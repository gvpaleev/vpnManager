import { IsOptional, IsString } from 'class-validator';

export class GetAccessKeyDto {
    @IsString()
    uid: string;

    // @IsString()
    // moneroAccountIndex: string;
}
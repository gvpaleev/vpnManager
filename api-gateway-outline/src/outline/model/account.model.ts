import { Prop } from '@typegoose/typegoose';
import { TimeStamps, Base } from '@typegoose/typegoose/lib/defaultClasses';
import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

class AccessKey {

    @IsString()
    @Prop()
    validUntil: Date

    @Prop()
    stause: boolean

    @IsString()
    @Prop()
    id: string;

    @IsString()
    @Prop()
    name: string;

    @IsString()
    @Prop()
    password: string;

    @IsString()
    @Prop()
    port: string;

    @IsString()
    @Prop()
    method: string;

    @IsString()
    @Prop()
    accessUrl: string;

}

export interface AccountModel extends Base { }
export class AccountModel extends TimeStamps {

    @IsString()
    @Prop({ unique: true })
    uid: string;

    // @IsNumber()
    // @Prop()
    // balanceRub: number;

    // @IsNumber()
    // @Prop()
    // balanceMonero: number;

    @IsOptional()
    @IsArray()
    @Prop({ type: () => [AccessKey] })
    accessKeys: AccessKey[];

    // @IsArray()
    // @Type(() => AccessKey)
    // @Prop({ type: () => [AccessKey], _id: false })
    // accessKeys: AccessKey[];

    // @IsOptional()
    // @Prop()
    // balanceRub?: string;
}
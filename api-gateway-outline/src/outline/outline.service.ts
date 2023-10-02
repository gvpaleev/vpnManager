import { Injectable } from '@nestjs/common';
import { CreateAccessKeyDto } from './dto/GetAccessKey.dto';
import { AccountModel } from './model/account.model';
import { InjectModel } from 'nestjs-typegoose';
import { ModelType } from 'typegoose';
import axios from 'axios';
import * as https from 'https';


import { ConfigService } from '@nestjs/config';
import { GetAccessKeyDto } from './dto/CreateAccessKey.dto copy';

const agent = new https.Agent({
    rejectUnauthorized: false,
})

@Injectable()
export class OutlineService {
    constructor(
        @InjectModel(AccountModel)
        private readonly accountModel: ModelType<AccountModel>,
        private readonly configService: ConfigService
    ) { }

    async createAccessKey(dto: CreateAccessKeyDto) {
        let account = await this.getAccount(dto.uid);

        let response = await axios({
            method: 'post',
            url: `${this.configService.get('OUTLINE_HOSY')}/access-keys`,
            httpsAgent: agent,
        });
        let accessKeys = {
            validUntil: new Date(),
            stause: false,
            ...response.data
        }

        account.accessKeys.push(accessKeys);
        account.save();

        return accessKeys
    }

    async getAccessKeys(dto: GetAccessKeyDto) {
        let account = await this.getAccount(dto.uid);

        return account.accessKeys
    }


    ///@@@@@@@@@@
    async getAccount(uid) {
        let account = await this.accountModel.findOne({ uid: uid }).exec();
        if (!account)
            return this.creatAccount(uid)
        return account
    }

    async creatAccount(uid: string) {
        return await this.accountModel.create({
            uid: uid,
            accessKeys: []
        });
    }

}

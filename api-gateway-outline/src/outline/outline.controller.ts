import { Body, Controller, Post } from '@nestjs/common';
import { OutlineService } from './outline.service';
import { CreateAccessKeyDto } from './dto/GetAccessKey.dto';
import { GetAccessKeyDto } from './dto/CreateAccessKey.dto copy';

@Controller()
export class OutlineController {
    constructor(
        private readonly outlineService: OutlineService
    ) { }

    @Post('createAccessKey')
    async createAccessKey(@Body() dto: CreateAccessKeyDto) {

        return await this.outlineService.createAccessKey(dto)

    }

    @Post('getAccessKeys')
    async getAccessKeys(@Body() dto: GetAccessKeyDto) {

        return await this.outlineService.getAccessKeys(dto)


    }


}

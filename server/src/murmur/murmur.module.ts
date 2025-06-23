import { Module } from "@nestjs/common";
import { MurmursService } from "./murmur.service";
import { MurmursController } from "./murmur.controller";


@Module({
    imports: [],
    controllers: [MurmursController],
    providers: [MurmursService],
})
export class MurmursModule {}

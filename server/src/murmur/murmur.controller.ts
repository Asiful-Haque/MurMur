import {
    Controller,
    Post,
    Delete,
    Body,
    Param,
    Get,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { MurmursService } from "./murmur.service";

@Controller("api/me/murmurs")
export class MurmursController {
    constructor(private murmursService: MurmursService) {}

    @Post()
    async create(@Body("userId") userId: number, @Body("content") content: string) {
        if (!userId) {
            throw new HttpException("User ID is required", HttpStatus.BAD_REQUEST);
        }
        const result = await this.murmursService.createMurmur(userId, content);
        return { result };
    }

    @Delete(":id")
    async delete(@Param("id") id: number, @Body("userId") userId: number) {
        if (!userId) {
            throw new HttpException("User ID is required", HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.murmursService.deleteMurmur(userId, id);
            return { result };
        } catch (error: any) {
            const msg = error.message.toLowerCase();
            if (msg.includes("not found")) {
                throw new HttpException(error.message, HttpStatus.NOT_FOUND);
            }
            if (msg.includes("not authorized")) {
                throw new HttpException(error.message, HttpStatus.FORBIDDEN);
            }
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Post("like/:id") //id wise like will be generated
    async likeMurmur(@Param("id") murmurId: number, @Body("userId") userId: number) {
        if (!userId) {
            throw new HttpException("User ID is required", HttpStatus.BAD_REQUEST);
        }

        const result = await this.murmursService.likeMurmur(userId, murmurId);
        return { result };
    }

    @Get("likes/:id") //for timeline and information
    async getLikes(@Param("id") murmurId: number) {
        const result = await this.murmursService.getLikesForMurmur(murmurId);
        return { result };
    }

    @Get("/usersmurmurs/:id")
    async getUserMurmurs(@Param("id") id: number) {
        return await this.murmursService.getMurmursByUser(id);
    }

    @Get("/userprofile/:id")
    async getUserById(@Param("id") id: number) {
        try {
            const user = await this.murmursService.findById(id);
            if (!user) {
                throw new HttpException("User not found", HttpStatus.NOT_FOUND);
            }
            return user;
        } catch (error: any) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}

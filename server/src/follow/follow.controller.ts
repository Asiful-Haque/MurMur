import { Controller, Get, Param, Post, Delete, Body, HttpException, HttpStatus } from "@nestjs/common";
import { FollowService } from "./follow.service";


@Controller("api/follow")
export class FollowController {
    constructor(private followService: FollowService) {}

    @Post() //User will be followed through this
    async follow(@Body() body: { followerId: number; followeeId: number }) {
        try {
            const result = await this.followService.followUser(body.followerId, body.followeeId);
            return result;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    @Delete() //User will be unfollowed through this
    async unfollow(@Body() body: { followerId: number; followeeId: number }) {
        try {
            const result = await this.followService.unfollowUser(body.followerId, body.followeeId);
            return result;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
        }
    }

    // Follow count will be shown for user info
    @Get("/count/following/:id")
    async getFollowCount(@Param("id") id: number) {
        return await this.followService.getFollowCount(+id);
    }

    // Followed count will be shown for user info
    @Get("/count/followed/:id")
    async getFollowedCount(@Param("id") id: number) {
        return await this.followService.getFollowedCount(+id);
    }
}

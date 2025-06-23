import { Controller, Get, Query } from "@nestjs/common";
import { TimelineService } from "./timeline.service";


@Controller("/api/timeline")
export class TimelineController {
    constructor(private timelineService: TimelineService) {}

    @Get()
    async getTimeline(@Query("page") page = "1", @Query("limit") limit = "10") {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const currentUserId = 1;

        const result = await this.timelineService.getMurmurs(currentUserId, pageNum, limitNum);
        return result;
    }
}

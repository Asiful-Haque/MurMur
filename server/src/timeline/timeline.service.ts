import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class TimelineService {
    constructor(private dataSource: DataSource) {}

    async getMurmurs(currentUserId: number, page: number, limit: number) {
        const offset = (page - 1) * limit;

        // SQL to get murmurs only from users followed by current user
        const sql = `
          SELECT m.id, m.user_id, m.content, m.created_at, u.username 
          FROM murmurs m
          JOIN users u ON m.user_id = u.id
          WHERE m.user_id IN (
            SELECT followee_id FROM follows WHERE follower_id = ?
          )
          ORDER BY m.created_at DESC
          LIMIT ? OFFSET ?
        `;

        const murmurs = await this.dataSource.query(sql, [currentUserId, limit, offset]);

        // get total count for pagination
        const countSql = `
          SELECT COUNT(*) as total
          FROM murmurs m
          WHERE m.user_id IN (
            SELECT followee_id FROM follows WHERE follower_id = ?
          )
        `;

        const countResult = await this.dataSource.query(countSql, [currentUserId]);
        const total = countResult[0]?.total || 0;

        return {
            data: murmurs,
            page,
            limit,
            total,
        };
    }
}

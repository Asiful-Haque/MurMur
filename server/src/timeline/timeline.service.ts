import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class TimelineService {
    constructor(private dataSource: DataSource) {}

    async getMurmurs(page: number, limit: number) {
        const offset = (page - 1) * limit;
        const sql = `
      SELECT m.id, m.user_id, m.content, m.created_at, u.username 
      FROM murmurs m
      JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;

        const murmurs = await this.dataSource.query(sql, [limit, offset]);

        // getting total count for pagination purpose
        const countSql = "SELECT COUNT(*) as total FROM murmurs";
        const countResult = await this.dataSource.query(countSql);
        const total = countResult[0]?.total || 0;

        return {
            data: murmurs,
            page,
            limit,
            total,
        };
    }
}

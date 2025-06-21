import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";

@Injectable()
export class FollowService {
    constructor(private dataSource: DataSource) {}

    async followUser(followerId: number, followeeId: number) {
        //query for following
        try {
            const checkSql = `SELECT id FROM follows WHERE follower_id = ? AND followee_id = ?`;
            const exists = await this.dataSource.query(checkSql, [followerId, followeeId]);

            if (exists.length > 0) {
                //checking already followed or not?
                throw new Error("Already following this user");
            }
            const insertSql = `INSERT INTO follows (follower_id, followee_id, created_at) VALUES (?, ?, NOW())`;
            await this.dataSource.query(insertSql, [followerId, followeeId]);

            return { success: true, message: "Followed successfully" };
        } catch (error: any) {
            throw new Error(`Failed to follow: ${error.message}`);
        }
    }

    async unfollowUser(followerId: number, followeeId: number) {
        //query for unfollowing
        try {
            const deleteSql = `DELETE FROM follows WHERE follower_id = ? AND followee_id = ?`;
            const result = await this.dataSource.query(deleteSql, [followerId, followeeId]);

            return { success: true, message: "Unfollowed successfully" };
        } catch (error: any) {
            throw new Error(`Failed to follow: ${error.message}`);
        }
    }

    async getFollowCount(userId: number) { //see follow count
        const sql = `SELECT COUNT(*) AS count FROM follows WHERE follower_id = ?`;
        const result = await this.dataSource.query(sql, [userId]);
        return { followCount: result[0].count };
    }

    async getFollowedCount(userId: number) {
        //see follower count
        const sql = `SELECT COUNT(*) AS count FROM follows WHERE followee_id = ?`;
        const result = await this.dataSource.query(sql, [userId]);
        return { followedCount: result[0].count };
    }
}

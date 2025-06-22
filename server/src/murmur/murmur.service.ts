import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class MurmursService {
    constructor(private dataSource: DataSource) {}

    async createMurmur(userId: number, content: string) {
        //creating a murmur
        try {
            const sql = "INSERT INTO murmurs (user_id, content, created_at) VALUES (?, ?, NOW())";
            await this.dataSource.query(sql, [userId, content]);
            return { success: true };
        } catch (error: any) {
            throw new Error(`Failed to delete murmur: ${error.message}`);
        }
    }

    async deleteMurmur(userId: number, murmurId: number) {
        //Deleting the murmur only by the creator
        try {
            const checkSql = "SELECT user_id FROM murmurs WHERE id = ?";
            const result = await this.dataSource.query(checkSql, [murmurId]);

            if (result.length === 0) {
                throw new Error("Murmur not found");
            }

            if (result[0].user_id !== userId) {
                throw new Error("Not authorized to delete this murmur");
            }

            const deleteSql = "DELETE FROM murmurs WHERE id = ?";
            await this.dataSource.query(deleteSql, [murmurId]);
            return { success: true };
        } catch (error: any) {
            throw new Error(`Failed to delete murmur: ${error.message}`);
        }
    }

    async likeMurmur(userId: number, murmurId: number) {
        try {
            const existing = await this.dataSource.query(
                //It will check already liked entry
                "SELECT id FROM likes WHERE user_id = ? AND murmur_id = ?",
                [userId, murmurId]
            );

            if (existing.length > 0) {
                return { success: false, message: "Already liked" };
            }

            await this.dataSource.query("INSERT INTO likes (user_id, murmur_id) VALUES (?, ?)", [
                userId,
                murmurId,
            ]);

            return { success: true, message: "Liked successfully" };
        } catch (error: any) {
            throw new Error(`Failed to like murmur: ${error.message}`);
        }
    }

    async getLikesForMurmur(murmurId: number) {
        //just for showing in the timeline with total likes
        try {
            const result = await this.dataSource.query(
                "SELECT user_id FROM likes WHERE murmur_id = ?",
                [murmurId]
            );

            return {
                count: result.length,
                users: result.map((row) => row.user_id), // to see all who liked
            };
        } catch (error: any) {
            throw new Error(`Failed to fetch likes: ${error.message}`);
        }
    }

    async getMurmursByUser(userId: number) {
        const sql = `SELECT * FROM murmurs WHERE user_id = ? ORDER BY created_at DESC`;
        const result = await this.dataSource.query(sql, [userId]);
        return result;
    }
}

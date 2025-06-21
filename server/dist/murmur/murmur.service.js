"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MurmursService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let MurmursService = class MurmursService {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async createMurmur(userId, content) {
        try {
            const sql = "INSERT INTO murmurs (user_id, content, created_at) VALUES (?, ?, NOW())";
            await this.dataSource.query(sql, [userId, content]);
            return { success: true };
        }
        catch (error) {
            throw new Error(`Failed to delete murmur: ${error.message}`);
        }
    }
    async deleteMurmur(userId, murmurId) {
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
        }
        catch (error) {
            throw new Error(`Failed to delete murmur: ${error.message}`);
        }
    }
    async likeMurmur(userId, murmurId) {
        try {
            const existing = await this.dataSource.query("SELECT id FROM likes WHERE user_id = ? AND murmur_id = ?", [userId, murmurId]);
            if (existing.length > 0) {
                return { success: false, message: "Already liked" };
            }
            await this.dataSource.query("INSERT INTO likes (user_id, murmur_id) VALUES (?, ?)", [
                userId,
                murmurId,
            ]);
            return { success: true, message: "Liked successfully" };
        }
        catch (error) {
            throw new Error(`Failed to like murmur: ${error.message}`);
        }
    }
    async getLikesForMurmur(murmurId) {
        try {
            const result = await this.dataSource.query("SELECT user_id FROM likes WHERE murmur_id = ?", [murmurId]);
            return {
                count: result.length,
                users: result.map((row) => row.user_id),
            };
        }
        catch (error) {
            throw new Error(`Failed to fetch likes: ${error.message}`);
        }
    }
};
exports.MurmursService = MurmursService;
exports.MurmursService = MurmursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], MurmursService);
//# sourceMappingURL=murmur.service.js.map
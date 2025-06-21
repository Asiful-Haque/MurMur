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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MurmursController = void 0;
const common_1 = require("@nestjs/common");
const murmur_service_1 = require("./murmur.service");
let MurmursController = class MurmursController {
    constructor(murmursService) {
        this.murmursService = murmursService;
    }
    async create(userId, content) {
        if (!userId) {
            throw new common_1.HttpException("User ID is required", common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.murmursService.createMurmur(userId, content);
        return { result };
    }
    async delete(id, userId) {
        if (!userId) {
            throw new common_1.HttpException("User ID is required", common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.murmursService.deleteMurmur(userId, id);
            return { result };
        }
        catch (error) {
            const msg = error.message.toLowerCase();
            if (msg.includes("not found")) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.NOT_FOUND);
            }
            if (msg.includes("not authorized")) {
                throw new common_1.HttpException(error.message, common_1.HttpStatus.FORBIDDEN);
            }
            throw new common_1.HttpException(error.message, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async likeMurmur(murmurId, userId) {
        if (!userId) {
            throw new common_1.HttpException("User ID is required", common_1.HttpStatus.BAD_REQUEST);
        }
        const result = await this.murmursService.likeMurmur(userId, murmurId);
        return { result };
    }
    async getLikes(murmurId) {
        const result = await this.murmursService.getLikesForMurmur(murmurId);
        return { result };
    }
};
exports.MurmursController = MurmursController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)("userId")),
    __param(1, (0, common_1.Body)("content")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "delete", null);
__decorate([
    (0, common_1.Post)("like/:id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "likeMurmur", null);
__decorate([
    (0, common_1.Get)("likes/:id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MurmursController.prototype, "getLikes", null);
exports.MurmursController = MurmursController = __decorate([
    (0, common_1.Controller)("api/me/murmurs"),
    __metadata("design:paramtypes", [murmur_service_1.MurmursService])
], MurmursController);
//# sourceMappingURL=murmur.controller.js.map
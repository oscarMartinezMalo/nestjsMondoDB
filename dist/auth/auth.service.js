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
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
let AuthService = class AuthService {
    constructor(userModel, tokenModel) {
        this.userModel = userModel;
        this.tokenModel = tokenModel;
    }
    async createAccount(email, password) {
        const userExits = await this.userModel.findOne({ email: email });
        if (userExits) {
            throw new common_1.ForbiddenException('User already exits');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new this.userModel({
            email: email,
            password: hashedPassword,
            role: 'Subscriber'
        });
        const result = await newUser.save();
        return result.id;
    }
    async logIn(email, password) {
        const userStored = await this.userModel.findOne({ email: email });
        if (!userStored) {
            throw new common_1.ForbiddenException('User not found');
        }
        ;
        const validPass = await bcrypt.compare(password, userStored.password);
        if (!validPass) {
            throw new common_1.ForbiddenException('Wrong Password try again!!!');
        }
        const accessToken = this.generateAccessToken(userStored.id, userStored.email, userStored.role);
        const refreshToken = jwt.sign({ user: { id: userStored.id, email: userStored.email, role: userStored.role } }, process.env.REFRESH_TOKEN_SECRET);
        this.saveRefreshToken(refreshToken);
        return { accessToken: accessToken, refreshToken: refreshToken, id: userStored.id, email: userStored.email, role: userStored.role };
    }
    async resetPassword(user, currentPassword, newPassword) {
        const userStored = await this.userModel.findById(user.id);
        if (!userStored) {
            throw new common_1.ForbiddenException('User no exits');
        }
        const validPass = await bcrypt.compare(currentPassword, userStored.password);
        if (!validPass) {
            throw new common_1.ForbiddenException('Wrong Password try again!!!');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const result = await userStored.updateOne({ password: hashedPassword });
        if (!result) {
            throw new common_1.ForbiddenException('Wrong Password try again!!!');
        }
        const accessToken = this.generateAccessToken(userStored.id, userStored.email, userStored.role);
        const refreshToken = jwt.sign({ user: { id: userStored.id, email: userStored.email, role: userStored.role } }, process.env.REFRESH_TOKEN_SECRET);
        this.saveRefreshToken(refreshToken);
        return { accessToken: accessToken, refreshToken: refreshToken, id: userStored.id, email: userStored.email, role: userStored.role };
    }
    async saveRefreshToken(token) {
        const newRefreshToken = new this.tokenModel({ token: token });
        await newRefreshToken.save();
    }
    async getNewAccessToken(refreshToken) {
        if (!refreshToken)
            throw new common_1.ForbiddenException('Access denied');
        const refTok = await this.tokenModel.findOne({ token: refreshToken });
        if (!refTok) {
            throw new common_1.ForbiddenException('Access denied');
        }
        try {
            const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = this.generateAccessToken(verified.user.id, verified.user.email, verified.user.role);
            return { accessToken: newAccessToken };
        }
        catch (error) {
            throw new common_1.ForbiddenException('Access denied');
        }
    }
    generateAccessToken(userId, userEmail, userRole) {
        return jwt.sign({ id: userId, email: userEmail, role: userRole }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '6000s' });
    }
    async logOut(refreshToken) {
        const result = await this.tokenModel.deleteOne({ token: refreshToken }).exec();
        if (result.n === 0) {
            throw new common_1.NotFoundException('Could not find token');
        }
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel('User')),
    __param(1, mongoose_1.InjectModel('Token')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map
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
exports.TaskGroup = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Task_1 = require("./Task");
let TaskGroup = class TaskGroup {
};
exports.TaskGroup = TaskGroup;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
    __metadata("design:type", String)
], TaskGroup.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskGroup.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "text", nullable: true }),
    __metadata("design:type", String)
], TaskGroup.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, user => user.taskGroups),
    __metadata("design:type", User_1.User)
], TaskGroup.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_1.Task, task => task.group),
    __metadata("design:type", Array)
], TaskGroup.prototype, "tasks", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], TaskGroup.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], TaskGroup.prototype, "updatedAt", void 0);
exports.TaskGroup = TaskGroup = __decorate([
    (0, typeorm_1.Entity)()
], TaskGroup);

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
exports.Cart = exports.CartStatus = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const cart_item_entity_1 = require("./cart-item.entity");
var CartStatus;
(function (CartStatus) {
    CartStatus["ACTIVE"] = "active";
    CartStatus["ABANDONED"] = "abandoned";
    CartStatus["CONVERTED"] = "converted";
})(CartStatus || (exports.CartStatus = CartStatus = {}));
let Cart = class Cart {
    get isEmpty() {
        return this.totalItems === 0;
    }
    get isExpired() {
        return this.expiresAt ? new Date() > this.expiresAt : false;
    }
    get canCheckout() {
        return this.status === CartStatus.ACTIVE && !this.isEmpty && !this.isExpired;
    }
    get subtotal() {
        if (!this.items)
            return 0;
        return this.items.reduce((sum, item) => sum + item.totalPrice, 0);
    }
    get itemCountValue() {
        return this.itemCount;
    }
    calculateTotals() {
        if (!this.items) {
            this.totalAmount = 0;
            this.totalItems = 0;
            this.itemCount = 0;
            return;
        }
        this.totalAmount = this.subtotal;
        this.totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        this.itemCount = this.totalItems;
    }
};
exports.Cart = Cart;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Cart.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CartStatus,
        default: CartStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Cart.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Cart.prototype, "totalAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Cart.prototype, "totalItems", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Cart.prototype, "itemCount", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'json', nullable: true }),
    __metadata("design:type", Object)
], Cart.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Cart.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Cart.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, user => user.carts, { eager: true }),
    __metadata("design:type", user_entity_1.User)
], Cart.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => cart_item_entity_1.CartItem, cartItem => cartItem.cart, { cascade: true }),
    __metadata("design:type", Array)
], Cart.prototype, "items", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Cart.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Cart.prototype, "updatedAt", void 0);
exports.Cart = Cart = __decorate([
    (0, typeorm_1.Entity)('carts')
], Cart);
//# sourceMappingURL=cart.entity.js.map
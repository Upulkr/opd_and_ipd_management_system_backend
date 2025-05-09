"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client"); // Import User type from Prisma
const prisma = new client_1.PrismaClient();
exports.authMiddleware = {
    verifyToken: (req, res, next) => {
        var _a;
        try {
            const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
            console.log("token", token);
            if (!token) {
                return res.status(403).json({ message: "No token provided" });
            }
            if (!process.env.JWT_SECRET) {
                return res.status(500).json({ message: "JWT secret is not defined" });
            }
            jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, (err, decoded) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return res.status(401).json({ message: "Unauthorized" });
                }
                // Fetch the user from the database using the decoded user ID
                if (!decoded.userId) {
                    return res.status(401).json({ message: "Unauthorized decoded" });
                }
                const user = yield prisma.user.findUnique({
                    where: { id: decoded.userId },
                });
                if (!user) {
                    return res.status(404).json({ message: "User not found" });
                }
                req.user = user; // Attach the full user object to req.user
                next();
            }));
        }
        catch (error) {
            console.log("error", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    },
    checkRole: (roles) => {
        return (req, res, next) => {
            if (!req.user || !roles.includes(req.user.role)) {
                return res
                    .status(403)
                    .json({ message: "Access denied- role not matched" });
            }
            next();
        };
    },
};
exports.default = exports.authMiddleware;

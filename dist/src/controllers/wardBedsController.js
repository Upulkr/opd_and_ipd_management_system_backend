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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeBedStatusForInpatientTable = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
BigInt.prototype.toJSON = function () {
    const int = Number.parseInt(this.toString());
    return int !== null && int !== void 0 ? int : this.toString();
};
const changeBedStatusForInpatientTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { wardNo } = req.params;
        const wardIsExist = yield prisma.ward.findUnique({
            where: {
                wardNo: wardNo,
            },
        });
        if (!wardIsExist) {
            return res.status(404).json({ message: "Ward not found" });
        }
        const wardDetails = yield prisma.$queryRaw `select "noOfBeds","noOfPatients","noOfUsedBeds","noOfFreeBeds" from "Ward" where "wardNo" = ${wardNo}`;
        console.log("wardDetails", wardDetails[0]);
        yield prisma.$queryRaw `update "Ward" set "noOfFreeBeds"=${wardDetails[0].noOfFreeBeds - 1} where "wardNo" = ${wardNo}`;
        yield prisma.$queryRaw `update "Ward" set "noOfUsedBeds"=${wardDetails[0].noOfUsedBeds + 1} where "wardNo" = ${wardNo}`;
        yield prisma.$queryRaw `update "Ward" set "noOfPatients"=${wardDetails[0].noOfPatients + 1} where "wardNo" = ${wardNo}`;
        res.status(200).json({ message: "Bed status changed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: "Error changing bed status" });
    }
});
exports.changeBedStatusForInpatientTable = changeBedStatusForInpatientTable;

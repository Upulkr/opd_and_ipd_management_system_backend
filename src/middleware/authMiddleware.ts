import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { PrismaClient, User } from "@prisma/client"; // Import User type from Prisma

const prisma = new PrismaClient();

declare module "express-serve-static-core" {
  interface Request {
    user?: User; // Use the Prisma User type
  }
}

export const authMiddleware = {
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers["authorization"]?.split(" ")[1];

      if (!token) {
        return res.status(403).json({ message: "No token provided" });
      }

      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT secret is not defined" });
      }

      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded: any) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        // Fetch the user from the database using the decoded user ID
        if (!decoded.userId) {
          return res.status(401).json({ message: "Unauthorized decoded" });
        }

        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        req.user = user; // Attach the full user object to req.user
        next();
      });
    } catch (error) {
      console.log("error", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  checkRole: (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied- role not matched" });
      }
      next();
    };
  },
};

export default authMiddleware;

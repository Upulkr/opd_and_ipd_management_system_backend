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
  /**
   * Middleware to verify the JSON Web Token (JWT) sent in the request header.
   * It ensures that the user is authenticated before allowing access to protected routes.
   */
  verifyToken: (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract the token from the "Authorization" header (format: "Bearer <token>")
      const token = req.headers["authorization"]?.split(" ")[1];
      console.log("token", token);
      
      // If no token is provided, return a 403 Forbidden response
      if (!token) {
        return res.status(403).json({ message: "No token provided" });
      }

      // Check if the JWT secret key is defined in the environment variables
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT secret is not defined" });
      }

      // Verify the token using the secret key
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded: any) => {
        if (err) {
          // If token verification fails (e.g., expired or invalid), return 401 Unauthorized
          return res.status(401).json({ message: "Unauthorized" });
        }

        // Ensure the decoded token contains a user ID
        if (!decoded.userId) {
          return res.status(401).json({ message: "Unauthorized decoded" });
        }

        // Fetch the user from the database using the decoded user ID
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        // If the user does not exist in the database, return 404 Not Found
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        // Attach the full user object to the request object for use in subsequent middleware/routes
        req.user = user; 
        next();
      });
    } catch (error) {
      console.log("error", error);
      // Handle any unexpected errors during the verification process
      return res.status(500).json({ message: "Internal server error" });
    }
  },

  /**
   * Middleware to check if the authenticated user has one of the required roles.
   * @param roles - An array of allowed roles for the route.
   */
  checkRole: (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      // Check if user is attached to request and if their role is in the allowed list
      if (!req.user || !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "Access denied- role not matched" });
      }
      // If role matches, proceed to the next middleware or route handler
      next();
    };
  },
};

export default authMiddleware;

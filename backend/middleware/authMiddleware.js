// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//     try {
//         const authHeader = 
//         req.headers.authorization;

//         if (!authHeader || !authHeader.startsWith("Bearer")) {
//             return res.status(401).json({
//                 message: "Access denied."
//             });
//         }

//         const token = authHeader.split(" ")[1];

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         req.user = decoded;
//         next();
//     } catch (error) {
//         res.status(401).json({
//                 message: "Invalid token."
//             });
//     }
// };

// const jwt = require("jsonwebtoken");

// const authMiddleware = (req, res, next) => {
//   try {
//     // Get Authorization header
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({
//         success: false,
//         message: "Authentication required. Please login."
//       });
//     }

//     // Extract token
//     const token = authHeader.split(" ")[1];

//     // Verify token
//     const decoded = jwt.verify(
//       token,
//       process.env.JWT_SECRET
//     );

//     // Store user information in request
//     req.user = {
//       id: decoded.id,
//       role: decoded.role
//     };

//     next();

//   } catch (error) {
//     console.error("Authentication error:", error.message);

//     if (error.name === "TokenExpiredError") {
//       return res.status(401).json({
//         success: false,
//         message: "Your session has expired. Please login again."
//       });
//     }

//     return res.status(401).json({
//       success: false,
//       message: "Invalid authentication token."
//     });
//   }
// };

// module.exports = authMiddleware;

const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required"
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

module.exports = authMiddleware;
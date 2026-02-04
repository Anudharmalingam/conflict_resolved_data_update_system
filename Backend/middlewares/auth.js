/*const jwt = require("jsonwebtoken")

module.export =(req,res,next) =>{
    const authorization = req.headers.authorization

    const decode = jwt.verify
}*/
const jwt = require("jsonwebtoken");

const secretCode = "SECRETKEY";

const auth = (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res.json({
      message: "Authorization token missing"
    });
  }

  try {
    const token = authorization.split(" ")[1];

    if (!token) {
      return res.json({
        message: "Token not provided"
      });
    }

    const decoded = jwt.verify(token, secretCode);

    req.user = decoded;

    next();

  } catch (error) {
    console.error(error);
    return res.json({
      message: "Invalid or expired token"
    });
  }
};

module.exports = auth;

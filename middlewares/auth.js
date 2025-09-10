function authRoles(role) {
  return (req, res, next) => {
    if (req.session.role === role) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: `you are not authorised as ${role}` });
    }
  };
}
function checkForLogin(req, res, next) {
  if (!req.session.userId) {
    return res.status(403).json({ message: `login first to continue` });
  }
  next();
}
module.exports = { authRoles, checkForLogin };

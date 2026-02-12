import jwt from 'jsonwebtoken';

export function getAuthUtils(cnf, log) {
  return {
    getAuthUser: (req) => {
      const token =
        req.cookies?.token ||
        req.header('Authorization')?.replace('Bearer ', '');
      if (!token) return null;

      try {
        const decoded = jwt.verify(token, cnf.accessTokenSecret);
        return decoded;
      } catch (err) {
        log.error(err);
        return null; // Token invalid or expired
      }
    },
  };
}

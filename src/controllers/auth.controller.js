import { asyncHandler } from '../utils/async-handler.js';
import { getAuthService } from '../services/auth.service.js';
// import { getAuthUtils } from '../utils/auth.utils.js';

export function getAuthController(cnf, log) {
  const cookieOptions = {
    httpOnly: true,
    secure: cnf.isProd, // true on UpCloud
    sameSite: 'lax',
    // This is the magic line for subdomains:
    domain: cnf.isProd ? '.kajlund.com' : 'localhost',
    maxAge: 3600000 * 24, // 24 hours
  };
  const svc = getAuthService(cnf, log);
  // const auth = getAuthUtils(cnf, log);

  return {
    logon: asyncHandler(async (req, res) => {
      const data = req.body;
      const { token, error } = await svc.logonUser(data);
      if (error) return res.status(error.statusCode).json(error);

      res.cookie('token', token, cookieOptions).json({ success: true });
    }),
    logoff: asyncHandler(async (req, res) => {
      res
        .clearCookie('token', {
          domain: cnf.isProd ? '.kajlund.com' : 'localhost',
          path: '/',
        })
        .redirect('/');
    }),
  };
}

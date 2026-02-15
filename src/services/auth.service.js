import { AppError } from '../utils/errors.js';

export function getAuthService(cnf, log) {
  return {
    logonUser: async (data) => {
      const result = { token: '', error: null };

      try {
        const response = await fetch(`${cnf.authUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });

        const payload = await response.json();

        if (!response.ok) {
          result.error = payload;
          log.error(payload, 'Auth relay error:');
        } else {
          result.token = payload.data.accessToken;
        }

        return result;
      } catch (error) {
        log.error(error, 'Auth relay error:');
        result.error = {
          success: false,
          statusCode: 500,
          message: 'Internal server error',
          detail: 'Authentication service unavailable',
        };
        return result;
      }
    },
    getProfile: async (token) => {
      try {
        const response = await fetch(`${cnf.authUrl}/auth/me`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Could not fetch profile');

        const result = await response.json();
        log.info(result);
        return result.data;
      } catch (err) {
        log.error(err, 'Profile relay error:');
        throw new AppError(
          500,
          'Fetching profile failed',
          'Authentication service unavailable',
        );
      }
    },
    updateProfile: async (token, id, profileData) => {
      try {
        const response = await fetch(`${cnf.authUrl}/auth/me/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        });
        if (!response.ok) {
          const errorPayload = await response.json();
          log.error(errorPayload, 'Profile update relay error:');
          throw new AppError(
            response.status,
            'Profile update failed',
            errorPayload.detail || 'Unknown error',
          );
        }

        const result = await response.json();
        log.info(result);
        return result.data;
      } catch (err) {
        log.error(err, 'Profile update relay error:');
        throw new AppError(
          500,
          'Profile update failed',
          'Authentication service unavailable',
        );
      }
    },
  };
}

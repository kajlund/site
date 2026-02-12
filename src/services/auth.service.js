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
  };
}

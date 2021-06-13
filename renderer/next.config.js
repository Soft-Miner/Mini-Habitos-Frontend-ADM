/* eslint-disable @typescript-eslint/no-var-requires */
const SriPlugin = require('webpack-subresource-integrity');
const { createSecureHeaders } = require('next-secure-headers');

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: createSecureHeaders({
          contentSecurityPolicy: {
            directives: {
              defaultSrc: ["'self'"],
              styleSrc: ["'self'", "'unsafe-inline'"],
              styleSrcElem: [
                "'self'",
                "'unsafe-inline'",
                'https://fonts.googleapis.com',
              ],
              fontSrc: [
                "'self'",
                "'unsafe-inline'",
                'https://fonts.googleapis.com',
                'https://fonts.gstatic.com',
              ],
              connectSrc: [
                "'self'",
                'https://mini-habits-prod.herokuapp.com',
                'https://mini-habits-dev.herokuapp.com',
                'https://mini-habitos-dev.s3-sa-east-1.amazonaws.com',
              ],
              imgSrc: [
                'blob:',
                "'self'",
                'https://mini-habitos-dev.s3-sa-east-1.amazonaws.com',
              ],
              baseUri: 'self',
              formAction: 'self',
              frameAncestors: true,
            },
          },
          frameGuard: 'deny',
          noopen: 'noopen',
          nosniff: 'nosniff',
          xssProtection: 'sanitize',
          forceHTTPSRedirect: [
            true,
            { maxAge: 60 * 60 * 24 * 360, includeSubDomains: true },
          ],
          referrerPolicy: 'same-origin',
        }),
      },
    ];
  },
  webpack: (config) => {
    config.target = 'electron-renderer';
    config.output.crossOriginLoading = 'anonymous';
    config.plugins.push(
      new SriPlugin({
        hashFuncNames: ['sha256', 'sha384'],
        enabled: process.env.NODE_ENV === 'development' ? false : true,
      })
    );

    return config;
  },
};

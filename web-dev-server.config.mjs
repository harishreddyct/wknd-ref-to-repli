import { existsSync } from 'node:fs';

/*
 * Local dev-only: rewrites extensionless routes to their .html file
 * (e.g. /adventures/foo -> /adventures/foo.html), matching the pretty-URL
 * behavior the real EDS publishing pipeline provides in production. This
 * file is dev tooling only — see .hlxignore.
 */
export default {
  nodeResolve: false,
  middleware: [
    (ctx, next) => {
      const { path } = ctx;
      if (!path.includes('.') && !path.endsWith('/')) {
        const candidate = `.${path}.html`;
        if (existsSync(candidate)) {
          ctx.url = `${path}.html`;
        }
      }
      return next();
    },
  ],
};

# Production deployment

1. Replace `erp.example.com` in `nginx.conf.example`, then obtain the initial
   certificate with Certbot and install the nginx configuration.
2. Store backend secrets in `/etc/buildroonix/backend.env` with mode `0600`.
3. Run both builds and `npx prisma migrate deploy` from `backend/`.
4. Start `ecosystem.config.cjs` with PM2 using `--env production`, then save the
   PM2 startup configuration.
5. Install the backup service/timer into `/etc/systemd/system`, enable the
   timer, and perform a test restore of the generated custom-format dump.

A backup is not considered operational until a restore has been tested on a
separate PostgreSQL instance.

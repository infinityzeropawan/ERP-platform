#!/usr/bin/env bash
set -euo pipefail

: "${DATABASE_URL:?DATABASE_URL must be set}"
BACKUP_DIR="${BACKUP_DIR:-/var/backups/buildroonix}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
timestamp="$(date -u +%Y%m%dT%H%M%SZ)"

install -d -m 0700 "$BACKUP_DIR"
umask 077
pg_dump --format=custom --no-owner --no-acl "$DATABASE_URL" \
  --file "$BACKUP_DIR/buildroonix-$timestamp.dump"
find "$BACKUP_DIR" -type f -name 'buildroonix-*.dump' -mtime "+$RETENTION_DAYS" -delete

import { Kysely, MysqlDialect, CamelCasePlugin } from "kysely";
import { createPool, type TypeCastField, type PoolOptions } from "mysql2";
import { env } from "../config/env";
import type { Database } from "./types";

// DATABASE_URL is parsed manually (not passed as a raw URI string to mysql2)
// so a `?socket=/path/to/mysql.sock` query param is handled explicitly and
// reliably — production (cPanel/CloudLinux) only accepts local connections
// via Unix socket, not TCP on 3306; see .env.example.
function parseConnectionConfig(databaseUrl: string): PoolOptions {
  const url = new URL(databaseUrl);
  const socketPath = url.searchParams.get("socket");
  const database = url.pathname.replace(/^\//, "");
  const user = decodeURIComponent(url.username);
  const password = url.password ? decodeURIComponent(url.password) : undefined;

  if (socketPath) {
    return { socketPath, user, password, database };
  }
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user,
    password,
    database,
  };
}

// MySQL BOOLEAN is TINYINT(1) on the wire — cast it to a real JS boolean
// explicitly rather than relying on driver defaults (mysql2 returns TINYINT
// as a plain number otherwise, which would silently break every truthy check
// against has_client_profile/verified/is_default/etc. throughout the app).
function typeCast(field: TypeCastField, next: () => unknown) {
  if (field.type === "TINY" && field.length === 1) {
    const value = field.string();
    return value === null ? null : value === "1";
  }
  return next();
}

const pool = createPool({
  ...parseConnectionConfig(env.DATABASE_URL),
  typeCast,
  supportBigNumbers: true,
  decimalNumbers: false, // DECIMAL columns stay fixed-scale strings ("450.00"), not floats
});

export const db = new Kysely<Database>({
  dialect: new MysqlDialect({ pool }),
  // underscoreBetweenUppercaseLetters: by default CamelCasePlugin treats
  // consecutive capitals as one run with no underscore inside it — participantAId
  // was becoming participant_aid instead of the real column, participant_a_id.
  // A live test caught this; only participantAId/participantBId in this schema
  // have back-to-back capitals, so this option only changes those two.
  plugins: [new CamelCasePlugin({ underscoreBetweenUppercaseLetters: true })],
});

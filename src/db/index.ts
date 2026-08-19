import { Kysely, MysqlDialect, CamelCasePlugin } from "kysely";
import { createPool, type TypeCastField, type PoolOptions } from "mysql2";
import { env } from "../config/env";
import type { Database } from "./types";

// decodeURIComponent throws on a raw "%" that isn't a valid percent-escape —
// a real MySQL password containing one crashed the app at startup on a live
// deploy. Most people pasting a password into a connection string don't think
// to percent-encode it first, so treat "isn't validly encoded" as "wasn't
// encoded" and use the raw value, instead of demanding correct encoding.
function decodeUriComponentSafe(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

// DATABASE_URL is parsed manually (not passed as a raw URI string to mysql2)
// so a `?socket=/path/to/mysql.sock` query param is handled explicitly and
// reliably — production (cPanel/CloudLinux) only accepts local connections
// via Unix socket, not TCP on 3306; see .env.example.
//
// A real password containing a URL-structural character (@, :, /, #, ?) makes
// `new URL(...)` itself mis-parse the string — it'll extract some password-
// shaped substring without throwing, just the wrong one, which surfaced on a
// live deploy as MySQL rejecting a valid password ("Access denied ... using
// password: YES"). No amount of decoding fixes a mis-split string, so
// DB_USER/DB_PASSWORD/etc. (see below) exist as a way to skip URL parsing
// entirely rather than requiring the password be correctly percent-encoded.
function parseConnectionConfig(databaseUrl: string): PoolOptions {
  const url = new URL(databaseUrl);
  const socketPath = url.searchParams.get("socket");
  const database = url.pathname.replace(/^\//, "");
  const user = decodeUriComponentSafe(url.username);
  const password = url.password ? decodeUriComponentSafe(url.password) : undefined;

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

// Discrete DB_* vars take priority over DATABASE_URL when DB_USER is set —
// no URL involved, so nothing about the password needs encoding at all. Set
// these instead of DATABASE_URL if the password has an @, :, /, #, or ? in it.
function discreteConnectionConfig(): PoolOptions | undefined {
  const user = process.env.DB_USER;
  if (!user) return undefined;

  const base = { user, password: process.env.DB_PASSWORD, database: process.env.DB_NAME };
  if (process.env.DB_SOCKET) {
    return { ...base, socketPath: process.env.DB_SOCKET };
  }
  return {
    ...base,
    host: process.env.DB_HOST ?? "localhost",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
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
  ...(discreteConnectionConfig() ?? parseConnectionConfig(env.DATABASE_URL)),
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

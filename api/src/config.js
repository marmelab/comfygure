import convict from "convict";

const config = convict({
  port: {
    doc: "Default port for the comfy API (default : 80)",
    format: Number,
    default: 80,
    env: "COMFY_API_PORT",
  },
  logs: {
    debug: {
      doc: "Log level debug (default: false)",
      format: Boolean,
      default: false,
      env: "COMFY_LOG_DEBUG",
    },
  },
  db: {
    client: {
      host: {
        doc: "PostgreSQL host (default : localhost)",
        format: String,
        default: "localhost",
        env: "PGHOST",
      },
      port: {
        doc: "PostgreSQL port (default : 5432)",
        format: Number,
        default: 5432,
        env: "PGPORT",
      },
      database: {
        doc: "PostgreSQL database (default : 5432)",
        format: String,
        default: "comfy",
        env: "PGDATABASE",
      },
      user: {
        doc: "PostgreSQL user (default : postgres)",
        format: String,
        default: "postgres",
        env: "PGUSER",
      },
      password: {
        doc: "PostgreSQL password (default : '')",
        format: String,
        default: "",
        env: "PGPASSWORD",
      },
    },
    pooling: {
      min: {
        doc: "Minimum number of DB client in a pool (default : 0)",
        format: Number,
        default: 0,
        env: "COMFY_DB_MIN_POOLING",
      },
      max: {
        doc: "Maximum number of DB client in a pool (default : 2)",
        format: Number,
        default: 2,
        env: "COMFY_DB_MAX_POOLING",
      },
    },
  },
});

config.validate({ allowed: "strict" });

export default config.getProperties();

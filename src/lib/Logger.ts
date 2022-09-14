enum LogLevel {
  CRITICAL,
  ERROR,
  WARNING,
  NOTICE,
  INFO,
  DEBUG,
}

const logLevelEnv: string = import.meta.env.LOGLEVEL?.toUpperCase() || "DEBUG";
const logLevel: LogLevel = LogLevel[logLevelEnv];

export default function Log(message: any, level: LogLevel) {
  if (level <= logLevel) {
    if (level === LogLevel.WARNING)
      return console.warn(LogLevel[level], message);
    if (level === LogLevel.INFO) return console.info(LogLevel[level], message);
    if (level === LogLevel.ERROR)
      return console.error(LogLevel[level], message);
    return console.log(LogLevel[level], message);
  }
}

export { LogLevel };

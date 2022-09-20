enum LogLevel {
  CRITICAL,
  ERROR,
  WARNING,
  NOTICE,
  INFO,
  DEBUG,
}

class Logger {
  #logLevel: LogLevel;

  constructor(logLevelEnv: string) {
    this.#logLevel = LogLevel[logLevelEnv];
  }

  Log(message: any, level: LogLevel) {
    if (level <= this.#logLevel) {
      if (level === LogLevel.WARNING)
        return console.warn(LogLevel[level], message);
      if (level === LogLevel.INFO)
        return console.info(LogLevel[level], message);
      if (level === LogLevel.ERROR)
        return console.error(LogLevel[level], message);
      return console.log(LogLevel[level], message);
    }
  }
}

export default Logger;
export { LogLevel };

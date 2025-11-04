// Simple custom logger that doesn't require any dependencies
class Logger {
  constructor() {
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3
    };
    this.currentLevel = process.env.NODE_ENV === 'production' ? this.levels.INFO : this.levels.DEBUG;
  }

  shouldLog(level) {
    return level <= this.currentLevel;
  }

  formatMessage(level, message, data) {
    const timestamp = new Date().toISOString();
    const levelStr = Object.keys(this.levels).find(key => this.levels[key] === level);
    
    return {
      timestamp,
      level: levelStr,
      message,
      data: data || {},
      userAgent: navigator.userAgent,
      url: window.location.href
    };
  }

  sendToBackend(logEntry) {
    if (process.env.NODE_ENV === 'production') {
      // Send logs to backend in production
      fetch('http://localhost:3000/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logEntry)
      }).catch(() => {
        // Silent fail for logging errors
      });
    }
  }

  log(level, message, data) {
    if (!this.shouldLog(level)) return;

    const logEntry = this.formatMessage(level, message, data);
    
    // Console output in development
    if (process.env.NODE_ENV !== 'production') {
      const colors = {
        ERROR: 'color: red; font-weight: bold;',
        WARN: 'color: orange; font-weight: bold;',
        INFO: 'color: blue; font-weight: bold;',
        DEBUG: 'color: gray; font-weight: bold;'
      };
      
      console.log(
        `%c[${logEntry.timestamp}] ${logEntry.level}: ${logEntry.message}`,
        colors[logEntry.level] || 'color: black;',
        logEntry.data
      );
    }

    // Send to backend in production
    this.sendToBackend(logEntry);
  }

  error(message, data) {
    this.log(this.levels.ERROR, message, data);
  }

  warn(message, data) {
    this.log(this.levels.WARN, message, data);
  }

  info(message, data) {
    this.log(this.levels.INFO, message, data);
  }

  debug(message, data) {
    this.log(this.levels.DEBUG, message, data);
  }
}

// Create singleton instance
const logger = new Logger();
export default logger;
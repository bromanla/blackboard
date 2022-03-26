import winston from 'winston';

export default winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.cli(),
    winston.format.splat()
  ),
  transports: new winston.transports.Console()
});

export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    uri:
      process.env.MONGODB_URI ||
      'mongodb://user:password@db:27017/mydb?authSource=admin',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'SECRET_KEY',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },
});
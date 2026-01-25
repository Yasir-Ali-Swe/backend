import "dotenv/config";

const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;
const JWT_SECRET = process.env.JWT_SECRET;
const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

export { PORT, DB_CONNECTION, JWT_SECRET, EMAIL, EMAIL_PASSWORD };

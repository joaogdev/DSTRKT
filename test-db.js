require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET (' + process.env.DATABASE_URL.substring(0, 30) + '...)' : 'NOT SET');

const p = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

p.$connect()
  .then(() => console.log('CONNECTED OK'))
  .catch(e => console.error('ERROR:', e.message, '\nCode:', e.code))
  .finally(() => p.$disconnect());

const { defineConfig } = require('prisma/config');
const { PrismaLibSql } = require('@prisma/adapter-libsql');

module.exports = defineConfig({
    datasource: {
        url: "file:./file.db",
    }
});
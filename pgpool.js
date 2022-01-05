const pg = require("pg");

const config = {
	user: "postgres",
	database: "DocumaticTest",
	password: "thatgenzgamer2008",
	host: "localhost",
	port: 5432,
	max: 10,
	idleTimeoutMillis: 50000,
};

var pool = new pg.Pool(config);
module.exports = pool;
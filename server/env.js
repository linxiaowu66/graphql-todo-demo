process.env.PORT = process.env.PORT || 4000 // Port express

// Configuration MongoDB
process.env.DBNAME = process.env.DBNAME || 'graphql-demo';
process.env.DBHOST = process.env.DBHOST || 'localhost';
process.env.DBUSER = process.env.DBUSER || 'user';
process.env.DBPASS = process.env.DBPASS || '';
process.env.DBPORT = process.env.DBPORT || 27017;

// For development
process.env.URI = `mongodb://${process.env.DBHOST}:${process.env.DBPORT}/${process.env.DBNAME}`;

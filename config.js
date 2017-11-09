var config = {};

config.mongoUrl = process.env.MONGO_URL;
config.sercret = process.env.JAM_SECRET;
config.env = process.env.JAM_ENV;

config.createDefault = process.env.JAM_CREATE_DEFAULT || false;
config.defaultUser = process.env.JAM_DEFAULT_USER;
config.defaultPass = process.env.JAM_DEFAULT_PASS;

if (!config.sercret) {
    console.log('Please set secret config variable using JAM_SECRET');
    process.exit()
}

if (!config.env) {
    console.log('JAM_ENV not found, defaulting to "dev", not enforcing authentication');
    config.env = 'dev'
} else if (config.env == 'prod') {
    console.log('In production mode, enforcing authentication')
} else {
    console.log(config.env + ' is not a valid environment.')
    process.exit();
}

if (!config.mongoUrl) {
    console.log('MONGO_URL not found, defaulting to "mongodb://localhost:27017"');
    config.mongoUrl = 'mongodb://localhost:27017';
}

if (config.createDefault) {
    console.log('Going to create default user');
    if (!config.defaultUser || !config.defaultPass) {
        console.log('Default user or pass not set, please set JAM_DEFAULT_USER and JAM_DEFAULT_PASS')
        process.exit();
    }
}


module.exports = config;

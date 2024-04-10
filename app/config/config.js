const _config = {
    serverPort: process.env.PORT,

    dbHolst: process.env.DB_HOST,
    database: process.env.DB,
    dbUser: process.env.DB_USER,
    dbPassword: process.env.DB_PASSWORD,
    frontendURL: process.env.FRONTEND_URL,
    dbTablePrefix: process.env.DB_TABLE_PREFIX,

    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailFrom: process.env.EMAIL_FROM,

    jwtSecrete: process.env.JWT_SECREATE,
    jwtExpiresin: process.env.JWT_EXPIRESIN,


    publishableKey: process.env.PUBLISHABLE_KEY,
    secreteKey: process.env.SECRET_KEY,
}


// exports.config = {
//     get(key) {
//         const value = _config[key];

//         if (!value) {
//             console.error(`The ${key} variable not found. Make sure to pass environment variables.`);
//             process.exit()
//         }
        
//         return value
//     }
// }



exports.config = Object.freeze(_config) 
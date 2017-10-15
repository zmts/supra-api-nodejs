const os = require('os')

module.exports = {

    rootDir: process.env.PWD,
    publicDir: process.env.PWD + '/public',
    photoDir: process.env.PWD + '/public/photos',
    userfilesDir: process.env.PWD + '/public/userfiles',

    url: {
        domain: os.hostname(),
        api: 'api.supersite.com'
    },
    /**
     * roles:
     * 'superuser' - have access to any endpoint
     * 'adminRoles' - have access to any endpoints, except for 'changeUserRole' endpoint
     * 'editorRoles' - have access to any items created by 'user' role Don't have permissions to user Profile
     * 'user' - have access to any public endpoints and own items and profile
     * 'anonymous' - have access only to public endpoints
     */
    roles: {
        superuser: 'superuser',
        adminRoles: ['superuser', 'moderator'],
        editorRoles: ['author', 'photo-author'],
        user: 'user'
    },
    client: {
        host: 'http://localhost',
        port: '3000'
    },

    db: {
        host: 'localhost',
        port: 5432,
        user: 'zandr',
        password: '',
        db_name: 'lovefy3_db',
        charset: 'utf8'
    },

    tokenSecret: {
        access: '908df97bf897gdf8bdf87dbcvbidfjgklrjt84',
        refresh: '32afaf980aab5f6ac492af6c264b34e19beefe',
        encryptpassword: 'h2j35g46h352hjk35jk6356fhj46h646fhrte7tc89b7r7ty'
    }
}

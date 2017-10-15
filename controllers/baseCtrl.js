class BaseController {
    static get name () {
        return 'main'
    }
    
    static get baseActions () {
        return [
            `${this.name}:create`,
            `${this.name}:read`,
            `${this.name}:update`,
            `${this.name}:delete`
        ]
    }
}

module.exports = BaseController
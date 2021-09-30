const { response } = require('express')
const mcache = require('memory-cache')


const cache = _ => {
    return (req,res,next) => {
        let key = "__critica__home"
        cacheBody = mcache.get(key)
        if(cacheBody){
            res.status(200).send(cacheBody)
            return
        }
        next()
    }

}

module.exports ={
    cache
}
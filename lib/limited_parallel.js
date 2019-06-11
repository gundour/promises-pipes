const parallel = require('./parallel')


function limitedParallel(tasks, limit) {
    if(!limit) limit = 1
    let promise = Promise.resolve()
    let results = []
    while(tasks.length) {
        let runningTasks = []
        for (let i = 0; i < limit; i++) {
            runningTasks.push(tasks.shift())
        }

        promise = promise.then(result => {
            if(result) results = results.concat(result)
            return parallel(runningTasks)
        }).catch(err => {
            return Promise.reject(err)
        })
    }

    return new Promise((resolve, reject) => {
        promise.then(result => {
            results = results.concat(result)
            resolve(results)
        }).catch(err => {
            reject(err)
        })
    })

}

module.exports = limitedParallel

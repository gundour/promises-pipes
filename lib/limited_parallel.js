const parallel = require('./parallel')
const StopPipe = require('./stop_pipe')

function limitedParallel(tasks, limit, stopFunction) {
    if(arguments.length < 3) {
        if(typeof limit === 'function') {
            stopFunction = limit
            limit = 1
        }

        if(!limit) limit = 1
    }

    let promise = Promise.resolve()
    let results = []
    while(tasks.length > 0) {
        let runningTasks = []
        for (let i = 0; i < limit; i++) {
            runningTasks.push(tasks.shift())
        }

        promise = promise.then(result => {
            if(result) {
                if(stopFunction) {
                    let stopResponse = result.filter(stopFunction)
                    if(stopResponse.length > 0) throw new StopPipe(stopResponse[0])
                }

                results = results.concat(result)
            }
            return parallel(runningTasks)
        }).catch(err => {
            return Promise.reject(err)
        })
    }

    return new Promise((resolve, reject) => {
        promise.then(result => {
            if(result) {
                if(stopFunction) {
                    let stopResponse = result.filter(stopFunction)
                    if(stopResponse.length > 0) throw new StopPipe(stopResponse[0])
                }

                results = results.concat(result)
            }
            resolve(results)
        }).catch(err => {
            reject(err)
        })
    })

}

module.exports = limitedParallel

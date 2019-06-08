function seriesTimes(task, times) {
    let promise = Promise.resolve()
    let results = []

    for (let i = 0; i < times; i++) {
        promise = promise.then(result => {
            if(result) results.push(result)
            let promiseFunction = task[0]
            let args = task.slice(1)
            if(typeof promiseFunction === 'function')
                return promiseFunction(...args)
            else
                return Promise.resolve()
        }).catch(err => {
            return Promise.reject(err)
        })
    }

    return new Promise((resolve, reject) => {
        promise.then(result => {
            results.push(result)
            resolve(results)
        }).catch(err => {
            reject(err)
        })
    })
}

module.exports = seriesTimes

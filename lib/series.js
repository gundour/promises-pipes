function series(tasks) {
    let promise = Promise.resolve()
    let results = []
    tasks.forEach(task => {
        promise = promise.then(result => {
            if(typeof task !== 'object' && !task.length) {
                return Promise.reject(new Error(`Unsupported task type ${typeof task}, expected Array`))
            }

            if(result) results.push(result)
            let promiseFunction = task.shift()
            if(typeof promiseFunction === 'function')
                return promiseFunction(...task)
            else
                return Promise.resolve()
        }).catch(err => {
            return Promise.reject(err)
        })
    })

    return new Promise((resolve, reject) => {
        promise.then(result => {
            results.push(result)
            resolve(results)
        }).catch(err => {
            reject(err)
        })
    })
}


module.exports = series

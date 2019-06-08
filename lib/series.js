function series(tasks) {
    let promise = Promise.resolve()
    let results = []
    tasks.forEach(task => {
        promise = promise.then(result => {
            if(result) results.push(result)
            let promiseFunction = task.shift()
            return promiseFunction(...task)
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

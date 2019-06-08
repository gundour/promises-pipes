function parallel(tasks) {
    tasks = tasks.filter(task => {
        return typeof task === 'object'
    })

    let promises = tasks.map(task => {
        let promiseFunction = task.shift()
        return promiseFunction(...task)
    })

    return Promise.all(promises)
}


module.exports = parallel

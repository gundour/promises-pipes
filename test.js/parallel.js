var expect = require('chai').expect
const {parallel} = require('..')

let promiseFunction = (i) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if(i > 10) return reject(i)
            resolve(i)
        }, 100);
    })
}


describe('parallel', function () {
    this.timeout(2500)
    it('should export parallel', done => {
        expect(typeof parallel).to.equal('function')
        done()
    })

    it('should execute promises sequentially', done => {
        let testingFunctions = []
        for (let i = 0; i < 10; i++) {
            testingFunctions.push([promiseFunction, i])
        }

        let startTime = new Date().getTime()

        parallel(testingFunctions)
            .then(results => {
                let endTime = new Date().getTime()
                let executionTime = endTime - startTime
                expect(executionTime).to.be.within(100, 200)
                expect(results).to.be.an('array')

                done()
            })
            .catch(done)
    })

    it('should resolve empty result', done => {
        parallel([])
            .then(results => {
                expect(results).to.be.an('array')
                expect(results[0]).to.be.undefined

                done()
            })
            .catch(done)
    })

    it('should reject promise with error', done => {
        let testingFunctions = []
        for (let i = 0; i < 10; i++) {
            testingFunctions.push([promiseFunction, i+2])
        }

        parallel(testingFunctions)
            .then(done)
            .catch(err => {
                expect(err).to.equal(11)
                done()
            })
    })
})

var expect = require('chai').expect
const {series} = require('..')

let promiseFunction = (i) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if(i > 10) return reject(i)
            resolve(i)
        }, 100);
    })
}


describe('series', function () {
    this.timeout(2500)
    it('should export series', done => {
        expect(typeof series).to.equal('function')
        done()
    })

    it('should execute promises sequentially', done => {
        let testingFunctions = []
        for (let i = 0; i < 10; i++) {
            testingFunctions.push([promiseFunction, i])
        }

        let startTime = new Date().getTime()

        series(testingFunctions)
            .then(results => {
                let endTime = new Date().getTime()
                let executionTime = endTime - startTime

                expect(executionTime).to.be.above(1000)
                expect(results).to.be.an('array')

                done()
            })
            .catch(done)
    })

    it('should resolve empty result', done => {
        series([])
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

        series(testingFunctions)
            .then(done)
            .catch(err => {
                expect(err).to.equal(11)
                done()
            })
    })
})

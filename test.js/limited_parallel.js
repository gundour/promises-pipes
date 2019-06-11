var expect = require('chai').expect
const {limitedParallel, StopPipe} = require('..')

let promiseFunction = (i) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if(i > 10) return reject(i)
            resolve(i)
        }, 100);
    })
}


describe('limitedParallel', function () {
    it('should export limitedParallel', done => {
        expect(typeof limitedParallel).to.equal('function')
        done()
    })

    it('should execute promises limited parallel with default limit', done => {
        let testingFunctions = []
        for (let i = 0; i < 10; i++) {
            testingFunctions.push([promiseFunction, i])
        }

        let startTime = new Date().getTime()
        limitedParallel(testingFunctions)
            .then(results => {
                let endTime = new Date().getTime()
                let executionTime = endTime - startTime
                expect(executionTime).to.be.within(1000, 1100)
                expect(results).to.be.an('array')

                done()
            })
            .catch(done)
    })


    it('should execute promises limited parallel with limit = 4', done => {
        let testingFunctions = []
        for (let i = 0; i < 10; i++) {
            testingFunctions.push([promiseFunction, i])
        }

        let startTime = new Date().getTime()
        limitedParallel(testingFunctions, 4)
            .then(results => {
                let endTime = new Date().getTime()
                let executionTime = endTime - startTime
                expect(executionTime).to.be.within(300, 400)
                expect(results).to.be.an('array')

                done()
            })
            .catch(done)
    })


    it('should resolve empty result', done => {
        limitedParallel([], 4)
            .then(results => {
                expect(results).to.be.an('array')
                expect(results[0]).to.be.undefined

                done()
            })
            .catch(done)
    })

    it('should reject promise with stop condition with default limit', done => {
        let testingFunctions = []
        for (let i = 0; i < 10; i++) {
            testingFunctions.push([promiseFunction, i])
        }

        function stopFunction(result) {
            return result > 7
        }

        limitedParallel(testingFunctions, stopFunction)
            .then(done)
            .catch(err => {
                expect(err instanceof StopPipe).to.equal(true)
                done()
            })
    })

    it('should reject promise with stop condition with limit', done => {
        let testingFunctions = []
        for (let i = 0; i < 10; i++) {
            testingFunctions.push([promiseFunction, i])
        }

        function stopFunction(result) {
            return result > 7
        }

        limitedParallel(testingFunctions, 4, stopFunction)
            .then(done)
            .catch(err => {
                expect(err instanceof StopPipe).to.equal(true)
                done()
            })
    })

    it('should reject promise with error', done => {
        let testingFunctions = []
        for (let i = 0; i < 10; i++) {
            testingFunctions.push([promiseFunction, i+2])
        }

        limitedParallel(testingFunctions)
            .then(done)
            .catch(err => {
                expect(err).to.equal(11)
                done()
            })
    })
})

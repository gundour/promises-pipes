var expect = require('chai').expect
const {seriesTimes} = require('..')

let promiseFunction = (i) => {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if(i > 10) return reject(i)
            resolve(i)
        }, 100);
    })
}


describe('seriesTimes', function () {
    this.timeout(2500)
    it('should export seriesTimes', done => {
        expect(typeof seriesTimes).to.equal('function')
        done()
    })

    it('should execute promises sequentially', done => {
        let startTime = new Date().getTime()

        seriesTimes([promiseFunction, 1], 10)
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
        seriesTimes([], 10)
            .then(results => {
                expect(results).to.be.an('array')
                expect(results[0]).to.be.undefined

                done()
            })
            .catch(done)
    })

    it('should reject promise with error', done => {
        seriesTimes([promiseFunction, 11], 10)
            .then(done)
            .catch(err => {
                expect(err).to.equal(11)
                done()
            })
    })
})

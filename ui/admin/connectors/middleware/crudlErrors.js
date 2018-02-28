/** middleware to transfrom express error to crudl error */
export default function crudlErrors(next) {

    function processError(error) {
        const errorObj = {}
        if (typeof(error) === 'object' && error.length) {
            for (let i = 0; i < error.length - 1; i = i + 2) {
                const name = error[i] === '__all__' ? '_error' : error[i]
                errorObj[name] = error[i + 1]
            }
            throw { validationError: true, errors: errorObj }
        }
        throw error
    }

    return {
        create: req => next.create(req).catch(processError),
        read: req => next.read(req).catch(processError),
        update: req => next.update(req).catch(processError),
        delete: req => next.delete(req).catch(processError),
    }
}

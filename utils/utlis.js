
// takes a req from a controller and return 2 parameters 
// url form /user/:id/friend/:id

const returnParams = (req) => {
    const URL = req.originalUrl.split('/')
    return [URL[2],URL[4]]
}

module.exports = returnParams 
const fs = require('fs')
const { ImgurClient } = require('imgur')

const clientId = process.env.IMGUR_ID
const client = new ImgurClient({ clientId })

module.exports = {
  imgurFileHelper: (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!file) return resolve(null)
        const { data } = await client.upload({ image: fs.createReadStream(file[0].path) })
        return resolve(data.link)
      } catch (err) {
        return reject(err)
      }
    })
  }
}
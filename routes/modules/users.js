const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller.js')

const upload = require('../../helpers/multer-helper.js')

router.put('/:id', upload.fields([{ name: 'avatar' }, { name: 'coverImage' }]), userController.editUser)

module.exports = router
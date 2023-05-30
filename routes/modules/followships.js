const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller.js')

/**
 * @swagger
 * /api/followships/{id}:
 *   delete:
 *     tags:
 *       - Followships
 *     summary: add a following to User
 *     description: Return added following User data
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.delete('/:id', userController.deleteFollowing)

/**
 * @swagger
 * /api/followships/{id}:
 *   post:
 *     tags:
 *       - Followships
 *     summary: remove a following from User
 *     description: Return removed following User data
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.post('/:id', userController.postFollowing)

module.exports = router
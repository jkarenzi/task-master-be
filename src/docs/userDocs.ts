/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get one user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       '200':
 *         description: Successful
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/email:
 *   patch:
 *     summary: Change email
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               newEmail:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Email successfully changed
 *       '400':
 *         description: Failed validation
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/password:
 *   patch:
 *     summary: Change password
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Password successfully changed
 *       '400':
 *         description: Failed validation
 *       '401':
 *         description: Unauthorized or Incorrect password
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/profileImg:
 *   patch:
 *     summary: Change profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Profile Image successfully changed
 *       '400':
 *         description: Failed validation or unexpected error
 *       '401':
 *         description: Unauthorized or Incorrect password
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/profileImg:
 *   delete:
 *     summary: Remove profile image
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '204':
 *         description: Profile Image removed
 *       '401':
 *         description: Unauthorized
 *       '409':
 *         description: No profile image exists
 *       '400':
 *         description: An error occured during cloudinary upload
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       '204':
 *         description: User successfully deleted
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
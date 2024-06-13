/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: User signup
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Signup successful
 *       '400':
 *         description: Failed Validation
 *       '409':
 *         description: Email already exists
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful login
 *       '400':
 *         description: Failed Validation
 *       '401':
 *         description: Incorrect password
 *       '404':
 *         description: Account not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/verify_email/{token}:
 *   get:
 *     summary: Verify Email
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: token
 *     responses:
 *       '200':
 *         description: Email successfully verified
 *       '409':
 *         description: Invalid or expired token
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/request_new_link:
 *   post:
 *     summary: Request new verification link
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Email sent successfully
 *       '400':
 *         description: User is already verified
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/verify_code/{userId}:
 *   post:
 *     summary: Verify 2FA Code
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: userId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               twoFactorCode:
 *                 type: number
 *     responses:
 *       '200':
 *         description: Login successful
 *       '409':
 *         description: Failed validation
 *       '404':
 *         description: User not found
 *       '401':
 *         description: Code provided does not match code sent
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/request_new_code/{userId}:
 *   post:
 *     summary: Request new 2FA Code
 *     tags: [Authentication]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: userId
 *     responses:
 *       '200':
 *         description: Email sent successfully
 *       '401':
 *         description: 2FA is not enabled
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/auth/toggle_2fa:
 *   patch:
 *     summary: Enable/Disable 2FA 
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: boolean
 *     responses:
 *       '200':
 *         description: 2FA status updated successfully
 *       '400':
 *         description: Failed validation
 *       '500':
 *         description: Internal Server Error
 */
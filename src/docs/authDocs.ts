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
 * api/auth/login:
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

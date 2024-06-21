/**
 * @swagger
 * /api/boards:
 *   post:
 *     summary: Create new Board
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Board created successfully
 *       '400':
 *         description: Failed validation
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/boards:
 *   get:
 *     summary: Get boards
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/boards/{boardId}:
 *   patch:
 *     summary: Update board
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: string
 *         required: true
 *         description: boardId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful
 *       '400':
 *         description: Failed validation
 *       '409':
 *         description: Board not found or doesn't belong to currently logged in user
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/boards/{boardId}:
 *   delete:
 *     summary: Delete board
 *     tags: [Board]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: boardId
 *         schema:
 *           type: string
 *         required: true
 *         description: boardId
 *     responses:
 *       '204':
 *         description: Deletion Successful
 *       '409':
 *         description: Board not found or doesn't belong to currently logged in user     
 *       '500':
 *         description: Internal Server Error
 */
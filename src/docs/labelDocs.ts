/**
 * @swagger
 * /api/labels:
 *   post:
 *     summary: Create new label
 *     tags: [Label]
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
 *               boardId:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Label created successfully
 *       '400':
 *         description: Failed validation
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/labels/{boardId}:
 *   get:
 *     summary: Get labels
 *     tags: [Label]
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
 *       '200':
 *         description: Successful
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/labels/{labelId}:
 *   patch:
 *     summary: Update label
 *     tags: [Label]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: labelId
 *         schema:
 *           type: string
 *         required: true
 *         description: labelId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               color:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful
 *       '400':
 *         description: Failed validation
 *       '409':
 *         description: Label not found or doesn't belong to currently logged in user
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/labels/{labelId}:
 *   delete:
 *     summary: Delete label
 *     tags: [Label]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: labelId
 *         schema:
 *           type: string
 *         required: true
 *         description: labelId
 *     responses:
 *       '204':
 *         description: Deletion Successful
 *       '409':
 *         description: Label not found or doesn't belong to currently logged in user     
 *       '500':
 *         description: Internal Server Error
 */
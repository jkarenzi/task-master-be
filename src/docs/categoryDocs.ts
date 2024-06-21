/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create new Category
 *     tags: [Category]
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
 *     responses:
 *       '201':
 *         description: Category created successfully
 *       '400':
 *         description: Failed validation
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/categories/{boardId}:
 *   get:
 *     summary: Get categories
 *     tags: [Category]
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
 * /api/categories/{categoryId}:
 *   patch:
 *     summary: Update category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: categoryId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful
 *       '400':
 *         description: Failed validation
 *       '409':
 *         description: Category not found or doesn't belong to currently logged in user
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   delete:
 *     summary: Delete category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: categoryId
 *     responses:
 *       '204':
 *         description: Deletion Successful
 *       '409':
 *         description: Category not found or doesn't belong to currently logged in user     
 *       '500':
 *         description: Internal Server Error
 */
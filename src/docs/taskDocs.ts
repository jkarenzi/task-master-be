/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create new task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boardId:
 *                 type: string
 *               categoryId: 
 *                 type: string
 *               title: 
 *                 type: string
 *               labels:
 *                 type: array 
 *                 items:
 *                   type: string
 *               description:
 *                 type: string  
 *               dueDate:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Task created successfully
 *       '400':
 *         description: Failed validation
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/tasks/all/{boardId}:
 *   get:
 *     summary: Get tasks
 *     tags: [Task]
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
 * /api/tasks/{taskId}:
 *   get:
 *     summary: Get one task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: taskId
 *     responses:
 *       '200':
 *         description: Successful
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   patch:
 *     summary: Update task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: taskId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId: 
 *                 type: string
 *               title: 
 *                 type: string
 *               labels:
 *                 type: array 
 *                 items:
 *                   type: string
 *               description:
 *                 type: string  
 *               dueDate:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successful
 *       '400':
 *         description: Failed validation
 *       '409':
 *         description: Task not found or doesn't belong to currently logged in user
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/tasks/{taskId}:
 *   delete:
 *     summary: Delete task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         required: true
 *         description: taskId
 *     responses:
 *       '204':
 *         description: Deletion Successful
 *       '409':
 *         description: Task not found or doesn't belong to currently logged in user     
 *       '500':
 *         description: Internal Server Error
 */
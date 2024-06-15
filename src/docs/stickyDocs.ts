/**
 * @swagger
 * /api/sticky_notes:
 *   get:
 *     summary: Get sticky notes
 *     tags: [Sticky Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/sticky_notes:
 *   post:
 *     summary: Create a sticky note
 *     tags: [Sticky Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       '201':
 *         description: Sticky note successfully created
 *       '400':
 *         description: Failed validation
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/sticky_notes/{id}:
 *   patch:
 *     summary: Update a sticky note
 *     tags: [Sticky Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: sticky note id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Sticky note successfully updated
 *       '400':
 *         description: Failed validation
 *       '401':
 *         description: Unauthorized
 *       '409':
 *         description: Sticky note not found or doesn't belong to currently logged in user
 *       '500':
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /api/sticky_notes/{id}:
 *   delete:
 *     summary: Delete a sticky note
 *     tags: [Sticky Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: sticky note id
 *     responses:
 *       '204':
 *         description: Sticky note successfully deleted
 *       '401':
 *         description: Unauthorized
 *       '409':
 *         description: Sticky note not found or doesn't belong to currently logged in user
 *       '500':
 *         description: Internal Server Error
 */
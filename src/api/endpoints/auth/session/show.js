'use strict';

/**
 * Module dependencies
 */
import AuthSess from '../../../models/auth-session';
import serialize from '../../../serializers/auth-session';

/**
 * @swagger
 * /auth/session/show:
 *   post:
 *     summary: Show a session information
 *     parameters:
 *       -
 *         name: token
 *         description: Session Token
 *         in: formData
 *         required: true
 *         type: string
 *         
 *     responses:
 *       200:
 *         description: OK
 *         schema: 
 *           type: object
 *           properties:
 *             created_at:
 *               type: string
 *               format: date
 *               description: Date and time of the session creation
 *             app_id:
 *               type: string
 *               description: Application ID
 *             token:
 *               type: string
 *               description: Session Token
 *             user_id:
 *               type: string
 *               description: ID of user who create the session
 *             app:
 *               $ref: "#/definitions/Application"
 *       default:
 *         description: Failed
 *         schema:
 *           $ref: "#/definitions/Error"
 */

/**
 * Show a session
 *
 * @param {Object} params
 * @param {Object} user
 * @return {Promise<object>}
 */
module.exports = (params, user) =>
	new Promise(async (res, rej) =>
{
	// Get 'token' parameter
	const token = params.token;
	if (token == null) {
		return rej('token is required');
	}

	// Lookup session
	const session = await AuthSess.findOne({
		token: token
	});

	if (session == null) {
		return rej('session not found');
	}

	// Response
	res(await serialize(session, user));
});

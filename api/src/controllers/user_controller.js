const { createUser } = require('../services/user_service');

/**
 * Handler
 */

async function addUser(req, res) {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is require' });
    }

    try {
        const user = await createUser(username);
        res.status(201).json(user);
    } catch (error) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'User already exists' });
        }
        res.status(500).json({ error: 'Database error' });
    }
}

module.exports = { addUser };
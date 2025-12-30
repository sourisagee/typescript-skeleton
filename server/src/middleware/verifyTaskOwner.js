const { Task } = require('../db/models');
const formatResponse = require('../utils/formatResponse');

async function verifyTaskOwner(req, res, next) {
    try {
        const { taskId } = req.params;
        const userId = res.locals.user.id; 

        const task = await Task.findByPk(taskId);

        if (!task) {
            return res.status(404).json(formatResponse(404, 'Task not found'));
        }

        if (task.user_id !== userId && res.locals.user.role !== 'admin') {
            return res.status(403).json(
                formatResponse(
                    403, 
                    'Access denied', 
                    null, 
                    'You can only modify your own tasks'
                )
            );
        }

        res.locals.task = task;
        next();
    } catch (error) {
        return res.status(500).json(
            formatResponse(500, 'Internal server error', null, error.message)
        );
    }
}

module.exports = verifyTaskOwner;

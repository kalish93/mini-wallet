const AlertService = require('../services/alertService');

class AlertController {
    static async getMyAlerts(req, res, next) {
        try {
            const agentId = req.agent.agentId; 
            const alerts = await AlertService.getAgentAlerts(agentId);
            res.status(200).json({ alerts });
        } catch (error) {
            next(error);
        }
    }

    static async markAlertRead(req, res, next) {
        const { alertId } = req.params; 
        try {
            const updatedAlert = await AlertService.markAlertAsRead(alertId);
            if (!updatedAlert) {
                return res.status(404).json({ message: 'Alert not found.' });
            }
            res.status(200).json({ message: 'Alert marked as read.', alert: updatedAlert });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = AlertController;
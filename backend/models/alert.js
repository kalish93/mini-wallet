const prisma = require('../prismaClient');

class Alert {
    static async create(agentId, type, message, thresholdValue) {
        try {
            const alert = await prisma.alert.create({
                data: {
                    agent: { connect: { id: agentId } },
                    type,
                    message,
                    thresholdValue,
                },
            });
            return alert;
        } catch (error) {
            console.error('Error creating alert:', error);
            throw error;
        }
    }

    static async getUnreadByAgentId(agentId) {
        try {
            const alerts = await prisma.alert.findMany({
                where: {
                    agentId,
                    isRead: false,
                },
                orderBy: { createdAt: 'desc' },
            });
            return alerts;
        } catch (error) {
            console.error('Error getting unread alerts:', error);
            throw error;
        }
    }

    static async markAsRead(alertId) {
        try {
            const alert = await prisma.alert.update({
                where: { id: alertId },
                data: { isRead: true },
            });
            return alert;
        } catch (error) {
            console.error('Error marking alert as read:', error);
            throw error;
        }
    }

    
}

module.exports = Alert;


const Alert = require('../models/alert');

class AlertService {
    static async getAgentAlerts(agentId) {
        try {
            

            const alerts = await Alert.getUnreadByAgentId(agentId);


            return alerts;
        } catch (error) {
            console.error('AlertService.getAgentAlerts error:', error.message);
            throw error;
        }
    }

    static async markAlertAsRead(alertId) {
        try {
            const updatedAlert = await Alert.markAsRead(alertId);
            
            return updatedAlert;
        } catch (error) {
            console.error('AlertService.markAlertAsRead error:', error.message);
            throw error;
        }
    }

    static async checkAndCreateLowBalanceAlert(agentId) {
       
        const LOW_BALANCE_THRESHOLD = 500;
        try {
            const wallet = await this.walletService.getAgentWallet(agentId); 
            if (wallet && wallet.balance.lessThan(LOW_BALANCE_THRESHOLD) && wallet.balance.greaterThanOrEqualTo(0)) {
                await Alert.checkAndCreateLowBalanceAlert(agentId, 'LOW_BALANCE', `Your wallet balance is low: ${wallet.balance.toFixed(2)} ${wallet.currency}`, LOW_BALANCE_THRESHOLD);
            }
        } catch (error) {
            console.error('Error checking and creating low balance alert:', error);
        }
    }
}

module.exports = AlertService;
const cron = require('node-cron');
const OTP = require('../models/Otp'); 
const { Op } = require('sequelize');

// Run every 5 minutes */5 * * * *
// Run at 12:00 AM 0 0 * * *
cron.schedule('0 0 * * *', async () => {
  try {
    const deleted = await OTP.destroy({
      where: {
        expiredAt: {
          [Op.lt]: new Date()
        }
      }
    });

    if (deleted > 0) {
      console.log(`[CRON] Deleted ${deleted} expired OTP(s)`);
    }
  } catch (error) {
    console.error('[CRON] Error deleting expired OTPs:', error);
  }
});

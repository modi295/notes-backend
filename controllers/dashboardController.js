const DownloadNotes = require('../models/DownloadNotes');
const SoldNotes = require('../models/SoldNotes');
const BuyerNotes = require('../models/BuyerNotes');
const Notes = require('../models/Notes');
const User = require('../models/User');
const { Sequelize } = require('sequelize');


async function getNotesDashboardData(req, res) {
    try {
      const { email } = req.params;
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }
  
      const soldNotesCount = await SoldNotes.count({ where: { purchaseEmail: email } });
  
      const downloadedNotesCount = await DownloadNotes.count({ where: { buyerEmail: email } });

      const soldNotesTotalPrice = await SoldNotes.sum('sellPrice', { where: { purchaseEmail: email } }) || 0;
  
      const rejectedNotesCount = await Notes.count({ where: { email, publishFlag: 'R' } });
  
      const buyerNotesCount = await BuyerNotes.count({ where: { purchaseEmail: email } });
  
      return res.status(200).json({
        soldNotesCount,
        downloadedNotesCount,
        soldNotesTotalPrice,
        rejectedNotesCount,
        buyerNotesCount,
      });
    } catch (error) {
      console.error('Error fetching user notes data:', error);
      return res.status(500).json({ error: error.message });
    }
  }


async function getAdminDashboardData(req, res) {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const formattedDate = sevenDaysAgo.toISOString(); 

        const inReviewNotesCount = await Notes.count({ where: { publishFlag: 'I' } });

        const newDownloadsCount = await DownloadNotes.count({
            where: Sequelize.literal(`"DownloadNotes"."createdAt" >= '${formattedDate}'`)
        });

        const newRegistrationsCount = await User.count({
            where: Sequelize.literal(`"User"."createdAt" >= '${formattedDate}' AND ("User"."active" IS NULL OR "User"."active" = 'Y')`)
        });

        return res.status(200).json({
            inReviewNotesCount,
            newDownloadsCount,
            newRegistrationsCount
        });
    } catch (error) {
        console.error('Error fetching dashboard metrics:', error);
        return res.status(500).json({ error: error.message });
    }
}

  module.exports = { getNotesDashboardData,getAdminDashboardData };
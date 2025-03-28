const DownloadNotes = require('../models/DownloadNotes');
const SoldNotes = require('../models/SoldNotes');
const BuyerNotes = require('../models/BuyerNotes');
const Notes = require('../models/Notes');

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

  module.exports = { getNotesDashboardData };
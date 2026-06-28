const cron = require('node-cron');
const Ingredient = require('../models/Ingredient');
const { sendLowStockAlert } = require('./emailService');

/**
 * Starts the inventory monitoring cron job.
 * Runs every hour and checks for low-stock ingredients.
 */
const startStockMonitoring = () => {
  cron.schedule('0 * * * *', async () => {
    console.log('🔍 Running stock monitoring job...');

    try {
      const lowStockIngredients = await Ingredient.find({ quantity: { $lt: 20 } });

      if (lowStockIngredients.length > 0) {
        console.log(`⚠️  Found ${lowStockIngredients.length} low stock ingredients`);
        await sendLowStockAlert(lowStockIngredients);
        console.log('Low stock items:', lowStockIngredients.map((i) => i.name).join(', '));
      } else {
        console.log('✅ All ingredients are in stock');
      }
    } catch (error) {
      console.error('❌ Error in stock monitoring job:', error.message);
    }
  });

  console.log('📅 Stock monitoring job started - Runs every hour');
};

module.exports = { startStockMonitoring };

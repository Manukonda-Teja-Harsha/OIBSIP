const nodemailer = require('nodemailer');

// Create transporter for sending emails
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendLowStockAlert = async (ingredients) => {
  try {
    const ingredientList = ingredients
      .map(item => `- ${item.name}: ${item.quantity} ${item.unit} (Min: ${item.minStock})`)
      .join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
      subject: '🚨 Low Stock Alert - Pizza Delivery System',
      html: `
        <h2>Low Stock Alert</h2>
        <p>The following ingredients are running low and need to be restocked:</p>
        <pre>${ingredientList}</pre>
        <p><strong>Please restock immediately to avoid service disruption.</strong></p>
        <hr>
        <p>This is an automated alert from the Pizza Delivery System</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Low stock alert email sent to ${mailOptions.to}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending low stock email:', error);
    return false;
  }
};

module.exports = { sendLowStockAlert };

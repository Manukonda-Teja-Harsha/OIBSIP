# Stock Monitoring System Documentation

## Overview
The stock monitoring system automatically checks ingredient inventory every hour and sends email alerts when stock falls below 20 units.

---

## Architecture

### 1. **Ingredient Model** (`models/Ingredient.js`)
Stores ingredient data with stock tracking:
```
- name: Unique ingredient name
- quantity: Current stock level
- unit: Measurement unit (kg, liters, pieces, etc.)
- minStock: Threshold for low stock alerts (default: 20)
- lastRestocked: Timestamp of last restock
- supplier: Supplier name/contact info
```

### 2. **Email Service** (`utils/emailService.js`)
Handles email notifications using Nodemailer:
- **Transporter**: Gmail SMTP configured with `EMAIL_USER` and `EMAIL_PASSWORD`
- **sendLowStockAlert()**: Sends formatted HTML email to admin with list of low-stock items
- Includes ingredient name, quantity, unit, and minimum threshold

### 3. **Stock Monitoring Service** (`utils/stockMonitoring.js`)
Cron job that runs every hour:
```
Cron Pattern: '0 * * * *' (minute 0 of every hour)
- Checks all ingredients with quantity < 20
- Triggers email alert if low stock found
- Logs results to console for audit trail
```

**Functions:**
- `startStockMonitoring()`: Activates the hourly cron job
- `stopStockMonitoring()`: Stops the monitoring service

### 4. **Inventory Controller** (`controllers/inventoryController.js`)
Provides API endpoints for managing ingredients:
- **GET** `/api/inventory` - List all ingredients with low stock count
- **GET** `/api/inventory/:id` - Get single ingredient
- **POST** `/api/inventory` - Add new ingredient (admin only)
- **PUT** `/api/inventory/:id` - Update ingredient/restock (admin only)
- **DELETE** `/api/inventory/:id` - Delete ingredient (admin only)
- **GET** `/api/inventory/status/low-stock` - Get low stock items
- **POST** `/api/inventory/alert/trigger` - Manually trigger alert (admin only)

### 5. **Inventory Routes** (`routes/inventoryRoutes.js`)
All routes require authentication via JWT token (Bearer token in Authorization header).
Admin-only routes additionally require `isAdmin=true`.

---

## How It Works

### Automatic Monitoring (Hourly)
1. **Server starts** → `startStockMonitoring()` is called
2. **Every hour at :00 minutes**, the cron job executes:
   - Queries database for ingredients where `quantity < 20`
   - If found, calls `sendLowStockAlert()`
   - Email sent to `ADMIN_EMAIL`
   - Logs status to console

### Manual Stock Check
Admin can manually:
```bash
GET /api/inventory/status/low-stock
# Returns: { count: 3, ingredients: [...] }
```

### Manual Alert Trigger
Admin can manually send an alert:
```bash
POST /api/inventory/alert/trigger
# Sends email immediately
```

---

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install node-cron nodemailer
# or: npm install (if package.json already updated)
```

### 2. Configure Environment Variables
Create `.env` file in backend directory:
```env
# Gmail SMTP Setup
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Optional: Custom admin email (defaults to EMAIL_USER)
ADMIN_EMAIL=admin@pizzadelivery.com
```

### 3. Gmail App Password Setup
If using Gmail:
1. Enable 2-factor authentication
2. Generate app password at: https://myaccount.google.com/apppasswords
3. Use the 16-character password as `EMAIL_PASSWORD`

### 4. Start Server
```bash
npm run dev
# Output: 📅 Stock monitoring job started - Runs every hour
```

---

## Email Alert Example

When low stock is detected, admin receives email with format:
```
Subject: 🚨 Low Stock Alert - Pizza Delivery System

Low Stock Alert

The following ingredients are running low and need to be restocked:

- cheese: 15 kg (Min: 20)
- tomato-sauce: 10 liters (Min: 20)
- dough: 5 kg (Min: 20)

Please restock immediately to avoid service disruption.

---
This is an automated alert from the Pizza Delivery System
```

---

## API Usage Examples

### Add Ingredient
```bash
POST /api/inventory
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "name": "cheese",
  "quantity": 50,
  "unit": "kg",
  "minStock": 20,
  "supplier": "Local Dairy Farm"
}
```

### Update Stock (Restock)
```bash
PUT /api/inventory/:id
Authorization: Bearer <admin-token>

{
  "quantity": 100
}
```

### Get Low Stock Ingredients
```bash
GET /api/inventory/status/low-stock
Authorization: Bearer <user-token>
```

### Manually Trigger Alert
```bash
POST /api/inventory/alert/trigger
Authorization: Bearer <admin-token>
```

---

## Key Features

✅ **Automatic Hourly Checks** - No manual intervention needed
✅ **Email Notifications** - Admin alerted immediately
✅ **Configurable Threshold** - Min stock level per ingredient
✅ **Admin API** - Manage ingredients via REST endpoints
✅ **Manual Triggers** - Force checks/alerts when needed
✅ **Audit Trail** - Console logs all monitoring activities
✅ **Low Stock Dashboard** - View status/low-stock endpoints

---

## Monitoring Active Status

Check if monitoring is running:
```bash
# Server logs on startup:
📅 Stock monitoring job started - Runs every hour

# Each hour at :00 minutes:
🔍 Running stock monitoring job...
✅ All ingredients are in stock
# or
⚠️ Found 3 low stock ingredients
✅ Low stock alert email sent to admin@pizzadelivery.com
```

---

## Troubleshooting

### Email Not Sending
- Verify `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Use app-specific password for Gmail (not your main password)
- Check SMTP settings in `utils/emailService.js`

### Cron Not Running
- Verify `node-cron` is installed: `npm list node-cron`
- Check server console for: `📅 Stock monitoring job started`
- Ensure MongoDB connection is successful

### Low Stock Threshold
- Change default in Ingredient model: `minStock: 20`
- Or set per ingredient via API

---

## File Structure
```
backend/
├── models/
│   └── Ingredient.js          # Schema with quantity & minStock
├── controllers/
│   └── inventoryController.js # CRUD & alert logic
├── routes/
│   └── inventoryRoutes.js     # API endpoints
├── utils/
│   ├── emailService.js        # Nodemailer config & sender
│   └── stockMonitoring.js     # Cron scheduler
├── .env.example               # Configuration template
└── server.js                  # Integration point
```

---

## Next Steps
- Configure additional notification channels (SMS, Slack)
- Add stock usage tracking (ingredients used per order)
- Implement automatic reorder via supplier API
- Create admin dashboard UI for inventory management

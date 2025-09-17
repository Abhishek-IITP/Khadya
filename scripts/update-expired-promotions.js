/**
 * Script to update expired promotion statuses
 * This can be run as a cron job or scheduled task
 * 
 * Usage:
 * - Manual: node scripts/update-expired-promotions.js
 * - Cron: 0 0 * * * node scripts/update-expired-promotions.js (runs daily at midnight)
 */

const fetch = require('node-fetch');

async function updateExpiredPromotions() {
  try {
    console.log('Starting expired promotions update...');
    
    // Get the base URL - adjust this to your domain
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const apiUrl = `${baseUrl}/api/promotions/update-expired`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Success:', result.message);
      console.log(`📊 Updated ${result.updatedCount} promotions`);
      
      if (result.updatedPromotions && result.updatedPromotions.length > 0) {
        console.log('📋 Updated promotions:');
        result.updatedPromotions.forEach(promo => {
          console.log(`   - ${promo.name} (ID: ${promo.id}) - Ended: ${new Date(promo.end_date).toLocaleDateString()}`);
        });
      }
    } else {
      console.error('❌ Error:', result.error);
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ Failed to update expired promotions:', error.message);
    process.exit(1);
  }
}

// Run the update
updateExpiredPromotions();

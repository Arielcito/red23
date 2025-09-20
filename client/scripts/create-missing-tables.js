#!/usr/bin/env node

// Script to test connection and check existing tables in Supabase database

const { createClient } = require('@supabase/supabase-js');
require('dotenv/config');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('🚀 Checking database connection and existing tables...');

  try {
    // Test connection by trying to query existing tables
    console.log('📋 Checking for automatic_prompts table...');
    const { data: prompts, error: promptsError } = await supabase
      .from('automatic_prompts')
      .select('*')
      .limit(1);

    if (promptsError) {
      console.log('❌ automatic_prompts table does not exist:', promptsError.message);
    } else {
      console.log('✅ automatic_prompts table exists, found', prompts?.length || 0, 'records');
    }

    console.log('👥 Checking for user_referrals table...');
    const { data: referrals, error: referralsError } = await supabase
      .from('user_referrals')
      .select('*')
      .limit(1);

    if (referralsError) {
      console.log('❌ user_referrals table does not exist:', referralsError.message);
    } else {
      console.log('✅ user_referrals table exists, found', referrals?.length || 0, 'records');
    }

    console.log('📊 Checking for referral_tracking table...');
    const { data: tracking, error: trackingError } = await supabase
      .from('referral_tracking')
      .select('*')
      .limit(1);

    if (trackingError) {
      console.log('❌ referral_tracking table does not exist:', trackingError.message);
    } else {
      console.log('✅ referral_tracking table exists, found', tracking?.length || 0, 'records');
    }

    // Check existing tables
    console.log('🗂️ Checking existing tables...');
    
    const { data: images, error: imagesError } = await supabase
      .from('images_generator')
      .select('*')
      .limit(1);
    
    if (!imagesError) {
      console.log('✅ images_generator table exists, found', images?.length || 0, 'records');
    }

    const { data: members, error: membersError } = await supabase
      .from('telegram_members')
      .select('*')
      .limit(1);
    
    if (!membersError) {
      console.log('✅ telegram_members table exists, found', members?.length || 0, 'records');
    }

    const { data: winners, error: winnersError } = await supabase
      .from('telegram_winners')
      .select('*')
      .limit(1);
    
    if (!winnersError) {
      console.log('✅ telegram_winners table exists, found', winners?.length || 0, 'records');
    }

    // Check reward system tables
    console.log('🏆 Checking for reward_winners table...');
    const { data: rewardWinners, error: rewardWinnersError } = await supabase
      .from('reward_winners')
      .select('*')
      .limit(1);

    if (rewardWinnersError) {
      console.log('❌ reward_winners table does not exist:', rewardWinnersError.message);
    } else {
      console.log('✅ reward_winners table exists, found', rewardWinners?.length || 0, 'records');
    }

    console.log('⚙️ Checking for reward_settings table...');
    const { data: rewardSettings, error: rewardSettingsError } = await supabase
      .from('reward_settings')
      .select('*')
      .limit(1);

    if (rewardSettingsError) {
      console.log('❌ reward_settings table does not exist:', rewardSettingsError.message);
    } else {
      console.log('✅ reward_settings table exists, found', rewardSettings?.length || 0, 'records');
    }

    console.log('🖼️ Checking for reward_images table...');
    const { data: rewardImages, error: rewardImagesError } = await supabase
      .from('reward_images')
      .select('*')
      .limit(1);

    if (rewardImagesError) {
      console.log('❌ reward_images table does not exist:', rewardImagesError.message);
    } else {
      console.log('✅ reward_images table exists, found', rewardImages?.length || 0, 'records');
    }

    // Check Supabase Storage bucket
    console.log('📦 Checking rewards-images storage bucket...');
    try {
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket('rewards-images');
      
      if (bucketError) {
        console.log('❌ rewards-images bucket does not exist:', bucketError.message);
        console.log('💡 Create bucket in Supabase Dashboard > Storage > New Bucket > "rewards-images" (public)');
      } else {
        console.log('✅ rewards-images bucket exists:', bucketData.name);
        
        // Test bucket permissions
        const { data: filesData, error: filesError } = await supabase.storage
          .from('rewards-images')
          .list('', { limit: 1 });
        
        if (filesError) {
          console.log('⚠️ bucket permissions issue:', filesError.message);
        } else {
          console.log('✅ bucket is accessible, found', filesData?.length || 0, 'files');
        }
      }
    } catch (bucketCheckError) {
      console.log('⚠️ could not check bucket:', bucketCheckError.message);
    }

    console.log('🎉 Database and storage check completed!');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
}

// Run the script
checkTables();
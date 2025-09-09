const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../loanmanagement-ca7e1-firebase-adminsdk-fbsvc-564a04b142.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'loanmanagement-ca7e1'
});

async function checkStorage() {
  try {
    console.log('Firebase Project Info:');
    console.log('Project ID:', serviceAccount.project_id);
    
    // Common bucket name patterns
    const possibleBuckets = [
      `${serviceAccount.project_id}.appspot.com`,
      `${serviceAccount.project_id}.firebasestorage.app`,
      serviceAccount.project_id
    ];
    
    console.log('\nChecking possible storage buckets:');
    
    for (const bucketName of possibleBuckets) {
      try {
        const bucket = admin.storage().bucket(bucketName);
        console.log(`\nTrying bucket: ${bucketName}`);
        
        // Try to check if bucket exists by listing files (will fail if bucket doesn't exist)
        const [files] = await bucket.getFiles({ maxResults: 1 });
        console.log(`✅ Bucket "${bucketName}" exists and is accessible`);
        console.log(`   Files in bucket: ${files.length > 0 ? 'Has files' : 'Empty'}`);
        
        // Try to get bucket metadata
        const [metadata] = await bucket.getMetadata();
        console.log(`   Location: ${metadata.location}`);
        console.log(`   Storage Class: ${metadata.storageClass}`);
        
        return bucketName; // Return the working bucket name
      } catch (error) {
        console.log(`❌ Bucket "${bucketName}" - Error: ${error.message}`);
      }
    }
    
    console.log('\n⚠️  No accessible storage bucket found.');
    console.log('You may need to:');
    console.log('1. Enable Firebase Storage in the Firebase Console');
    console.log('2. Create a default storage bucket');
    console.log('3. Check service account permissions');
    
  } catch (error) {
    console.error('Error checking storage:', error);
  } finally {
    process.exit(0);
  }
}

// Run the check
checkStorage();
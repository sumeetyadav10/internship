const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../loanmanagement-ca7e1-firebase-adminsdk-fbsvc-564a04b142.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'loanmanagement-ca7e1'
});

const db = admin.firestore();

async function verifyDocument(applicationId) {
  try {
    console.log(`\nChecking for application: ${applicationId}\n`);
    
    // Get the specific application
    const docRef = db.collection('loan_applications').doc(applicationId);
    const doc = await docRef.get();
    
    if (doc.exists) {
      console.log('✅ Application found!');
      const data = doc.data();
      
      if (data.documents && data.documents.applicantPan) {
        const docData = data.documents.applicantPan;
        console.log('\nDocument Details:');
        console.log(`- File Name: ${docData.fileName}`);
        console.log(`- File Type: ${docData.fileType}`);
        console.log(`- File Size: ${docData.fileSize} bytes`);
        console.log(`- Is Image: ${docData.isImage || false}`);
        console.log(`- Is PDF: ${docData.isPDF || false}`);
        
        // Check if it's base64 data
        if (docData.url && docData.url.startsWith('data:')) {
          console.log('- Storage Type: Base64 (stored in Firestore)');
          
          // Extract base64 length
          const base64Part = docData.url.split(',')[1];
          if (base64Part) {
            console.log(`- Base64 Length: ${base64Part.length} characters`);
            console.log(`- Estimated Original Size: ~${Math.round(base64Part.length * 0.75)} bytes`);
          }
          
          console.log('\n✅ Document is properly stored as base64 in Firestore!');
          console.log('   This document can be displayed on frontend and downloaded.');
        } else {
          console.log('- Storage Type: URL Reference');
          console.log(`- URL: ${docData.url}`);
        }
      } else {
        console.log('\n❌ No documents found in the application');
      }
    } else {
      console.log('❌ Application not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

// Run the check
const applicationId = process.argv[2] || 'LMS202509080002';
verifyDocument(applicationId);
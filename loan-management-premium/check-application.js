const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('../loanmanagement-ca7e1-firebase-adminsdk-fbsvc-564a04b142.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'loanmanagement-ca7e1'
});

const db = admin.firestore();

async function checkApplication(applicationId) {
  try {
    console.log(`\nChecking for application: ${applicationId}\n`);
    
    // Get the specific application
    const docRef = db.collection('loan_applications').doc(applicationId);
    const doc = await docRef.get();
    
    if (doc.exists) {
      console.log('✅ Application found in Firestore!');
      console.log('\nApplication Data:');
      const data = doc.data();
      console.log(JSON.stringify(data, null, 2));
      
      // Check specific fields
      console.log('\nKey Information:');
      console.log(`- Form Number: ${data.formNumber}`);
      console.log(`- Status: ${data.status}`);
      console.log(`- Created By: ${data.createdBy}`);
      console.log(`- Applicant Name: ${data.applicantDetails?.firstName} ${data.applicantDetails?.lastName}`);
      console.log(`- Loan Amount: ${data.loanDetails?.loanAmount}`);
      console.log(`- Documents: ${Object.keys(data.documents || {}).length} document(s)`);
    } else {
      console.log('❌ Application not found in Firestore');
    }
    
    // Also check recent applications
    console.log('\n\nRecent Applications:');
    const recentQuery = await db.collection('loan_applications')
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();
    
    recentQuery.forEach((doc) => {
      const data = doc.data();
      console.log(`- ${doc.id}: ${data.applicantDetails?.firstName} ${data.applicantDetails?.lastName} (${data.status})`);
    });
    
  } catch (error) {
    console.error('Error checking application:', error);
  } finally {
    // Exit the process
    process.exit(0);
  }
}

// Run the check
const applicationId = process.argv[2] || 'LMS202509080001';
checkApplication(applicationId);
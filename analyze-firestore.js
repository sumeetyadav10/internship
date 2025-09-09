const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: "your-private-key-id",
  private_key: "your-private-key",
  client_email: `firebase-adminsdk@${process.env.FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`,
  client_id: "your-client-id",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk@${process.env.FIREBASE_PROJECT_ID}.iam.gserviceaccount.com`
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function analyzeFirestoreStructure() {
  console.log('Analyzing Firestore Database Structure...\n');
  
  const structure = {
    collections: {},
    totalCollections: 0,
    totalDocuments: 0,
    analyzedAt: new Date().toISOString()
  };

  try {
    // Get all root collections
    const collections = await db.listCollections();
    structure.totalCollections = collections.length;
    
    console.log(`Found ${collections.length} root collections:\n`);
    
    for (const collection of collections) {
      const collectionName = collection.id;
      console.log(`\nAnalyzing collection: ${collectionName}`);
      
      structure.collections[collectionName] = {
        name: collectionName,
        documents: {},
        documentCount: 0,
        fields: new Set(),
        fieldTypes: {},
        subcollections: new Set()
      };
      
      // Get sample documents from the collection
      const snapshot = await collection.limit(10).get();
      structure.collections[collectionName].documentCount = snapshot.size;
      
      console.log(`  - Documents found: ${snapshot.size}`);
      
      // Analyze each document
      for (const doc of snapshot.docs) {
        const docData = doc.data();
        const docId = doc.id;
        
        // Analyze fields in the document
        analyzeFields(docData, structure.collections[collectionName]);
        
        // Check for subcollections
        try {
          const subcollections = await doc.ref.listCollections();
          for (const subcoll of subcollections) {
            structure.collections[collectionName].subcollections.add(subcoll.id);
            console.log(`    - Found subcollection: ${subcoll.id}`);
            
            // Analyze subcollection
            const subSnapshot = await subcoll.limit(5).get();
            if (subSnapshot.size > 0) {
              structure.collections[collectionName].documents[docId] = {
                subcollections: {
                  [subcoll.id]: {
                    documentCount: subSnapshot.size,
                    sampleFields: Object.keys(subSnapshot.docs[0].data())
                  }
                }
              };
            }
          }
        } catch (error) {
          console.log(`    - Error checking subcollections: ${error.message}`);
        }
      }
      
      // Convert Set to Array for JSON serialization
      structure.collections[collectionName].fields = Array.from(structure.collections[collectionName].fields);
      structure.collections[collectionName].subcollections = Array.from(structure.collections[collectionName].subcollections);
      structure.totalDocuments += structure.collections[collectionName].documentCount;
    }
    
    // Generate report
    generateReport(structure);
    
  } catch (error) {
    console.error('Error analyzing Firestore:', error);
  }
}

function analyzeFields(obj, collectionInfo, prefix = '') {
  for (const [key, value] of Object.entries(obj)) {
    const fieldPath = prefix ? `${prefix}.${key}` : key;
    collectionInfo.fields.add(fieldPath);
    
    // Determine field type
    const fieldType = getFieldType(value);
    collectionInfo.fieldTypes[fieldPath] = fieldType;
    
    // Recursively analyze nested objects
    if (fieldType === 'object' && value !== null && !Array.isArray(value)) {
      analyzeFields(value, collectionInfo, fieldPath);
    }
  }
}

function getFieldType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (value instanceof admin.firestore.Timestamp) return 'timestamp';
  if (value instanceof admin.firestore.DocumentReference) return 'reference';
  if (value instanceof admin.firestore.GeoPoint) return 'geopoint';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

function generateReport(structure) {
  console.log('\n\n=== FIRESTORE DATABASE STRUCTURE REPORT ===\n');
  console.log(`Total Collections: ${structure.totalCollections}`);
  console.log(`Total Documents Analyzed: ${structure.totalDocuments}`);
  console.log(`Analysis Date: ${structure.analyzedAt}\n`);
  
  for (const [collectionName, collectionData] of Object.entries(structure.collections)) {
    console.log(`\nCollection: ${collectionName}`);
    console.log(`Documents: ${collectionData.documentCount}`);
    
    if (collectionData.fields.length > 0) {
      console.log('\nFields:');
      collectionData.fields.sort().forEach(field => {
        const type = collectionData.fieldTypes[field];
        console.log(`  - ${field} (${type})`);
      });
    }
    
    if (collectionData.subcollections.length > 0) {
      console.log('\nSubcollections:');
      collectionData.subcollections.forEach(subcoll => {
        console.log(`  - ${subcoll}`);
      });
    }
    
    console.log('\n' + '-'.repeat(50));
  }
  
  // Save structure to JSON file
  const fs = require('fs');
  const reportPath = './firestore-structure-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(structure, null, 2));
  console.log(`\nDetailed report saved to: ${reportPath}`);
}

// Run the analysis
analyzeFirestoreStructure()
  .then(() => {
    console.log('\nAnalysis complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Analysis failed:', error);
    process.exit(1);
  });
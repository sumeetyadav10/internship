const admin = require('firebase-admin');
const fs = require('fs');

// Initialize Firebase Admin SDK with service account
const serviceAccount = require('./loanmanagement-ca7e1-firebase-adminsdk-fbsvc-564a04b142.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function analyzeFirestoreStructure() {
  console.log('=== FIRESTORE DATABASE STRUCTURE ANALYSIS ===');
  console.log(`Project: ${serviceAccount.project_id}`);
  console.log(`Analysis started at: ${new Date().toLocaleString()}\n`);
  
  const structure = {
    projectId: serviceAccount.project_id,
    collections: {},
    totalCollections: 0,
    totalDocuments: 0,
    totalSubcollections: 0,
    analyzedAt: new Date().toISOString()
  };

  try {
    // Get all root collections
    const collections = await db.listCollections();
    structure.totalCollections = collections.length;
    
    console.log(`\nFound ${collections.length} root collections\n`);
    console.log('=' * 50);
    
    // Analyze each collection
    for (const collection of collections) {
      const collectionName = collection.id;
      console.log(`\n📁 Collection: ${collectionName}`);
      console.log('-'.repeat(40));
      
      structure.collections[collectionName] = {
        name: collectionName,
        path: collection.path,
        documentCount: 0,
        documents: [],
        fields: new Set(),
        fieldTypes: {},
        sampleDocument: null,
        subcollections: {}
      };
      
      // Get all documents in the collection
      const snapshot = await collection.get();
      const docCount = snapshot.size;
      structure.collections[collectionName].documentCount = docCount;
      structure.totalDocuments += docCount;
      
      console.log(`   📄 Total documents: ${docCount}`);
      
      if (docCount > 0) {
        // Analyze up to 10 documents to understand structure
        const docsToAnalyze = Math.min(docCount, 10);
        console.log(`   🔍 Analyzing ${docsToAnalyze} document(s)...\n`);
        
        let docIndex = 0;
        for (const doc of snapshot.docs) {
          if (docIndex >= docsToAnalyze) break;
          
          const docData = doc.data();
          const docId = doc.id;
          
          // Store document ID
          structure.collections[collectionName].documents.push(docId);
          
          // Store first document as sample
          if (docIndex === 0) {
            structure.collections[collectionName].sampleDocument = {
              id: docId,
              data: docData
            };
          }
          
          console.log(`   Document ${docIndex + 1}: ${docId}`);
          
          // Analyze fields in the document
          analyzeFields(docData, structure.collections[collectionName]);
          
          // Check for subcollections
          try {
            const subcollections = await doc.ref.listCollections();
            if (subcollections.length > 0) {
              console.log(`   └─ Found ${subcollections.length} subcollection(s):`);
              
              for (const subcoll of subcollections) {
                const subcollName = subcoll.id;
                console.log(`      └─ 📂 ${subcollName}`);
                
                // Initialize subcollection info if not exists
                if (!structure.collections[collectionName].subcollections[subcollName]) {
                  structure.collections[collectionName].subcollections[subcollName] = {
                    name: subcollName,
                    documentCount: 0,
                    fields: new Set(),
                    fieldTypes: {},
                    foundInDocuments: []
                  };
                  structure.totalSubcollections++;
                }
                
                // Get subcollection documents
                const subSnapshot = await subcoll.get();
                structure.collections[collectionName].subcollections[subcollName].documentCount += subSnapshot.size;
                structure.collections[collectionName].subcollections[subcollName].foundInDocuments.push(docId);
                
                // Analyze subcollection fields
                if (subSnapshot.size > 0) {
                  const subDoc = subSnapshot.docs[0];
                  const subData = subDoc.data();
                  analyzeFields(subData, structure.collections[collectionName].subcollections[subcollName]);
                }
                
                console.log(`         Documents: ${subSnapshot.size}`);
              }
            }
          } catch (error) {
            console.log(`   ⚠️  Error checking subcollections: ${error.message}`);
          }
          
          docIndex++;
          console.log('');
        }
        
        // Display fields summary
        const fields = Array.from(structure.collections[collectionName].fields);
        console.log(`   📋 Fields found (${fields.length}):`);
        fields.sort().forEach(field => {
          const type = structure.collections[collectionName].fieldTypes[field];
          console.log(`      • ${field} (${type})`);
        });
        
        // Display subcollections summary
        const subcollNames = Object.keys(structure.collections[collectionName].subcollections);
        if (subcollNames.length > 0) {
          console.log(`\n   📂 Subcollections (${subcollNames.length}):`);
          subcollNames.forEach(subcollName => {
            const subcoll = structure.collections[collectionName].subcollections[subcollName];
            console.log(`      • ${subcollName} - ${subcoll.documentCount} documents`);
          });
        }
      }
      
      console.log('\n' + '='.repeat(50));
    }
    
    // Convert Sets to Arrays for JSON serialization
    for (const collName in structure.collections) {
      structure.collections[collName].fields = Array.from(structure.collections[collName].fields);
      
      for (const subcollName in structure.collections[collName].subcollections) {
        structure.collections[collName].subcollections[subcollName].fields = 
          Array.from(structure.collections[collName].subcollections[subcollName].fields);
      }
    }
    
    // Generate summary
    console.log('\n\n📊 DATABASE SUMMARY');
    console.log('='.repeat(50));
    console.log(`Total Root Collections: ${structure.totalCollections}`);
    console.log(`Total Documents: ${structure.totalDocuments}`);
    console.log(`Total Subcollections: ${structure.totalSubcollections}`);
    console.log(`Analysis completed at: ${new Date().toLocaleString()}`);
    
    // Save detailed report
    const reportPath = './firestore-structure-detailed-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(structure, null, 2));
    console.log(`\n✅ Detailed report saved to: ${reportPath}`);
    
    // Generate markdown report
    generateMarkdownReport(structure);
    
  } catch (error) {
    console.error('\n❌ Error analyzing Firestore:', error);
  }
}

function analyzeFields(obj, targetInfo, prefix = '') {
  for (const [key, value] of Object.entries(obj || {})) {
    const fieldPath = prefix ? `${prefix}.${key}` : key;
    targetInfo.fields.add(fieldPath);
    
    // Determine field type
    const fieldType = getFieldType(value);
    targetInfo.fieldTypes[fieldPath] = fieldType;
    
    // Recursively analyze nested objects
    if (fieldType === 'object' && value !== null && !Array.isArray(value) && !(value instanceof admin.firestore.Timestamp)) {
      analyzeFields(value, targetInfo, fieldPath);
    } else if (fieldType === 'array' && value.length > 0) {
      // Analyze array element type
      const elementType = getFieldType(value[0]);
      targetInfo.fieldTypes[fieldPath] = `array<${elementType}>`;
    }
  }
}

function getFieldType(value) {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (value instanceof admin.firestore.Timestamp) return 'timestamp';
  if (value instanceof admin.firestore.DocumentReference) return 'reference';
  if (value instanceof admin.firestore.GeoPoint) return 'geopoint';
  if (value instanceof Date) return 'date';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  return typeof value;
}

function generateMarkdownReport(structure) {
  let markdown = `# Firestore Database Structure Report\n\n`;
  markdown += `**Project ID:** ${structure.projectId}\n\n`;
  markdown += `**Analysis Date:** ${new Date(structure.analyzedAt).toLocaleString()}\n\n`;
  markdown += `## Summary\n\n`;
  markdown += `- **Total Collections:** ${structure.totalCollections}\n`;
  markdown += `- **Total Documents:** ${structure.totalDocuments}\n`;
  markdown += `- **Total Subcollections:** ${structure.totalSubcollections}\n\n`;
  markdown += `## Collections Structure\n\n`;
  
  for (const [collName, collData] of Object.entries(structure.collections)) {
    markdown += `### 📁 ${collName}\n\n`;
    markdown += `- **Path:** \`${collData.path}\`\n`;
    markdown += `- **Document Count:** ${collData.documentCount}\n`;
    markdown += `- **Sample Document IDs:** ${collData.documents.slice(0, 5).join(', ')}${collData.documents.length > 5 ? '...' : ''}\n\n`;
    
    if (collData.fields.length > 0) {
      markdown += `#### Fields\n\n`;
      markdown += `| Field Path | Type |\n`;
      markdown += `|------------|------|\n`;
      collData.fields.forEach(field => {
        markdown += `| \`${field}\` | ${collData.fieldTypes[field]} |\n`;
      });
      markdown += `\n`;
    }
    
    if (Object.keys(collData.subcollections).length > 0) {
      markdown += `#### Subcollections\n\n`;
      for (const [subcollName, subcollData] of Object.entries(collData.subcollections)) {
        markdown += `##### 📂 ${subcollName}\n\n`;
        markdown += `- **Total Documents:** ${subcollData.documentCount}\n`;
        markdown += `- **Found in Documents:** ${subcollData.foundInDocuments.join(', ')}\n\n`;
        
        if (subcollData.fields.length > 0) {
          markdown += `**Fields:**\n\n`;
          markdown += `| Field Path | Type |\n`;
          markdown += `|------------|------|\n`;
          subcollData.fields.forEach(field => {
            markdown += `| \`${field}\` | ${subcollData.fieldTypes[field]} |\n`;
          });
          markdown += `\n`;
        }
      }
    }
    
    if (collData.sampleDocument) {
      markdown += `#### Sample Document\n\n`;
      markdown += `\`\`\`json\n${JSON.stringify(collData.sampleDocument.data, null, 2)}\n\`\`\`\n\n`;
    }
    
    markdown += `---\n\n`;
  }
  
  const mdPath = './firestore-structure-report.md';
  fs.writeFileSync(mdPath, markdown);
  console.log(`📄 Markdown report saved to: ${mdPath}`);
}

// Run the analysis
console.log('Starting Firestore analysis...\n');
analyzeFirestoreStructure()
  .then(() => {
    console.log('\n✅ Analysis complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  });
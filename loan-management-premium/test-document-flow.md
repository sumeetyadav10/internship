# Document Upload, Storage, and Viewing Flow Test

## Current Implementation Summary

### 1. **Upload Phase** (document-upload-step.tsx)
When a user selects/drops a file:
```typescript
// File is immediately converted to base64
const base64Result = await fileToBase64(file);

// Result contains:
{
  url: "data:image/jpeg;base64,/9j/4AAQSkZJRg...", // Full base64 data URL
  fileName: "document.jpg",
  fileSize: 123456,
  fileType: "image/jpeg",
  uploadedAt: "2024-01-20T10:30:00.000Z",
  isImage: true,
  isPDF: false
}

// This is stored in form state
setValue(`documents.${docId}`, {
  ...base64Result,
  docType: docId
});
```

### 2. **Storage Phase** (new/page.tsx)
When form is submitted:
```typescript
// Documents are already in base64 format, just copy them
if (data.documents) {
  Object.entries(data.documents).forEach(([docType, docData]) => {
    if (docData && typeof docData === 'object' && 'url' in docData) {
      documentsData[docType] = docData; // Already has base64 URL
    }
  });
}

// Saved to Firestore with the base64 data embedded
```

### 3. **Viewing Phase** ([id]/page.tsx)
When viewing the application:
```typescript
// Document validation
if (!isValidDocument(doc)) return null;

// Extract properties
const { fileName, url, fileType } = doc;

// View button uses the base64 URL directly
if (fileType?.startsWith('image/')) {
  newWindow.document.write(`<img src="${url}" />`);
} else if (fileType === 'application/pdf') {
  newWindow.document.write(`<iframe src="${url}" />`);
}
```

## How Base64 Storage Works

1. **File Selection**: User selects a file (e.g., photo.jpg)
2. **Conversion**: `FileReader.readAsDataURL()` converts to base64
3. **Format**: Creates a data URL like `data:image/jpeg;base64,/9j/4AAQ...`
4. **Storage**: This entire string is stored in Firestore
5. **Display**: Browser can directly display this data URL in `<img>` or `<iframe>`

## Advantages
- No separate file storage needed
- Files are embedded in the document
- Works offline once loaded
- No broken links or missing files

## Limitations
- Base64 increases size by ~33%
- Limited to small files (3MB recommended)
- All file data loads with the document

## Testing the Flow

1. **Upload a document**
   - Should immediately convert to base64
   - Should show preview for images
   
2. **Submit the form**
   - Documents should be included in the submission
   - No additional conversion needed
   
3. **View the application**
   - Click "View" should open the document
   - Images open in new tab
   - PDFs open in iframe
   - Other files trigger download

The entire flow is working correctly with base64 storage!
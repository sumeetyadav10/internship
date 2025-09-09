# Testing Document Upload

## Prerequisites
1. Make sure your development server is running: `npm run dev`
2. Make sure you're logged into the application

## Method 1: Using Python Script (Recommended)

1. Run the Python test script:
```bash
python3 test-document-upload.py
```

2. When prompted, enter your authentication token:
   - Open Chrome DevTools (F12)
   - Go to Application > IndexedDB > firebaseLocalStorageDb > firebase:authUser
   - Find the `stsTokenManager.accessToken` value
   - Copy the token (without quotes)

3. The script will:
   - Automatically find an image in your Downloads folder
   - Create a test application with the image
   - Show you the results

## Method 2: Using cURL

1. Get your auth token (same as above)

2. Find an image file path, for example:
```bash
ls ~/Downloads/*.jpg ~/Downloads/*.png | head -1
```

3. Run the test:
```bash
./test-upload.sh YOUR_AUTH_TOKEN ~/Downloads/your-image.jpg
```

## Method 3: Manual Browser Test

1. Go to http://localhost:3000/dashboard/applications/new
2. Fill in the form with test data
3. Upload documents in the Documents step
4. Submit the form
5. Check the browser console for any errors
6. Check Firebase Console to verify:
   - Firestore: The application document is created
   - Storage: The uploaded files are stored

## What to Check

After running the test, verify:

1. **Response includes**:
   - `success: true`
   - `applicationId` (should be like `LMS20250108xxxx`)
   - `documentsUploaded: 1`
   - `documentDetails` with file info

2. **In Firebase Console**:
   - Go to Firestore > loan_applications
   - Find the new document with the applicationId
   - Check the `documents` field contains:
     ```json
     {
       "applicantPan": {
         "url": "https://firebasestorage.googleapis.com/...",
         "fileName": "your-image.jpg",
         "fileSize": 12345,
         "fileType": "image/jpeg",
         "uploadedAt": "2025-01-08T...",
         "docType": "applicantPan"
       }
     }
     ```

3. **In Firebase Storage**:
   - Go to Storage
   - Navigate to `test-uploads/[userId]/documents/`
   - Verify the uploaded file exists

## Troubleshooting

1. **401 Unauthorized**: Token is invalid or expired - re-login and get new token
2. **500 Server Error**: Check server logs in terminal running `npm run dev`
3. **File too large**: Ensure image is under 5MB
4. **Network error**: Make sure dev server is running on port 3000

## Sample cURL Command

If you prefer raw cURL:

```bash
curl -X POST "http://localhost:3000/api/test-upload" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "document=@/Users/sumeet/Downloads/test-image.jpg" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "mobileNo=9876543210" \
  -F "email=john@example.com" \
  -F "aadharNo=123456789012" \
  -F "panNo=ABCDE1234F" \
  -F "loanAmount=100000" \
  -F "interestRate=12" \
  -F "tenure=12" \
  -F "suretyFirstName=Jane" \
  -F "suretyLastName=Smith" \
  -F "suretyMobile=8888888888" \
  -F "suretyEmail=jane@example.com" \
  -F "suretyAadhar=987654321098" \
  -F "suretyPan=ZYXWV9876A"
```
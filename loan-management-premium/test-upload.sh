#!/bin/bash

# Test Document Upload Script
# Usage: ./test-upload.sh <auth-token> <image-file-path>

# Check if auth token is provided
if [ -z "$1" ]; then
    echo "Error: Authentication token required"
    echo "Usage: ./test-upload.sh <auth-token> <image-file-path>"
    echo ""
    echo "To get your auth token:"
    echo "1. Open the app in Chrome"
    echo "2. Open DevTools (F12)"
    echo "3. Go to Application > Storage > IndexedDB > firebaseLocalStorageDb"
    echo "4. Find the token in firebase:authUser"
    exit 1
fi

# Check if image file is provided
if [ -z "$2" ]; then
    echo "Error: Image file path required"
    echo "Usage: ./test-upload.sh <auth-token> <image-file-path>"
    exit 1
fi

# Check if file exists
if [ ! -f "$2" ]; then
    echo "Error: File not found: $2"
    exit 1
fi

AUTH_TOKEN=$1
IMAGE_FILE=$2
API_URL="http://localhost:3000/api/test-upload"

echo "Testing document upload..."
echo "File: $IMAGE_FILE"
echo ""

# Make the request
curl -X POST "$API_URL" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -F "document=@$IMAGE_FILE" \
  -F "firstName=John" \
  -F "lastName=Doe" \
  -F "mobileNo=9876543210" \
  -F "email=john.doe@example.com" \
  -F "aadharNo=123456789012" \
  -F "panNo=ABCDE1234F" \
  -F "loanAmount=500000" \
  -F "interestRate=10.5" \
  -F "tenure=36" \
  -F "suretyFirstName=Jane" \
  -F "suretyLastName=Smith" \
  -F "suretyMobile=9876543211" \
  -F "suretyEmail=jane.smith@example.com" \
  -F "suretyAadhar=987654321098" \
  -F "suretyPan=ZYXWV9876A" \
  | jq .

echo ""
echo "Test completed!"
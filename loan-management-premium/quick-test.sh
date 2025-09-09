#!/bin/bash

# Quick test with your auth token
# This will find the first image in your Downloads folder and test the upload

echo "Looking for an image in Downloads folder..."

# Find first image file in Downloads
IMAGE_FILE=$(find ~/Downloads -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.gif" \) 2>/dev/null | head -1)

if [ -z "$IMAGE_FILE" ]; then
    echo "No image found in Downloads folder!"
    echo "Creating a test image..."
    
    # Create a simple test image using ImageMagick if available
    if command -v convert &> /dev/null; then
        convert -size 100x100 xc:blue ~/Downloads/test_image.jpg
        IMAGE_FILE=~/Downloads/test_image.jpg
        echo "Created test image: $IMAGE_FILE"
    else
        echo "Please add an image file to your Downloads folder and run again"
        exit 1
    fi
fi

echo "Found image: $IMAGE_FILE"
echo "File size: $(ls -lh "$IMAGE_FILE" | awk '{print $5}')"
echo ""

# Your auth token
AUTH_TOKEN="eyJhbGciOiJSUzI1NiIsImtpZCI6ImUzZWU3ZTAyOGUzODg1YTM0NWNlMDcwNTVmODQ2ODYyMjU1YTcwNDYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbG9hbm1hbmFnZW1lbnQtY2E3ZTEiLCJhdWQiOiJsb2FubWFuYWdlbWVudC1jYTdlMSIsImF1dGhfdGltZSI6MTc1NzM1MjIwMywidXNlcl9pZCI6IktOQkxEeDlOeURUY0E5d2xHSWpUQU1LYkZDRzIiLCJzdWIiOiJLTkJMRHg5TnlEVGNBOXdsR0lqVEFNS2JGQ0cyIiwiaWF0IjoxNzU3MzUyMjAzLCJleHAiOjE3NTczNTU4MDMsImVtYWlsIjoibG9hbmdvYUBhZG1pbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsibG9hbmdvYUBhZG1pbi5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.RuGORO-p4QTtyNmI2ZBg6keFmM_xBRkG4oUgXT9XDd_s60T99CcAtNSpK6wrqyz-An8KnUGWC9omVkV95ABU5wWrSiHf5Li69zOyN9-EgKDXFX8g8KNuR2xCbph7ULWN9bCm5ZC7P2OYCyaIc-DJ0n8iE3Du8s5ROuab17FeYM8uTkSaHmZy1yvYbhDMmQNjaKRWTJTjTxD4PY6Nc4Bw391rUwWDZj2ulTrPbi-FK0v9tKCWBEk5M8bznsMk4brmzUIk3TyjPP4WTUyLRORBLwQ5XIul2okmVB74L7YgGPwFJeb6Nvfr0y2OZSIsJOzLwEeo1qvatLemsEoJJujqaQ"

echo "Testing document upload..."
echo "========================================"

# Make the API call
curl -X POST "http://localhost:3000/api/test-upload" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -F "document=@$IMAGE_FILE" \
  -F "firstName=Test" \
  -F "lastName=User" \
  -F "mobileNo=9876543210" \
  -F "email=test@example.com" \
  -F "aadharNo=123456789012" \
  -F "panNo=ABCDE1234F" \
  -F "addressLine1=123 Test Street" \
  -F "district=D001" \
  -F "taluka=T001" \
  -F "villageCity=V001" \
  -F "pincode=400001" \
  -F "loanAmount=100000" \
  -F "interestRate=12" \
  -F "tenure=12" \
  -F "suretyFirstName=Surety" \
  -F "suretyLastName=Person" \
  -F "suretyMobile=8888888888" \
  -F "suretyEmail=surety@example.com" \
  -F "suretyAadhar=987654321098" \
  -F "suretyPan=ZYXWV9876A" | python3 -m json.tool

echo ""
echo "========================================"
echo "Test completed!"
echo ""
echo "Check Firebase Console:"
echo "1. Firestore: Look for the new document in 'loan_applications' collection"
echo "2. Storage: Check 'test-uploads/KNBLDx9NyDTcA9wlGIjTAMKbFCG2/documents/' folder"
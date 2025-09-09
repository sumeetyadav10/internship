#!/bin/bash

# Quick test with PDF file
echo "Looking for a PDF in Downloads folder..."

# Find first PDF file in Downloads
PDF_FILE=$(find ~/Downloads -type f -iname "*.pdf" 2>/dev/null | head -1)

if [ -z "$PDF_FILE" ]; then
    echo "No PDF found in Downloads folder!"
    echo "Please add a PDF file to your Downloads folder and run again"
    exit 1
fi

echo "Found PDF: $PDF_FILE"
echo "File size: $(ls -lh "$PDF_FILE" | awk '{print $5}')"
echo ""

# Your auth token
AUTH_TOKEN="eyJhbGciOiJSUzI1NiIsImtpZCI6ImUzZWU3ZTAyOGUzODg1YTM0NWNlMDcwNTVmODQ2ODYyMjU1YTcwNDYiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vbG9hbm1hbmFnZW1lbnQtY2E3ZTEiLCJhdWQiOiJsb2FubWFuYWdlbWVudC1jYTdlMSIsImF1dGhfdGltZSI6MTc1NzM1MjIwMywidXNlcl9pZCI6IktOQkxEeDlOeURUY0E5d2xHSWpUQU1LYkZDRzIiLCJzdWIiOiJLTkJMRHg5TnlEVGNBOXdsR0lqVEFNS2JGQ0cyIiwiaWF0IjoxNzU3MzUyMjAzLCJleHAiOjE3NTczNTU4MDMsImVtYWlsIjoibG9hbmdvYUBhZG1pbi5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsibG9hbmdvYUBhZG1pbi5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwYXNzd29yZCJ9fQ.RuGORO-p4QTtyNmI2ZBg6keFmM_xBRkG4oUgXT9XDd_s60T99CcAtNSpK6wrqyz-An8KnUGWC9omVkV95ABU5wWrSiHf5Li69zOyN9-EgKDXFX8g8KNuR2xCbph7ULWN9bCm5ZC7P2OYCyaIc-DJ0n8iE3Du8s5ROuab17FeYM8uTkSaHmZy1yvYbhDMmQNjaKRWTJTjTxD4PY6Nc4Bw391rUwWDZj2ulTrPbi-FK0v9tKCWBEk5M8bznsMk4brmzUIk3TyjPP4WTUyLRORBLwQ5XIul2okmVB74L7YgGPwFJeb6Nvfr0y2OZSIsJOzLwEeo1qvatLemsEoJJujqaQ"

echo "Testing PDF document upload..."
echo "========================================"

# Make the API call
curl -X POST "http://localhost:3000/api/test-upload" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -F "document=@$PDF_FILE" \
  -F "firstName=PDF" \
  -F "lastName=Test" \
  -F "mobileNo=9876543211" \
  -F "email=pdftest@example.com" \
  -F "aadharNo=123456789013" \
  -F "panNo=ABCDE1234G" \
  -F "addressLine1=123 PDF Test Street" \
  -F "district=D001" \
  -F "taluka=T001" \
  -F "villageCity=V001" \
  -F "pincode=400001" \
  -F "loanAmount=200000" \
  -F "interestRate=12" \
  -F "tenure=24" \
  -F "suretyFirstName=PDF" \
  -F "suretyLastName=Surety" \
  -F "suretyMobile=8888888889" \
  -F "suretyEmail=pdfsurety@example.com" \
  -F "suretyAadhar=987654321099" \
  -F "suretyPan=ZYXWV9876B" | python3 -m json.tool

echo ""
echo "========================================"
echo "Test completed!"
echo ""
echo "Check the application in your browser to test the PDF viewer"
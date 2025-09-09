#!/usr/bin/env python3
"""
Test Document Upload Script
Tests the loan application API with document upload

Usage: python3 test-document-upload.py
"""

import requests
import os
import json
import sys
from datetime import datetime

# Configuration
API_URL = "http://localhost:3000/api/test-upload"

# Test data
TEST_APPLICATION = {
    "firstName": "Test",
    "lastName": "User",
    "dateOfBirth": "1990-01-01",
    "gender": "Male", 
    "mobileNo": "9999999999",
    "email": "test@example.com",
    "aadharNo": "123456789012",
    "panNo": "ABCDE1234F",
    "addressLine1": "123 Test Street",
    "district": "D001",
    "taluka": "T001", 
    "villageCity": "V001",
    "pincode": "400001",
    "industryName": "Test Business",
    "loanReason": "Business Expansion",
    "residentialAddress": "Same as above",
    "loanType": "Term Loan",
    "loanAmount": "100000",
    "interestRate": "12",
    "tenure": "12",
    "suretyFirstName": "Surety",
    "suretyLastName": "Person",
    "suretyDob": "1985-01-01",
    "suretyGender": "Male",
    "suretyMobile": "8888888888",
    "suretyEmail": "surety@example.com",
    "suretyAadhar": "987654321098",
    "suretyPan": "ZYXWV9876A",
    "suretyBankName": "Test Bank",
    "suretyBankBranch": "Test Branch",
    "suretyAccountNo": "1234567890",
    "suretyAddress": "456 Surety Street",
    "suretyDistrict": "D001",
    "suretyTaluka": "T001",
    "suretyVillage": "V001",
    "suretyPincode": "400002"
}

def get_auth_token():
    """Get auth token from user input"""
    print("To get your auth token:")
    print("1. Open the app in Chrome")
    print("2. Open DevTools (F12)")
    print("3. Go to Network tab")
    print("4. Make any authenticated request")
    print("5. Look for 'Authorization: Bearer ...' in request headers")
    print()
    
    token = input("Enter your auth token (without 'Bearer '): ").strip()
    return token

def create_test_image():
    """Create a small test image if none exists"""
    try:
        from PIL import Image
        
        # Create a simple 100x100 test image
        img = Image.new('RGB', (100, 100), color='blue')
        img_path = 'test_document.jpg'
        img.save(img_path, 'JPEG')
        print(f"Created test image: {img_path}")
        return img_path
    except ImportError:
        print("PIL not installed. Using any existing image...")
        # Look for any image in Downloads
        downloads = os.path.expanduser("~/Downloads")
        for file in os.listdir(downloads):
            if file.lower().endswith(('.jpg', '.jpeg', '.png', '.gif')):
                return os.path.join(downloads, file)
        return None

def test_upload(token, image_path):
    """Test the document upload endpoint"""
    
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    # Prepare form data
    form_data = TEST_APPLICATION.copy()
    
    # Prepare files
    files = {}
    if image_path and os.path.exists(image_path):
        files['document'] = ('test_document.jpg', open(image_path, 'rb'), 'image/jpeg')
        print(f"Using image: {image_path}")
    else:
        print("No image file provided, testing without document upload")
    
    print("\nSending test request...")
    
    try:
        response = requests.post(
            API_URL,
            headers=headers,
            data=form_data,
            files=files
        )
        
        # Close file if opened
        if files:
            files['document'][1].close()
        
        print(f"\nResponse Status: {response.status_code}")
        print("\nResponse Body:")
        
        if response.headers.get('content-type', '').startswith('application/json'):
            print(json.dumps(response.json(), indent=2))
        else:
            print(response.text)
            
        if response.status_code == 200:
            print("\n✅ Test PASSED! Document upload working correctly.")
            data = response.json()
            if 'applicationId' in data:
                print(f"\nApplication ID: {data['applicationId']}")
                print(f"Documents uploaded: {data.get('documentsUploaded', 0)}")
                if 'documentDetails' in data:
                    print("\nDocument details:")
                    print(json.dumps(data['documentDetails'], indent=2))
        else:
            print("\n❌ Test FAILED!")
            
    except requests.exceptions.RequestException as e:
        print(f"\n❌ Request failed: {e}")
        print("\nMake sure the development server is running:")
        print("npm run dev")
    except Exception as e:
        print(f"\n❌ Error: {e}")

def main():
    """Main test function"""
    print("=== Document Upload Test ===\n")
    
    # Get auth token
    token = get_auth_token()
    if not token:
        print("No token provided. Exiting.")
        return
    
    # Find or create test image
    image_path = None
    
    # First try to find an image in Downloads
    downloads = os.path.expanduser("~/Downloads")
    print(f"\nLooking for images in {downloads}...")
    
    image_extensions = ('.jpg', '.jpeg', '.png', '.gif', '.webp')
    for file in os.listdir(downloads):
        if file.lower().endswith(image_extensions):
            image_path = os.path.join(downloads, file)
            file_size = os.path.getsize(image_path) / (1024 * 1024)  # MB
            if file_size <= 5:  # Less than 5MB
                print(f"Found image: {file} ({file_size:.2f} MB)")
                break
    
    if not image_path:
        print("No suitable image found in Downloads")
        image_path = create_test_image()
    
    if not image_path:
        print("\nNo image available. Testing without document...")
    
    # Run the test
    test_upload(token, image_path)
    
    # Cleanup test image if we created it
    if image_path == 'test_document.jpg' and os.path.exists(image_path):
        os.remove(image_path)
        print("\nCleaned up test image")

if __name__ == "__main__":
    main()
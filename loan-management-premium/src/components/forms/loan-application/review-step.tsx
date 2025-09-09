"use client";

import { useFormContext } from "react-hook-form";
import { formatCurrency } from "@/lib/utils";
import { useMasters } from "@/hooks/useMasters";

export function ReviewStep() {
  const { watch } = useFormContext();
  const formData = watch();
  const { districts, talukas, villages } = useMasters();
  
  // Helper function to get location names from codes
  const getLocationName = (type: 'district' | 'taluka' | 'village', code: string) => {
    if (!code) return '-';
    
    switch(type) {
      case 'district':
        return districts.find(d => d.code === code)?.name || code;
      case 'taluka':
        return talukas.find(t => t.code === code)?.name || code;
      case 'village':
        return villages.find(v => v.code === code)?.name || code;
      default:
        return code;
    }
  };

  return (
    <div>
      <h2 className="section-title">Review Application Details</h2>
      <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '30px' }}>Please review all the information before submitting</p>

      {/* Applicant Information Review */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#495057', marginBottom: '20px' }}>Applicant Information</h3>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Name</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>
                {`${formData['applicantDetails']?.['salutation'] || ""} ${formData['applicantDetails']?.['firstName']} ${formData['applicantDetails']?.['middleName'] || ""} ${formData['applicantDetails']?.['lastName']}`.trim()}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Mobile Number</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['applicantDetails']?.['mobileNo']}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Email</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['applicantDetails']?.['email']}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Aadhar Number</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['applicantDetails']?.['aadharNo']}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>District</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{getLocationName('district', formData['applicantDetails']?.['district'])}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Taluka</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{getLocationName('taluka', formData['applicantDetails']?.['taluka'])}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Village/City</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{getLocationName('village', formData['applicantDetails']?.['villageCity'])}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Pincode</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['applicantDetails']?.['pincode']}</p>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Industry/Unit Name</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['applicantDetails']?.['industryName']}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Loan Details Review */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#495057', marginBottom: '20px' }}>Loan Details</h3>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            {formData['loanDetails']?.['workingCapital1'] > 0 && (
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Loan for Working Capital</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formatCurrency(formData['loanDetails']?.['workingCapital1'] || 0)}</p>
              </div>
            )}
            {formData['loanDetails']?.['katchaStructure1'] > 0 && (
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Loan for Katcha Structure</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formatCurrency(formData['loanDetails']?.['katchaStructure1'] || 0)}</p>
              </div>
            )}
            {formData['loanDetails']?.['machinery1'] > 0 && (
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Loan for Machinery</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formatCurrency(formData['loanDetails']?.['machinery1'] || 0)}</p>
              </div>
            )}
            {formData['loanDetails']?.['godown1'] > 0 && (
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Loan for Godown</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formatCurrency(formData['loanDetails']?.['godown1'] || 0)}</p>
              </div>
            )}
            {formData['loanDetails']?.['workingCapital2'] > 0 && (
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Short term loan for stocking</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formatCurrency(formData['loanDetails']?.['workingCapital2'] || 0)}</p>
              </div>
            )}
            {formData['loanDetails']?.['machinery2'] > 0 && (
              <div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Loan for Pucca structure</p>
                <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formatCurrency(formData['loanDetails']?.['machinery2'] || 0)}</p>
              </div>
            )}
          </div>
          <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '16px', color: '#495057', fontWeight: '600' }}>Total Loan Amount</p>
              <p style={{ fontSize: '20px', color: '#007bff', fontWeight: '700' }}>
                {formatCurrency(formData['loanDetails']?.['totalAmount'] || 0)}
              </p>
            </div>
            {formData['loanDetails']?.['totalInWords'] && (
              <p style={{ fontSize: '14px', color: '#6c757d', marginTop: '5px' }}>
                {formData['loanDetails']?.['totalInWords']} Rupees Only
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Surety Details Review */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#495057', marginBottom: '20px' }}>Surety Details</h3>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Surety Name</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['suretyDetails']?.['suretyName']}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Relation</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['suretyDetails']?.['relation']}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Occupation</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['suretyDetails']?.['occupation']}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Mobile Number</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['suretyDetails']?.['mobileNo']}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Aadhar Number</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>{formData['suretyDetails']?.['aadharNo']}</p>
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '5px' }}>Bank Details</p>
              <p style={{ fontSize: '15px', color: '#495057', fontWeight: '500' }}>
                {formData['suretyDetails']?.['bankName']} - {formData['suretyDetails']?.['bankBranch']}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Review */}
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#495057', marginBottom: '20px' }}>Documents Uploaded</h3>
        <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
            {Object.entries(formData['documents'] || {}).filter(([_, value]) => value && typeof value === 'object' && (value.url || value.file)).map(([key, value]) => {
              // Convert camelCase document keys to readable labels
              const docLabels = {
                'applicantPan': 'Applicant PAN Card',
                'applicantAadhar': 'Applicant Aadhar Card', 
                'applicantPhoto': 'Applicant Passport Photo',
                'incomeCertificate': 'Income Certificate',
                'bankStatement': 'Bank Statement',
                'businessLicense': 'Business License',
                'propertyPapers': 'Property Papers',
                'suretyPan': 'Surety PAN Card',
                'suretyAadhar': 'Surety Aadhar Card',
                'suretyPhoto': 'Surety Passport Photo',
                'suretyIncome': 'Surety Income Proof'
              };

              return (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="20" height="20" fill="#28a745" viewBox="0 0 20 20">
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  <span style={{ fontSize: '14px', color: '#495057' }}>
                    {docLabels[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Confirmation Notice */}
      <div style={{ 
        background: '#d4edda', 
        padding: '20px', 
        borderRadius: '8px', 
        border: '1px solid #c3e6cb',
        marginBottom: '20px' 
      }}>
        <h4 style={{ fontSize: '16px', color: '#155724', marginBottom: '10px', fontWeight: '600' }}>Ready to Submit</h4>
        <p style={{ fontSize: '14px', color: '#155724', margin: 0 }}>
          Please ensure all the information provided above is accurate. Once submitted, you cannot edit this application.
        </p>
      </div>
    </div>
  );
}
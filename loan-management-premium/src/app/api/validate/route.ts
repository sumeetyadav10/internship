import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { formSchema } from '@/lib/validations/loan-application';
// import { auth } from '@/lib/firebase-admin'; // TODO: Configure Firebase Admin SDK

function sanitizeInput(obj: any): any {
  if (typeof obj === 'string') {
    // Remove dangerous patterns
    return obj
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  } else if (Array.isArray(obj)) {
    return obj.map(sanitizeInput);
  } else if (typeof obj === 'object' && obj !== null) {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeInput(obj[key]);
      }
    }
    return sanitized;
  }
  return obj;
}

export async function POST(request: NextRequest) {
  try {
    // Get auth token from headers
    const headersList = await headers();
    const authorization = headersList.get('authorization');
    
    if (!authorization?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // const token = authorization.slice(7);
    
    try {
      // TODO: Verify the token when Firebase Admin is configured
      // const token = authorization.slice(7);
      // const decodedToken = await auth.verifyIdToken(token);
      const decodedToken = { uid: 'test-user' }; // Temporary for testing
      
      // Get the request body
      const body = await request.json();
      
      // Sanitize input
      const sanitizedData = sanitizeInput(body);
      
      // Validate against schema
      const validation = formSchema.safeParse(sanitizedData);
      
      if (!validation.success) {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: validation.error.flatten()
          },
          { status: 400 }
        );
      }
      
      // Additional business logic validation
      const { applicantDetails, loanDetails } = validation.data;
      
      // Check if loan amount is reasonable
      const maxLoanAmount = 10000000; // 1 crore
      const totalLoanAmount = [
        loanDetails.workingCapital1,
        loanDetails.katchaStructure1,
        loanDetails.machinery1,
        loanDetails.godown1,
        loanDetails.grant1,
        loanDetails.workingCapital2,
        loanDetails.katchaStructure2,
        loanDetails.machinery2,
        loanDetails.godown2,
        loanDetails.grant2,
        loanDetails.termLoanBudget1,
        loanDetails.termLoanBudget2
      ].reduce<number>((sum, val) => sum + (parseFloat(val?.toString() || '0') || 0), 0);
      
      if (totalLoanAmount > maxLoanAmount) {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: {
              loanDetails: ['Total loan amount exceeds maximum allowed limit']
            }
          },
          { status: 400 }
        );
      }
      
      // Check age eligibility (18-65 years)
      const birthYear = parseInt(applicantDetails.year || '0');
      const currentYear = new Date().getFullYear();
      const age = currentYear - birthYear;
      
      if (age < 18 || age > 65) {
        return NextResponse.json(
          { 
            error: 'Validation failed',
            details: {
              applicantDetails: {
                year: ['Applicant must be between 18 and 65 years old']
              }
            }
          },
          { status: 400 }
        );
      }
      
      // Return success with sanitized data
      return NextResponse.json({
        success: true,
        data: validation.data,
        userId: decodedToken.uid
      });
      
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Validation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
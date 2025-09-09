import { NextRequest, NextResponse } from 'next/server';
import { getApplicationById } from '@/services/applications';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const applicationId = searchParams.get('id');
  
  if (!applicationId) {
    return NextResponse.json({ error: 'Application ID required' }, { status: 400 });
  }
  
  try {
    const application = await getApplicationById(applicationId);
    
    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }
    
    // Debug information
    const debugInfo = {
      id: application.id,
      formNumber: application.formNumber,
      status: application.status,
      hasDocuments: !!application.documents,
      documentCount: application.documents ? Object.keys(application.documents).length : 0,
      documentKeys: application.documents ? Object.keys(application.documents) : [],
      documents: application.documents || {},
      // Check each document
      documentDetails: application.documents ? Object.entries(application.documents).map(([key, doc]) => ({
        key,
        hasData: !!doc,
        type: typeof doc,
        hasUrl: doc && typeof doc === 'object' && 'url' in doc,
        urlLength: doc && typeof doc === 'object' && 'url' in doc ? doc.url?.length : 0,
        fileName: doc && typeof doc === 'object' && 'fileName' in doc ? doc.fileName : 'N/A',
        fileType: doc && typeof doc === 'object' && 'fileType' in doc ? doc.fileType : 'N/A',
        structure: doc ? Object.keys(doc) : []
      })) : []
    };
    
    return NextResponse.json(debugInfo, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to fetch application', 
      message: error.message 
    }, { status: 500 });
  }
}
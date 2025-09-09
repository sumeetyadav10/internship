"use client";

import { useState, useRef } from "react";
import { useFormContext } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
// Removed glass UI component import
import { 
  Upload, 
  FileImage, 
  X, 
  CheckCircle,
  AlertCircle,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";
import { validateBase64FileSize, fileToBase64 } from "@/services/base64-upload";

interface FilePreview {
  file: File;
  preview: string;
  progress: number;
  error?: string;
}

const documentTypes = [
  { id: "applicantPan", label: "Applicant PAN Card", required: true, accept: "image/*,.pdf" },
  { id: "applicantAadhar", label: "Applicant Aadhar Card", required: true, accept: "image/*,.pdf" },
  { id: "applicantPhoto", label: "Applicant Passport Photo", required: true, accept: "image/*" },
  { id: "incomeCertificate", label: "Income Certificate", required: true, accept: "image/*,.pdf" },
  { id: "bankStatement", label: "Bank Statement", required: false, accept: ".pdf,.jpg,.jpeg,.png" },
  { id: "businessLicense", label: "Business License", required: false, accept: "image/*,.pdf" },
  { id: "propertyPapers", label: "Property Papers", required: false, accept: "image/*,.pdf" },
  { id: "suretyPan", label: "Surety PAN Card", required: true, accept: "image/*,.pdf" },
  { id: "suretyAadhar", label: "Surety Aadhar Card", required: true, accept: "image/*,.pdf" },
  { id: "suretyPhoto", label: "Surety Passport Photo", required: true, accept: "image/*" },
  { id: "suretyIncome", label: "Surety Income Proof", required: false, accept: "image/*,.pdf" }
];

export function DocumentUploadStep() {
  const { setValue, watch } = useFormContext();
  const [dragActive, setDragActive] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<Record<string, FilePreview>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement>>({});
  
  const documents = watch("documents") || {};

  const handleDrag = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(docId);
    } else if (e.type === "dragleave") {
      setDragActive(null);
    }
  };

  const handleDrop = (e: React.DragEvent, docId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0], docId);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, docId: string) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0], docId);
    }
  };

  const handleFile = async (file: File, docId: string) => {
    // Validate file size for base64 storage (max 3MB)
    const validation = validateBase64FileSize(file, 3);
    if (!validation.valid) {
      setFilePreviews(prev => ({
        ...prev,
        [docId]: {
          file,
          preview: "",
          progress: 0,
          error: validation.error
        }
      }));
      return;
    }

    // Set initial preview state
    setFilePreviews(prev => ({
      ...prev,
      [docId]: {
        file,
        preview: "",
        progress: 50
      }
    }));

    try {
      // Convert file to base64 immediately
      const base64Result = await fileToBase64(file);
      
      // Update preview with base64 result
      setFilePreviews(prev => ({
        ...prev,
        [docId]: {
          file,
          preview: file.type.startsWith("image/") ? base64Result.url : "",
          progress: 100
        }
      }));

      // Update form data with base64 result instead of File object
      setValue(`documents.${docId}`, {
        ...base64Result,
        docType: docId
      });
    } catch (error) {
      console.error(`Error converting ${docId} to base64:`, error);
      setFilePreviews(prev => ({
        ...prev,
        [docId]: {
          file,
          preview: "",
          progress: 0,
          error: "Failed to process file. Please try again."
        }
      }));
    }
  };

  const removeFile = (docId: string) => {
    setFilePreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[docId];
      return newPreviews;
    });

    setValue(`documents.${docId}`, undefined);
  };

  return (
    <div>
      <div className="section-title">Document Upload</div>
      <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '30px' }}>Please upload the required documents</p>

      <div style={{ display: 'grid', gap: '20px' }}>
        {documentTypes.map((docType) => {
          const filePreview = filePreviews[docType.id];
          const isUploaded = documents[docType.id] || filePreview;

          return (
            <motion.div
              key={docType.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                border: dragActive === docType.id 
                  ? '2px dashed #007bff' 
                  : isUploaded 
                  ? '2px dashed #28a745' 
                  : '2px dashed #ced4da',
                borderRadius: '8px',
                padding: '20px',
                background: dragActive === docType.id 
                  ? '#e7f3ff' 
                  : isUploaded 
                  ? '#d4edda' 
                  : 'white',
                transition: 'all 0.3s ease'
              }}
              onDragEnter={(e) => handleDrag(e, docType.id)}
              onDragLeave={(e) => handleDrag(e, docType.id)}
              onDragOver={(e) => handleDrag(e, docType.id)}
              onDrop={(e) => handleDrop(e, docType.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    <h3 style={{ fontWeight: '600', color: '#495057', fontSize: '16px', margin: 0 }}>
                      {docType.label}
                      {docType.required && <span style={{ color: '#dc3545', marginLeft: '4px' }}>*</span>}
                    </h3>
                    {isUploaded && (
                      <CheckCircle style={{ width: '20px', height: '20px', color: '#28a745' }} />
                    )}
                  </div>

                  {!isUploaded ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      <p style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>
                        Drag and drop or click to upload
                      </p>
                      <input
                        type="file"
                        ref={(ref) => {
                          if (ref) fileInputRefs.current[docType.id] = ref;
                        }}
                        onChange={(e) => handleFileSelect(e, docType.id)}
                        accept={docType.accept}
                        style={{ display: 'none' }}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[docType.id]?.click()}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 20px',
                          background: '#007bff',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          cursor: 'pointer',
                          alignSelf: 'flex-start'
                        }}
                      >
                        <Upload style={{ width: '16px', height: '16px' }} />
                        Choose File
                      </button>
                    </div>
                  ) : (
                    <AnimatePresence>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                      >
                        {filePreview?.error ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#dc3545' }}>
                            <AlertCircle style={{ width: '16px', height: '16px' }} />
                            <span style={{ fontSize: '14px' }}>{filePreview.error}</span>
                          </div>
                        ) : (
                          <>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <FileImage style={{ width: '20px', height: '20px', color: '#6c757d' }} />
                              <span style={{ fontSize: '14px', color: '#495057', flex: 1 }}>
                                {filePreview?.file.name || documents[docType.id]?.fileName}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(docType.id)}
                                style={{
                                  padding: '4px',
                                  background: 'transparent',
                                  border: 'none',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  color: '#6c757d'
                                }}
                              >
                                <X style={{ width: '16px', height: '16px' }} />
                              </button>
                            </div>

                            {filePreview?.progress && filePreview.progress < 100 && (
                              <div style={{ width: '100%', background: '#e9ecef', borderRadius: '4px', height: '8px' }}>
                                <motion.div
                                  style={{
                                    background: '#007bff',
                                    height: '8px',
                                    borderRadius: '4px'
                                  }}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${filePreview.progress}%` }}
                                  transition={{ duration: 0.3 }}
                                />
                              </div>
                            )}

                            {filePreview?.preview && (
                              <div style={{ marginTop: '15px', position: 'relative' }}>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={filePreview.preview}
                                  alt={docType.label}
                                  style={{
                                    width: '120px',
                                    height: '120px',
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    border: '1px solid #dee2e6'
                                  }}
                                />
                              </div>
                            )}
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: '#e7f3ff',
        borderRadius: '8px',
        border: '1px solid #b8daff'
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#004085', marginBottom: '10px' }}>Upload Guidelines</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', color: '#004085' }}>
          <li style={{ marginBottom: '5px' }}>• Maximum file size: 3MB per document</li>
          <li style={{ marginBottom: '5px' }}>• Accepted formats: JPG, PNG, PDF</li>
          <li style={{ marginBottom: '5px' }}>• Ensure documents are clear and readable</li>
          <li style={{ marginBottom: '5px' }}>• All mandatory documents must be uploaded</li>
          <li style={{ marginBottom: '5px' }}>• Documents are stored securely in the database</li>
        </ul>
      </div>
    </div>
  );
}
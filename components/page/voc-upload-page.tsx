"use client"
import type React from "react"
import { useState, useCallback, useEffect } from "react"

const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`}>{children}</div>
)

const CardContent = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const Button = ({
  variant = "default",
  size = "default",
  onClick,
  className = "",
  children,
  disabled = false,
}: {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm"
  onClick?: () => void
  className?: string
  children: React.ReactNode
  disabled?: boolean
}) => {
  const baseStyles =
    "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"

  const variantStyles = {
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    default: "bg-blue-600 text-white hover:bg-blue-700",
  }

  const sizeStyles = size === "sm" ? "px-3 py-1 text-sm" : ""
  const disabledStyles = disabled ? "opacity-50 cursor-not-allowed" : ""

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles} ${disabledStyles} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

const Upload = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
)

const FileText = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const X = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

const CheckCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Clock = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
)

const Loader = ({ className }: { className?: string }) => (
  <svg className={`animate-spin ${className}`} fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

const ArrowLeft = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
)

interface VocUploadPageProps {
  formData: {
    vocFile: File | null;
    sessionId?: string;
    car_brand?: string | null;
    car_model?: string | null;
    manufactured_year?: string | null;
  }
  onNext: () => void
  onBack: () => void
  onUpdateData: (data: any) => void
}

const FILE_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024,
  allowedTypes: ["application/pdf", "image/jpeg", "image/png", "image/jpg"] as const,
  allowedExtensions: ".pdf,.jpg,.jpeg,.png",
} as const

const ERROR_MESSAGES = {
  fileSize: "File size must be less than 5MB",
  fileType: "Only PDF, JPG, and PNG files are allowed",
} as const

export default function VocUploadPage({ formData, onNext, onBack, onUpdateData }: VocUploadPageProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // New states for background processing
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState("")
  const [processingComplete, setProcessingComplete] = useState(false)
  const [dots, setDots] = useState('.');
  
  // Move the dots effect to component level
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isProcessing) {
      interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '.' : prev + '.');
      }, 500);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isProcessing]);

  const validateFile = (file: File): string | null => {
    if (file.size > FILE_CONSTRAINTS.maxSize) {
      return ERROR_MESSAGES.fileSize
    }

    if (!FILE_CONSTRAINTS.allowedTypes.includes(file.type as any)) {
      return ERROR_MESSAGES.fileType
    }

    return null
  }

  // Updated uploadToServer function
const uploadToServer = async (file: File) => {
  try {
    setIsUploading(true);
    setUploadProgress(10);
    
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    
    // If we have a session ID already, use it
    if (formData.sessionId) {
      uploadFormData.append('session_id', formData.sessionId);
    }
    
    setUploadProgress(30);
    
    const response = await fetch('/api/upload-voc', {
      method: 'POST',
      body: uploadFormData,
    });
    
    setUploadProgress(80);
    
    if (!response.ok) {
      throw new Error(`Upload failed with status: ${response.status}`);
    }
    
    const result = await response.json();
    setUploadProgress(100);
    console.log('Upload successful:', result);
    
    // First, just save the session ID and file
    onUpdateData({ 
      vocFile: file,
      sessionId: result.session_id
    });
    
    // Show uploading complete, then switch to processing
    setTimeout(() => {
      setIsUploading(false);
      setIsProcessing(true);
      setProcessingStatus("Analyzing document with Gemini...");
      
      // After 3 seconds, update processing message
      setTimeout(() => {
        setProcessingStatus("Extracting vehicle information...");
        
        // After another 3 seconds, update again
        setTimeout(() => {
          setProcessingStatus("Finalizing data extraction...");
          
          // After 2 more seconds, complete processing and update car details
          setTimeout(() => {
            // Now update the data with car details
            onUpdateData({ 
              car_brand: result.car_brand || null,
              car_model: result.car_model || null,
              manufactured_year: result.manufactured_year || null,
            });
            
            setIsProcessing(false);
            setProcessingComplete(true);
            setProcessingStatus("Document analysis complete!");
          }, 2000);
        }, 3000);
      }, 3000);
    }, 1000);
    
  } catch (error) {
    console.error('Error uploading VOC:', error);
    setUploadError('Failed to upload file. Please try again.');
    setIsUploading(false);
  }
};

  const handleFileUpload = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return

      const file = files[0]
      const error = validateFile(file)

      if (error) {
        setUploadError(error)
        return
      }

      setUploadError("")
      uploadToServer(file);
    },
    [onUpdateData],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileUpload(e.dataTransfer.files)
    },
    [handleFileUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const removeFile = () => {
    onUpdateData({ vocFile: null, sessionId: undefined })
    setUploadError("")
    setIsProcessing(false)
    setProcessingComplete(false)
    setProcessingStatus("")
  }

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2)
  }

  const getDragZoneClasses = (): string => {
    const baseClasses =
      "relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ease-in-out transform"
    const dragClasses = isDragOver
      ? "border-blue-500 bg-blue-50 scale-105 shadow-lg"
      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50 hover:scale-102"

    return `${baseClasses} ${dragClasses}`
  }

  

  const renderUploadZone = () => (
    <div className={getDragZoneClasses()} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
      <div className={`transition-all duration-300 ${isDragOver ? "transform scale-110" : ""}`}>
        <Upload
          className={`mx-auto h-12 w-12 mb-4 transition-colors duration-300 ${
            isDragOver ? "text-blue-600" : "text-gray-400"
          }`}
        />
      </div>

      <h4
        className={`text-xl font-medium mb-2 transition-colors duration-300 ${
          isDragOver ? "text-blue-600" : "text-gray-700"
        }`}
      >
        {isDragOver ? "Drop your file here!" : "Upload Vehicle Ownership Certificate"}
      </h4>

      <p className={`text-base mb-4 transition-colors duration-300 ${isDragOver ? "text-blue-600" : "text-gray-500"}`}>
        {isDragOver ? "Release to upload" : "Drag and drop your file here, or click to browse"}
      </p>

      <p className="text-sm text-gray-400 mb-4">Supported formats: PDF, JPG, PNG (Max 5MB)</p>

      <input
        type="file"
        accept={FILE_CONSTRAINTS.allowedExtensions}
        onChange={(e) => handleFileUpload(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isUploading || isProcessing}
      />

      <Button
        variant="outline"
        className={`pointer-events-none transition-all duration-300 ${
          isDragOver ? "bg-blue-100 border-blue-300 text-blue-600" : "bg-white"
        }`}
        disabled={isUploading || isProcessing}
      >
        {isDragOver ? "Drop File" : isUploading ? "Uploading..." : "Choose File"}
      </Button>

      {isDragOver && (
        <div className="absolute inset-0 rounded-lg border-2 border-blue-500 animate-pulse pointer-events-none" />
      )}
    </div>
  )

  const renderUploadedFile = () => {
    if (!formData.vocFile) return null

    const getStatusIcon = () => {
      if (processingComplete) {
        return <CheckCircle className="h-6 w-6 text-green-600 animate-in zoom-in duration-300" />
      } else if (isProcessing) {
        return <Loader className="h-6 w-6 text-blue-600" />
      }
      return <FileText className="h-6 w-6 text-blue-600" />
    }

    const getStatusColor = () => {
      if (processingComplete) return "bg-green-50 border-green-200"
      if (isProcessing) return "bg-blue-50 border-blue-200"
      return "bg-gray-50 border-gray-200"
    }

    const getStatusText = () => {
      if (processingComplete) return "text-green-800"
      if (isProcessing) return "text-blue-800"
      return "text-gray-800"
    }

    return (
      <div className={`animate-in slide-in-from-top-2 duration-500 flex items-center justify-between p-4 rounded-lg shadow-sm ${getStatusColor()}`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            {getStatusIcon()}
            {processingComplete && <div className="absolute inset-0 rounded-full bg-green-600 animate-ping opacity-25" />}
          </div>
          <div>
            <p className={`font-medium ${getStatusText()}`}>{formData.vocFile.name}</p>
            <p className={`text-sm ${getStatusText().replace('800', '600')}`}>
              {formatFileSize(formData.vocFile.size)} MB
            </p>
            {(isProcessing || processingComplete) && (
              <p className={`text-xs mt-1 ${getStatusText().replace('800', '600')}`}>
                {processingStatus}
              </p>
            )}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={removeFile}
          className="text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors duration-200"
          disabled={isProcessing}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const renderUploading = () => {
    if (!isUploading) return null;
    
    return (
      <div className="animate-in slide-in-from-top-2 duration-500 p-4 bg-blue-50 border border-blue-200 rounded-lg shadow-sm">
        <div className="flex items-center space-x-3">
          <Loader className="h-6 w-6 text-blue-600" />
          <div className="flex-1">
            <p className="font-medium text-blue-800">Uploading document...</p>
            <div className="w-full h-2 bg-blue-200 rounded-full mt-2 overflow-hidden">
              <div 
                className="h-full bg-blue-600 rounded-full transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderExtractedData = () => {
  if (!processingComplete) return null;
  
  return (
    <div className="mt-4 animate-in fade-in duration-500">
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">Document Processed Successfully</p>
            <p className="text-sm text-green-700 mt-1">
              We've extracted vehicle information from your document. You'll see this information pre-filled in the next steps.
            </p>
            
            <div className="mt-3 pt-3 border-t border-green-200">
              {/* Car Details Section */}
              {(formData.car_brand || formData.car_model || formData.manufactured_year) && (
                <div className="mb-3">
                  <p className="text-xs text-green-600 font-medium mb-2">EXTRACTED INFORMATION</p>
                  
                  <div className="grid grid-cols-3 gap-3">
                    {formData.car_brand && (
                      <div className="bg-green-100/50 p-2 rounded">
                        <p className="text-xs text-green-700 font-medium">BRAND</p>
                        <p className="text-sm text-green-900 font-medium">{formData.car_brand}</p>
                      </div>
                    )}
                    
                    {formData.car_model && (
                      <div className="bg-green-100/50 p-2 rounded">
                        <p className="text-xs text-green-700 font-medium">MODEL</p>
                        <p className="text-sm text-green-900 font-medium">{formData.car_model}</p>
                      </div>
                    )}
                    
                    {formData.manufactured_year && (
                      <div className="bg-green-100/50 p-2 rounded">
                        <p className="text-xs text-green-700 font-medium">MANUFACTURED YEAR</p>
                        <p className="text-sm text-green-900 font-medium">{formData.manufactured_year}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Status Information */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-green-600 font-medium">STATUS</p>
                  <p className="text-sm text-green-800">Ready</p>
                </div>
                <div>
                  <p className="text-xs text-green-600 font-medium">SESSION ID</p>
                  <p className="text-sm text-green-800 font-mono">{formData.sessionId?.substring(0, 8)}...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const renderProcessing = () => {
    if (!isProcessing) return null;
    
    return (
      <div className="mt-4 animate-in slide-in-from-top duration-300">
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="relative flex-shrink-0">
              <Loader className="h-5 w-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-blue-800">
                {processingStatus}<span className="inline-block w-8 text-left">{dots}</span>
              </p>
              <div className="w-full h-1.5 bg-blue-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full animate-pulse" 
                     style={{ width: '100%', animationDuration: '1.5s' }} />
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Extracting vehicle data from your document. This may take a moment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderError = () =>
    uploadError && (
      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-600">{uploadError}</p>
      </div>
    )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white px-4 py-3 border-b">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 text-left">BJAK Demo</h1>
        </div>
      </div>

      <div className="bg-white px-4 py-6 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
                1
              </div>
              <span className="text-base text-blue-600 font-medium">VOC Upload</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium mb-2">
                2
              </div>
              <span className="text-base text-gray-500">Vehicle Info</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium mb-2">
                3
              </div>
              <span className="text-base text-gray-500">Personal Info</span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 1: Vehicle Documents</h2>

          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Vehicle Ownership Certificate (VOC)</h3>
              <p className="text-base text-gray-600">
                Upload your Vehicle Ownership Certificate for faster processing{" "}
                <span className="text-sm text-orange-600">(Optional)</span>
              </p>
            </div>

            <Card className="border-2 border-dashed border-gray-200">
              <CardContent className="p-8">
  {!formData.vocFile && !isUploading && renderUploadZone()}
  {isUploading && renderUploading()}
  {formData.vocFile && !isUploading && !isProcessing && renderUploadedFile()}
  {isProcessing && renderProcessing()}
  {processingComplete && renderExtractedData()}
  {renderError()}
</CardContent>
            </Card>
          </div>

<div className="mt-8">
  <button
    onClick={onNext}
    disabled={isUploading || isProcessing}
    className={`w-full ${
      processingComplete 
        ? "bg-blue-600 hover:bg-blue-700" 
        : isProcessing || isUploading 
          ? "bg-gray-400 cursor-not-allowed" 
          : "bg-blue-600 hover:bg-blue-700"
    } text-white py-3 rounded-lg font-medium text-base transition-colors ${
      (isUploading || isProcessing) ? "opacity-50" : ""
    }`}
  >
    {processingComplete ? "Next Step" : isProcessing ? "Processing..." : isUploading ? "Uploading..." : "Next Step"}
  </button>
  
  {isProcessing && (
    <p className="text-xs text-gray-500 text-center mt-2">
      Please wait while we process your document. This usually takes a few seconds.
    </p>
  )}
  
  {!formData.vocFile && !isUploading && !isProcessing && !processingComplete && (
    <p className="text-xs text-gray-500 text-center mt-2">
      You can skip this step if you don't have a VOC document to upload.
    </p>
  )}
</div>
        </div>
      </div>
    </div>
  )
}
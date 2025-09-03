"use client"

import type React from "react"
import { useState, useCallback } from "react"

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`}>
    {children}
  </div>
)

const CardContent = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const Button = ({ 
  variant = "default", 
  size = "default",
  onClick, 
  className = "", 
  children 
}: { 
  variant?: "default" | "outline" | "ghost" 
  size?: "default" | "sm"
  onClick?: () => void 
  className?: string 
  children: React.ReactNode 
}) => {
  const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
  
  const variantStyles = {
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    default: "bg-blue-600 text-white hover:bg-blue-700"
  }
  
  const sizeStyles = size === "sm" ? "px-3 py-1 text-sm" : ""
  
  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles} ${className}`}
    >
      {children}
    </button>
  )
}

// ============================================================================
// ICONS
// ============================================================================

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

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

interface VocUploadStepProps {
  formData: { vocFile: File | null }
  updateFormData: (updates: { vocFile: File | null }) => void
}

const FILE_CONSTRAINTS = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["application/pdf", "image/jpeg", "image/png", "image/jpg"] as const,
  allowedExtensions: ".pdf,.jpg,.jpeg,.png"
} as const

const ERROR_MESSAGES = {
  fileSize: "File size must be less than 5MB",
  fileType: "Only PDF, JPG, and PNG files are allowed"
} as const

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function VocUploadStep({ formData, updateFormData }: VocUploadStepProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadError, setUploadError] = useState("")

  // ============================================================================
  // FILE VALIDATION & UPLOAD LOGIC
  // ============================================================================

  const validateFile = (file: File): string | null => {
    if (file.size > FILE_CONSTRAINTS.maxSize) {
      return ERROR_MESSAGES.fileSize
    }
    
    if (!FILE_CONSTRAINTS.allowedTypes.includes(file.type as any)) {
      return ERROR_MESSAGES.fileType
    }
    
    return null
  }

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
      updateFormData({ vocFile: file })
    },
    [updateFormData]
  )

  // ============================================================================
  // DRAG & DROP HANDLERS
  // ============================================================================

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFileUpload(e.dataTransfer.files)
    },
    [handleFileUpload]
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
    updateFormData({ vocFile: null })
    setUploadError("")
  }

  // ============================================================================
  // HELPER FUNCTIONS
  // ============================================================================

  const formatFileSize = (bytes: number): string => {
    return (bytes / 1024 / 1024).toFixed(2)
  }

  const getDragZoneClasses = (): string => {
    const baseClasses = "relative border-2 border-dashed rounded-lg p-8 text-center transition-colors"
    const dragClasses = isDragOver 
      ? "border-primary bg-primary/5" 
      : "border-muted-foreground/25 hover:border-primary/50"
    
    return `${baseClasses} ${dragClasses}`
  }

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderUploadZone = () => (
    <div
      className={getDragZoneClasses()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <h4 className="text-lg font-medium mb-2">Upload Vehicle Ownership Certificate</h4>
      <p className="text-muted-foreground mb-4">Drag and drop your file here, or click to browse</p>
      <p className="text-sm text-muted-foreground mb-4">
        Supported formats: PDF, JPG, PNG (Max 5MB)
      </p>

      <input
        type="file"
        accept={FILE_CONSTRAINTS.allowedExtensions}
        onChange={(e) => handleFileUpload(e.target.files)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />

      <Button variant="outline" className="pointer-events-none bg-transparent">
        Choose File
      </Button>
    </div>
  )

  const renderUploadedFile = () => {
    if (!formData.vocFile) return null
    
    return (
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <FileText className="h-8 w-8 text-blue-600" />
          <div>
            <p className="font-medium text-green-800">{formData.vocFile.name}</p>
            <p className="text-sm text-green-600">{formatFileSize(formData.vocFile.size)} MB</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={removeFile}
          className="text-red-600 hover:text-red-800 hover:bg-red-50"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    )
  }

  const renderError = () => uploadError && (
    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p className="text-sm text-red-600">{uploadError}</p>
    </div>
  )

  const renderBenefits = () => (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-800 mb-2">Why upload your VOC?</h4>
      <ul className="text-sm text-blue-700 space-y-1">
        <li>• Faster quote processing</li>
        <li>• Pre-filled vehicle information</li>
        <li>• Reduced manual data entry</li>
        <li>• More accurate premium calculation</li>
      </ul>
    </div>
  )

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-primary mb-2">
          Vehicle Ownership Certificate (VOC)
        </h3>
        <p className="text-muted-foreground">
          Upload your Vehicle Ownership Certificate for faster processing{" "}
          <span className="text-sm text-orange-600">(Optional)</span>
        </p>
      </div>

      {/* Upload Section */}
      <Card className="border-2 border-dashed border-muted-foreground/25">
        <CardContent className="p-8">
          {!formData.vocFile ? renderUploadZone() : renderUploadedFile()}
          {renderError()}
        </CardContent>
      </Card>

      {/* Benefits Section */}
      {renderBenefits()}
    </div>
  )
}

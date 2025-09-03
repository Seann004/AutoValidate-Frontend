"use client"

import { useState } from "react"
import { PersonalDetailsStep } from "./page/personal_details"
import { VehicleDetailsStep } from "./page/vehicle_details"
import { CoverageStep } from "./page/coverage"
import { ReviewPaymentStep } from "./page/payment"
import { VocUploadStep } from "./page/voc_upload"

// Simple replacement components
const Card = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`}>
    {children}
  </div>
)

const CardContent = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={className}>{children}</div>
)

const CardHeader = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <div className={`px-6 py-4 border-b ${className}`}>{children}</div>
)

const CardTitle = ({ className = "", children }: { className?: string; children: React.ReactNode }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
)

const Button = ({ 
  variant = "default", 
  disabled = false, 
  onClick, 
  className = "", 
  children 
}: { 
  variant?: "default" | "outline"; 
  disabled?: boolean; 
  onClick?: () => void; 
  className?: string; 
  children: React.ReactNode 
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      variant === "outline"
        ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
    } ${className}`}
  >
    {children}
  </button>
)

const Progress = ({ value, className = "" }: { value: number; className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div
      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
      style={{ width: `${value}%` }}
    />
  </div>
)

interface FormData {
  vocFile: File | null

  // Personal Details
  customerType: "individual" | "company"
  idType: "IC" | "Passport" | "Army" | "Police"
  idNumber: string
  individualName: string
  companyName: string
  dateOfBirth: string
  nationality: string
  postcode: string
  state: string

  // Vehicle Details
  vehicleRegistration: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  engineCapacity: string
  vehicleNumber: string
  vehicleMake: string
  yearManufactured: string
  vehicleType: string

  // Coverage
  coverageType: string
  addOns: string[]

  // Additional
  hasModifications: boolean
  isCommercialUse: boolean
}

const steps = [
  { id: 1, title: "Upload VOC", description: "Vehicle ownership certificate" },
  { id: 2, title: "Personal Details", description: "Your information" },
  { id: 3, title: "Vehicle Details", description: "Vehicle information" },
  { id: 4, title: "Coverage & Add-ons", description: "Select your coverage" },
  { id: 5, title: "Review & Payment", description: "Confirm and pay" },
]

export function InsuranceData() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    vocFile: null,
    customerType: "individual",
    idType: "IC",
    idNumber: "",
    individualName: "",
    companyName: "",
    dateOfBirth: "",
    nationality: "Malaysian",
    postcode: "",
    state: "",
    vehicleRegistration: "",
    vehicleBrand: "",
    vehicleModel: "",
    vehicleYear: "",
    engineCapacity: "",
    vehicleNumber: "",
    vehicleMake: "",
    yearManufactured: "",
    vehicleType: "",
    coverageType: "",
    addOns: [],
    hasModifications: false,
    isCommercialUse: false,
  })

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const progress = (currentStep / steps.length) * 100

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <VocUploadStep formData={formData} updateFormData={updateFormData} />
      case 2:
        return <PersonalDetailsStep formData={formData} updateFormData={updateFormData} />
      case 3:
        return <VehicleDetailsStep formData={formData} updateFormData={updateFormData} />
      case 4:
        return <CoverageStep formData={formData} updateFormData={updateFormData} />
      case 5:
        return <ReviewPaymentStep formData={formData} updateFormData={updateFormData} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Get Quote</h1>
          <p className="text-lg text-muted-foreground">Renew Insurance & Roadtax Online</p>
          <div className="inline-block bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-sm font-medium mt-2">
            Special Discount Limited Time!
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step.id}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium ${
                      currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card className="mb-8 min-h-[600px]">
          <CardHeader>
            <CardTitle className="text-2xl text-primary">{steps[currentStep - 1].title}</CardTitle>
          </CardHeader>
          <CardContent className="p-8">{renderStep()}</CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1} className="px-8 bg-transparent">
            Previous
          </Button>
          <Button onClick={nextStep} disabled={currentStep === steps.length} className="px-8">
            {currentStep === steps.length ? "Complete" : "Next Step"}
          </Button>
        </div>
      </div>
    </div>
  )
}

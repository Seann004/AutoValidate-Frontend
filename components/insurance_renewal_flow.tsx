"use client"

import { useState } from "react"
import { PersonalDetailsStep } from "./page/personal_details"
import { VehicleDetailsStep } from "./page/vehicle_details"
import { CoverageStep } from "./page/coverage"
import { ReviewPaymentStep } from "./page/payment"
import { VocUploadStep } from "./page/voc_upload"

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface FormData {
  vocFile: File | null
  customerType: "individual" | "company"
  idType: "IC" | "Passport" | "Army" | "Police"
  idNumber: string
  individualName: string
  companyName: string
  dateOfBirth: string
  nationality: string
  postcode: string
  state: string
  vehicleRegistration: string
  vehicleBrand: string
  vehicleModel: string
  vehicleYear: string
  engineCapacity: string
  vehicleNumber: string
  vehicleMake: string
  yearManufactured: string
  vehicleType: string
  coverageType: string
  addOns: string[]
  hasModifications: boolean
  isCommercialUse: boolean
}

interface StepConfig {
  id: number
  title: string
  description: string
}

// ============================================================================
// UI COMPONENTS
// ============================================================================


const Card = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <div className={`border rounded-xl shadow-sm bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-blue-200 ${className}`}>
    {children}
  </div>
)

const CardContent = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
)

const CardHeader = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <div className={`px-6 py-4 border-b ${className}`}>
    {children}
  </div>
)

const CardTitle = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <h3 className={`text-lg font-semibold ${className}`}>
    {children}
  </h3>
)

const Button = ({ 
  variant = "default", 
  disabled = false, 
  onClick, 
  className = "", 
  children 
}: { 
  variant?: "default" | "outline"
  disabled?: boolean
  onClick?: () => void
  className?: string
  children: React.ReactNode 
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className={`
      px-6 py-3 rounded-lg font-medium transition-all duration-300 transform 
      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
      active:scale-95 relative overflow-hidden group
      ${variant === "outline"
        ? `border-2 border-blue-600 bg-white text-blue-600 
           hover:bg-blue-600 hover:text-white hover:shadow-lg 
           hover:-translate-y-1 disabled:opacity-50 disabled:transform-none`
        : `bg-gradient-to-r from-blue-600 to-blue-700 text-white 
           hover:from-blue-700 hover:to-blue-800 hover:shadow-xl 
           hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed 
           disabled:transform-none`
      } 
      ${className}
    `}
  >
    <span className="relative z-10">{children}</span>
    {variant === "default" && (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    )}
  </button>
)

const Progress = ({ value, className = "" }: { 
  value: number
  className?: string 
}) => (
  <div className={`w-full bg-white rounded-full h-3 overflow-hidden border border-gray-200 ${className}`}>
    <div 
      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out shadow-sm relative"
      style={{ width: `${value}%` }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full animate-pulse" />
    </div>
  </div>
)

// ============================================================================
// CONFIGURATION
// ============================================================================

const steps: StepConfig[] = [
  { id: 1, title: "Upload VOC", description: "Vehicle ownership certificate" },
  { id: 2, title: "Personal Details", description: "Your information" },
  { id: 3, title: "Vehicle Details", description: "Vehicle information" },
  { id: 4, title: "Coverage & Add-ons", description: "Select your coverage" },
  { id: 5, title: "Review & Payment", description: "Confirm and pay" },
]

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function InsuranceData() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
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

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
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

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  
  const progress = (currentStep / steps.length) * 100

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
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

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <header className="text-center mb-8 pt-8 animate-fade-in">
          <h1 className="text-5xl font-bold text-blue-800 mb-2 animate-bounce-in">
            Get Quotation Now          </h1>
        
        </header>

        {/* Progress Section */}
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 transform border-2 ${
                    currentStep >= step.id 
                      ? "bg-blue-600 text-white scale-110 shadow-lg border-blue-600" 
                      : "bg-white text-gray-600 hover:bg-gray-50 border-gray-300"
                  }`}
                >
                  {currentStep > step.id ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <div className="ml-3 hidden sm:block">
                  <p
                    className={`text-sm font-medium transition-colors duration-300 ${
                      currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-400">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 transition-colors duration-500 ${
                    currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-3" />
        </section>

        {/* Main Content Section */}
        <main className="mb-8">
          <Card className="min-h-[600px]">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-800">
                {steps[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderStep()}
            </CardContent>
          </Card>
        </main>

        {/* Navigation Section */}
        <nav className="flex justify-between">
          <Button 
            variant="outline" 
            onClick={prevStep} 
            disabled={currentStep === 1} 
            className="px-8"
          >
            Previous
          </Button>
          <Button 
            onClick={nextStep} 
            disabled={currentStep === steps.length} 
            className="px-8"
          >
            {currentStep === steps.length ? "Complete" : "Next Step"}
          </Button>
        </nav>
        
      </div>
    </div>
  )
}

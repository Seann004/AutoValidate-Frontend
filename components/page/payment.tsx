"use client"

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Card = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`}>
    {children}
  </div>
)

const CardContent = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <div className={`p-6 ${className}`}>{children}</div>
)

const CardHeader = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <div className={`px-6 py-4 border-b ${className}`}>{children}</div>
)

const CardTitle = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
)

const Button = ({ 
  onClick, 
  className = "", 
  size,
  children 
}: { 
  onClick?: () => void
  className?: string
  size?: string
  children: React.ReactNode 
}) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 bg-blue-600 text-white hover:bg-blue-700 ${className}`}
  >
    {children}
  </button>
)

const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`border-t border-gray-200 ${className}`} />
)

const Badge = ({ 
  variant = "default", 
  className = "", 
  children 
}: { 
  variant?: "default" | "secondary"
  className?: string
  children: React.ReactNode 
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
    variant === "secondary" 
      ? "bg-gray-100 text-gray-800" 
      : "bg-blue-100 text-blue-800"
  } ${className}`}>
    {children}
  </span>
)

// ============================================================================
// ICONS
// ============================================================================

const User = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
    />
  </svg>
)

const Car = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0016.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 002 8.5c0 2.29 1.51 4.04 3 5.5l6 6 6-6z" 
    />
  </svg>
)

const Shield = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M20.618 5.984A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
    />
  </svg>
)

const CreditCard = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
    />
  </svg>
)

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  customerType: "individual" | "company"
  idType: "IC" | "Passport" | "Army" | "Police"
  idNumber: string
  individualName: string
  companyName: string
  dateOfBirth: string
  nationality: string
  postcode: string
  state: string
  vehicleNumber: string
  vehicleMake: string
  vehicleModel: string
  yearManufactured: string
  engineCapacity: string
  vehicleType: string
  coverageType: string
  addOns: string[]
}

interface ReviewPaymentStepProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================

const COVERAGE_PRICES = {
  comprehensive: 1200,
  "third-party": 400,
} as const

const ADD_ON_PRICES = {
  "roadside-assistance": 80,
  "windscreen-coverage": 120,
  "flood-coverage": 200,
} as const

const COVERAGE_DESCRIPTIONS = {
  comprehensive: "Complete protection for your vehicle including accident, theft, and natural disasters",
  "third-party": "Basic third-party liability coverage as required by law",
} as const

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function ReviewPaymentStep({ formData }: ReviewPaymentStepProps) {
  // ========================================================================
  // UTILITY FUNCTIONS
  // ========================================================================
  
  const calculateTotal = (): number => {
    let total = 0

    // Base coverage price
    total += COVERAGE_PRICES[formData.coverageType as keyof typeof COVERAGE_PRICES] || 0

    // Add-ons
    formData.addOns?.forEach(addOn => {
      total += ADD_ON_PRICES[addOn as keyof typeof ADD_ON_PRICES] || 0
    })

    return total
  }

  const getCustomerName = (): string => {
    return formData.customerType === "individual" 
      ? formData.individualName 
      : formData.companyName
  }

  const formatCoverage = (coverage: string): string => {
    return coverage.replace("-", " ")
  }

  const formatAddOn = (addOn: string): string => {
    return addOn.replace("-", " ")
  }

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================
  
  const handlePayment = (): void => {
    alert("Payment processing would be implemented here!")
  }

  // ========================================================================
  // RENDER COMPONENTS
  // ========================================================================
  
  const renderPersonalInformation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <User className="w-5 h-5" />
          <span>Personal Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Customer Type:</span>
            <p className="font-medium capitalize">{formData.customerType}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{formData.idType} Number:</span>
            <p className="font-medium">{formData.idNumber}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Name:</span>
            <p className="font-medium">{getCustomerName()}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Nationality:</span>
            <p className="font-medium">{formData.nationality}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Location:</span>
            <p className="font-medium">
              {formData.postcode} {formData.state}
            </p>
          </div>
          {formData.dateOfBirth && (
            <div>
              <span className="text-sm text-muted-foreground">Date of Birth:</span>
              <p className="font-medium">{formData.dateOfBirth}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )

  const renderVehicleInformation = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Car className="w-5 h-5" />
          <span>Vehicle Information</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Registration:</span>
            <p className="font-medium">{formData.vehicleNumber}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Brand & Model:</span>
            <p className="font-medium">
              {formData.vehicleMake} {formData.vehicleModel}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Year:</span>
            <p className="font-medium">{formData.yearManufactured}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Engine Capacity:</span>
            <p className="font-medium">{formData.engineCapacity}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const renderCoverageReview = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="w-5 h-5" />
          <span>Coverage & Add-ons</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="font-medium">Base Coverage:</span>
            <Badge variant="secondary" className="capitalize">
              {formatCoverage(formData.coverageType)}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {COVERAGE_DESCRIPTIONS[formData.coverageType as keyof typeof COVERAGE_DESCRIPTIONS]}
          </p>
        </div>

        {formData.addOns && formData.addOns.length > 0 && (
          <div>
            <span className="font-medium">Selected Add-ons:</span>
            <ul className="mt-2 space-y-1">
              {formData.addOns.map((addOn) => (
                <li key={addOn} className="text-sm flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                  <span className="capitalize">{formatAddOn(addOn)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderPaymentSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5" />
          <span>Payment Summary</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Base Coverage ({formatCoverage(formData.coverageType)}):</span>
            <span>RM {(COVERAGE_PRICES[formData.coverageType as keyof typeof COVERAGE_PRICES] || 0).toLocaleString()}</span>
          </div>

          {formData.addOns?.map((addOn) => (
            <div key={addOn} className="flex justify-between text-sm">
              <span className="capitalize">{formatAddOn(addOn)}:</span>
              <span>RM {(ADD_ON_PRICES[addOn as keyof typeof ADD_ON_PRICES] || 0).toLocaleString()}</span>
            </div>
          ))}

          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total Annual Premium:</span>
            <span className="text-primary">RM {calculateTotal().toLocaleString()}</span>
          </div>
        </div>

        <Button onClick={handlePayment} className="w-full text-lg py-6" size="lg">
          Proceed to Payment - RM {calculateTotal().toLocaleString()}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          By proceeding, you agree to our Terms & Conditions and Privacy Policy
        </p>
      </CardContent>
    </Card>
  )

  // ========================================================================
  // MAIN RENDER
  // ========================================================================
  
  return (
    <div className="space-y-6">
      {renderPersonalInformation()}
      {renderVehicleInformation()}
      {renderCoverageReview()}
      {renderPaymentSummary()}
    </div>
  )
}

"use client"

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Card = ({ className = "", onClick, children }: { 
  className?: string
  onClick?: () => void
  children: React.ReactNode 
}) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`} onClick={onClick}>
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

const Checkbox = ({ 
  checked, 
  onChange, 
  className = "" 
}: { 
  checked: boolean
  onChange: () => void
  className?: string 
}) => (
  <input
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className={`w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${className}`}
  />
)

const Badge = ({ 
  className = "", 
  children 
}: { 
  className?: string
  children: React.ReactNode 
}) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 ${className}`}>
    {children}
  </span>
)

// ============================================================================
// ICONS
// ============================================================================

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

const Car = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
  </svg>
)

const Users = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a4 4 0 11-8 0 4 4 0 018 0z" 
    />
  </svg>
)

const Wrench = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a1 1 0 01-1-1V9a1 1 0 011-1h1a2 2 0 100-4H4a1 1 0 01-1-1V1a1 1 0 011-1h3a1 1 0 011 1v1a2 2 0 104 0V1a1 1 0 011-1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0z" 
    />
  </svg>
)

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormData {
  coverageType: string
  addOns: string[]
}

interface CoverageStepProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

interface CoverageOption {
  id: string
  title: string
  description: string
  price: string
  features: string[]
  icon: React.ComponentType<{ className?: string }>
  popular: boolean
}

interface AddOnOption {
  id: string
  title: string
  description: string
  price: string
  icon: React.ComponentType<{ className?: string }>
}

// ============================================================================
// DATA CONFIGURATION
// ============================================================================

const COVERAGE_OPTIONS: CoverageOption[] = [
  {
    id: "comprehensive",
    title: "Comprehensive Coverage",
    description: "Complete protection for your vehicle",
    price: "RM 1,200/year",
    features: [
      "Accident coverage",
      "Theft protection", 
      "Fire & natural disasters",
      "Third-party liability"
    ],
    icon: Shield,
    popular: true,
  },
  {
    id: "third-party",
    title: "Third Party Coverage",
    description: "Basic legal requirement coverage",
    price: "RM 400/year",
    features: [
      "Third-party liability",
      "Legal requirement",
      "Basic protection"
    ],
    icon: Users,
    popular: false,
  },
] as const

const ADD_ON_OPTIONS: AddOnOption[] = [
  {
    id: "roadside-assistance",
    title: "Roadside Assistance",
    description: "24/7 emergency roadside help",
    price: "RM 80/year",
    icon: Wrench,
  },
  {
    id: "windscreen-coverage",
    title: "Windscreen Coverage",
    description: "Windscreen repair and replacement",
    price: "RM 120/year",
    icon: Car,
  },
  {
    id: "flood-coverage",
    title: "Flood Coverage",
    description: "Protection against flood damage",
    price: "RM 200/year",
    icon: Shield,
  },
] as const

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function CoverageStep({ formData, updateFormData }: CoverageStepProps) {
  
  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleCoverageSelect = (coverageId: string): void => {
    updateFormData({ coverageType: coverageId })
  }

  const handleAddOnToggle = (addOnId: string): void => {
    const currentAddOns = formData.addOns || []
    const updatedAddOns = currentAddOns.includes(addOnId)
      ? currentAddOns.filter((id) => id !== addOnId)
      : [...currentAddOns, addOnId]

    updateFormData({ addOns: updatedAddOns })
  }

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const getSelectedCoverage = (): CoverageOption | undefined => {
    return COVERAGE_OPTIONS.find((opt) => opt.id === formData.coverageType)
  }

  const getSelectedAddOns = (): AddOnOption[] => {
    if (!formData.addOns || formData.addOns.length === 0) return []
    
    return formData.addOns
      .map((addOnId) => ADD_ON_OPTIONS.find((opt) => opt.id === addOnId))
      .filter((addOn): addOn is AddOnOption => addOn !== undefined)
  }

  const isAddOnSelected = (addOnId: string): boolean => {
    return formData.addOns?.includes(addOnId) || false
  }

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderCoverageOption = (option: CoverageOption) => {
    const Icon = option.icon
    const isSelected = formData.coverageType === option.id

    return (
      <Card
        key={option.id}
        className={`cursor-pointer transition-all duration-200 relative ${
          isSelected
            ? "ring-2 ring-primary border-primary bg-primary/5"
            : "hover:border-primary/50"
        }`}
        onClick={() => handleCoverageSelect(option.id)}
      >
        {option.popular && (
          <Badge className="absolute -top-2 left-4 bg-accent text-accent-foreground">
            Most Popular
          </Badge>
        )}
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Icon className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-lg">{option.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-2xl font-bold text-primary">{option.price}</div>
            <ul className="space-y-1">
              {option.features.map((feature, index) => (
                <li key={index} className="text-sm flex items-center">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderAddOnOption = (addOn: AddOnOption) => {
    const Icon = addOn.icon
    const isSelected = isAddOnSelected(addOn.id)

    return (
      <Card
        key={addOn.id}
        className={`cursor-pointer transition-all duration-200 ${
          isSelected ? "ring-2 ring-accent border-accent bg-accent/5" : "hover:border-accent/50"
        }`}
        onClick={() => handleAddOnToggle(addOn.id)}
      >
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Checkbox 
              checked={isSelected} 
              onChange={() => handleAddOnToggle(addOn.id)} 
              className="mt-1" 
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Icon className="w-5 h-5 text-accent" />
                <h4 className="font-semibold">{addOn.title}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{addOn.description}</p>
              <div className="text-lg font-bold text-accent">{addOn.price}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderCoverageSection = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary">Select Coverage Type</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {COVERAGE_OPTIONS.map(renderCoverageOption)}
      </div>
    </div>
  )

  const renderAddOnSection = () => (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary">Optional Add-ons</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ADD_ON_OPTIONS.map(renderAddOnOption)}
      </div>
    </div>
  )

  const renderSummary = () => {
    if (!formData.coverageType) return null

    const selectedCoverage = getSelectedCoverage()
    const selectedAddOns = getSelectedAddOns()

    return (
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Base Coverage:</span>
              <span className="font-semibold">{selectedCoverage?.title}</span>
            </div>
            
            {selectedAddOns.length > 0 && (
              <div>
                <span>Add-ons:</span>
                <ul className="ml-4 mt-1">
                  {selectedAddOns.map((addOn) => (
                    <li key={addOn.id} className="text-sm flex justify-between">
                      <span>• {addOn.title}</span>
                      <span>{addOn.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-8">
      {renderCoverageSection()}
      {renderAddOnSection()}
      {renderSummary()}
    </div>
  )
}

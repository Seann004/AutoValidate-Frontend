"use client"

import { useState, ChangeEvent } from "react"

// ============================================================================
// UI COMPONENTS
// ============================================================================

const Card = ({ className = "", onClick, children }: { 
  className?: string
  onClick?: () => void
  children: React.ReactNode 
}) => (
  <div className={`border rounded-lg shadow-sm ${className}`} onClick={onClick}>
    {children}
  </div>
)

const CardContent = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <div className={className}>{children}</div>
)

const Input = ({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement> & { 
  className?: string 
}) => (
  <input 
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`} 
    {...props} 
  />
)

const Label = ({ className = "", children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { 
  className?: string 
}) => (
  <label className={`block text-sm font-medium text-gray-700 mb-1 ${className}`} {...props}>
    {children}
  </label>
)

const Select = ({ value, onValueChange, children }: { 
  value: string
  onValueChange: (value: string) => void
  children: React.ReactNode 
}) => (
  <div className="relative">
    <select 
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
    >
      {children}
    </select>
    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
)

// Select sub-components (simplified for compatibility)
const SelectTrigger = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectValue = ({ placeholder }: { placeholder: string }) => <option value="" disabled>{placeholder}</option>
const SelectContent = ({ children }: { children: React.ReactNode }) => <>{children}</>
const SelectItem = ({ value, children }: { value: string; children: React.ReactNode }) => (
  <option value={value}>{children}</option>
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

const Building2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
    />
  </svg>
)

// ============================================================================
// TYPES & CONSTANTS
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
}

interface PersonalDetailsStepProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

const MALAYSIAN_STATES = {
  "52": "Kuala Lumpur",
} as const

const ID_TYPES = [
  { value: "IC", label: "IC (Identity Card)" },
  { value: "Passport", label: "Passport" },
  { value: "Army", label: "Army ID" },
  { value: "Police", label: "Police ID" },
] as const

const NATIONALITIES = [
  { value: "Malaysian", label: "Malaysian" },
  { value: "Singaporean", label: "Singaporean" },
  { value: "Other", label: "Other" },
] as const

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function PersonalDetailsStep({ formData, updateFormData }: PersonalDetailsStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  // ============================================================================
  // UTILITY FUNCTIONS
  // ============================================================================

  const formatICNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 6) return numbers
    if (numbers.length <= 8) return `${numbers.slice(0, 6)}-${numbers.slice(6)}`
    return `${numbers.slice(0, 6)}-${numbers.slice(6, 8)}-${numbers.slice(8, 12)}`
  }

  const extractDateOfBirth = (icNumber: string): string => {
    const numbers = icNumber.replace(/\D/g, "")
    if (numbers.length >= 6) {
      const year = numbers.slice(0, 2)
      const month = numbers.slice(2, 4)
      const day = numbers.slice(4, 6)

      // Determine century (assuming 00-30 is 2000s, 31-99 is 1900s)
      const fullYear = Number.parseInt(year) <= 30 ? `20${year}` : `19${year}`
      return `${fullYear}-${month}-${day}`
    }
    return ""
  }

  const getStateFromPostcode = (postcode: string): string => {
    const code = postcode.slice(0, 2)
    return MALAYSIAN_STATES[code as keyof typeof MALAYSIAN_STATES] || ""
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleICNumberChange = (value: string): void => {
    const formatted = formatICNumber(value)
    updateFormData({ idNumber: formatted })

    if (formData.idType === "IC") {
      const dob = extractDateOfBirth(formatted)
      if (dob) {
        updateFormData({ dateOfBirth: dob })
      }
    }
  }

  const handlePostcodeChange = (value: string): void => {
    if (value === "52100") {
      updateFormData({ postcode: value, state: "Kuala Lumpur" })
    } else {
      updateFormData({ postcode: value, state: "" })
    }
  }

  const handleCustomerTypeChange = (type: "individual" | "company"): void => {
    updateFormData({ customerType: type })
  }

  const handleIDTypeChange = (idType: string): void => {
    updateFormData({ idType: idType as FormData["idType"] })
  }

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderCustomerTypeSelection = () => (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Vehicle registered under</Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all duration-200 ${
            formData.customerType === "individual"
              ? "ring-2 ring-primary bg-blue-50 border-primary"
              : "hover:border-primary/50"
          }`}
          onClick={() => handleCustomerTypeChange("individual")}
        >
          <CardContent className="p-6 text-center">
            <User className="w-12 h-12 mx-auto mb-3 text-primary" />
            <h3 className="font-semibold text-lg mb-2">Individual name</h3>
            <p className="text-sm text-muted-foreground">Personal vehicle registration</p>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all duration-200 ${
            formData.customerType === "company"
              ? "ring-2 ring-accent bg-orange-50 border-accent"
              : "hover:border-accent/50"
          }`}
          onClick={() => handleCustomerTypeChange("company")}
        >
          <CardContent className="p-6 text-center">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-accent" />
            <h3 className="font-semibold text-lg mb-2">Company name</h3>
            <p className="text-sm text-muted-foreground">Business vehicle registration</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderIDFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {formData.customerType === "individual" && (
        <div className="space-y-2">
          <Label htmlFor="idType">ID Type</Label>
          <Select value={formData.idType} onValueChange={handleIDTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {ID_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className={`space-y-2 ${formData.customerType === "company" ? "md:col-span-2" : ""}`}>
        <Label htmlFor="idNumber">
          {formData.customerType === "company" ? "Company Registration Number" : `${formData.idType} Number`} 
          {formData.idType === "IC" && formData.customerType === "individual" && (
            <span className="text-red-500">*</span>
          )}
        </Label>
        <Input
          id="idNumber"
          value={formData.idNumber}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleICNumberChange(e.target.value)}
          placeholder={
            formData.customerType === "company" 
              ? "Enter company registration number" 
              : formData.idType === "IC" 
                ? "xxxxxx-xx-xxxx" 
                : `Enter ${formData.idType} number`
          }
          maxLength={formData.idType === "IC" && formData.customerType === "individual" ? 14 : undefined}
        />
        {formData.idType === "IC" && formData.customerType === "individual" && (
          <p className="text-xs text-muted-foreground">IC registration number is required</p>
        )}
      </div>
    </div>
  )

  const renderNameFields = () => {
    if (formData.customerType === "individual") {
      return (
        <div className="space-y-2">
          <Label htmlFor="individualName">Individual Name</Label>
          <Input
            id="individualName"
            value={formData.individualName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              updateFormData({ individualName: e.target.value })
            }
            placeholder="Enter your full name"
            className="bg-blue-50 border-blue-200 focus:border-blue-400"
          />
        </div>
      )
    }

    return (
      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={formData.companyName}
          onChange={(e: ChangeEvent<HTMLInputElement>) => 
            updateFormData({ companyName: e.target.value })
          }
          placeholder="Enter company name"
          className="bg-orange-50 border-orange-200 focus:border-orange-400"
        />
      </div>
    )
  }

  const renderPersonalFields = () => {
    if (formData.customerType !== "individual") return null

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e: ChangeEvent<HTMLInputElement>) => 
              updateFormData({ dateOfBirth: e.target.value })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Select 
            value={formData.nationality} 
            onValueChange={(value: string) => updateFormData({ nationality: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select nationality" />
            </SelectTrigger>
            <SelectContent>
              {NATIONALITIES.map((nationality) => (
                <SelectItem key={nationality.value} value={nationality.value}>
                  {nationality.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    )
  }

  const renderLocationFields = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="postcode">Postcode (vehicle location)</Label>
        <Input
          id="postcode"
          value={formData.postcode}
          onChange={(e: ChangeEvent<HTMLInputElement>) => handlePostcodeChange(e.target.value)}
          placeholder="Enter postcode"
          maxLength={5}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="state">State</Label>
        <Input
          id="state"
          value={formData.state}
          readOnly
          placeholder="State"
          className="bg-muted"
        />
      </div>
    </div>
  )

  const renderConfirmationCheckboxes = () => (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="flex items-start space-x-3">
        <input type="checkbox" id="modifications" className="mt-1" />
        <label htmlFor="modifications" className="text-sm">
          Has the vehicle been installed with a turbocharger, nitrous oxide kit, or modified for the purpose of speed
          and acceleration beyond the manufacturer's specification?
        </label>
      </div>

      <div className="flex items-start space-x-3">
        <input type="checkbox" id="commercial" className="mt-1" />
        <label htmlFor="commercial" className="text-sm">
          I confirm that the vehicle is not involved in any{" "}
          <span className="text-primary underline cursor-pointer">
            Shariah non-compliant operations or businesses
          </span>
          .
        </label>
      </div>
    </div>
  )

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {renderCustomerTypeSelection()}
      {renderIDFields()}
      {renderNameFields()}
      {renderPersonalFields()}
      {renderLocationFields()}
      {renderConfirmationCheckboxes()}
    </div>
  )
}

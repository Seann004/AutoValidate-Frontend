"use client"

import { useState, ChangeEvent } from "react"

// ============================================================================
// UI COMPONENTS
// ============================================================================

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

const Alert = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <div className={`rounded-lg border p-4 ${className}`}>
    {children}
  </div>
)

const AlertDescription = ({ className = "", children }: { 
  className?: string
  children: React.ReactNode 
}) => (
  <div className={`text-sm ${className}`}>
    {children}
  </div>
)

// ============================================================================
// ICONS
// ============================================================================

const AlertCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
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
  vehicleType: string
}

interface VehicleDetailsStepProps {
  formData: FormData
  updateFormData: (updates: Partial<FormData>) => void
}

interface VehicleData {
  brand: string
  model: string
  yearStart: number
  yearEnd: number
}

// ============================================================================
// VEHICLE DATABASE & CONSTANTS
// ============================================================================

const VEHICLE_DATABASE: VehicleData[] = [
    // Toyota Models
    { brand: "Toyota", model: "Avanza", yearStart: 2003, yearEnd: 2025 },
    { brand: "Toyota", model: "Camry", yearStart: 1994, yearEnd: 2025 },
    { brand: "Toyota", model: "Corolla", yearStart: 1996, yearEnd: 2025 },
    { brand: "Toyota", model: "Corona", yearStart: 1990, yearEnd: 2001 },
    { brand: "Toyota", model: "Fortuner", yearStart: 2005, yearEnd: 2025 },
    { brand: "Toyota", model: "Hilux", yearStart: 1969, yearEnd: 2025 },
    { brand: "Toyota", model: "Innova", yearStart: 2005, yearEnd: 2025 },
    { brand: "Toyota", model: "Vios", yearStart: 2004, yearEnd: 2025 },
    { brand: "Toyota", model: "Yaris", yearStart: 2019, yearEnd: 2025 },

    
    // Honda Models
    { brand: "Honda", model: "Accord", yearStart: 1977, yearEnd: 2025 },
    { brand: "Honda", model: "BR-V", yearStart: 2016, yearEnd: 2025 },
    { brand: "Honda", model: "City", yearStart: 1981, yearEnd: 2025 },
    { brand: "Honda", model: "Civic", yearStart: 1972, yearEnd: 2025 },
    { brand: "Honda", model: "CR-V", yearStart: 1995, yearEnd: 2025 },
    { brand: "Honda", model: "HR-V", yearStart: 1998, yearEnd: 2025 },

    
    // Perodua Models
    { brand: "Perodua", model: "Alza", yearStart: 2009, yearEnd: 2025 },
    { brand: "Perodua", model: "Aruz", yearStart: 2019, yearEnd: 2025 },
    { brand: "Perodua", model: "Ativa", yearStart: 2021, yearEnd: 2025 },
    { brand: "Perodua", model: "Axia", yearStart: 2014, yearEnd: 2025 },
    { brand: "Perodua", model: "Bezza", yearStart: 2016, yearEnd: 2025 },
    { brand: "Perodua", model: "Kancil", yearStart: 1994, yearEnd: 2009 },
    { brand: "Perodua", model: "Kelisa", yearStart: 2001, yearEnd: 2007 },
    { brand: "Perodua", model: "Kenari", yearStart: 2000, yearEnd: 2009 },
    { brand: "Perodua", model: "Myvi", yearStart: 2005, yearEnd: 2025 },
    { brand: "Perodua", model: "Viva", yearStart: 2007, yearEnd: 2014 },

    
    // Proton Models
    { brand: "Proton", model: "eMas 7", yearStart: 2024, yearEnd: 2025 },
    { brand: "Proton", model: "Exora", yearStart: 2009, yearEnd: 2023 },
    { brand: "Proton", model: "Inspira", yearStart: 2010, yearEnd: 2015 },
    { brand: "Proton", model: "Iriz", yearStart: 2014, yearEnd: 2025 },
    { brand: "Proton", model: "Perdana", yearStart: 2013, yearEnd: 2025 },
    { brand: "Proton", model: "Persona", yearStart: 1993, yearEnd: 2025 },
    { brand: "Proton", model: "S70", yearStart: 2023, yearEnd: 2025 },
    { brand: "Proton", model: "Saga", yearStart: 1985, yearEnd: 2025 },
    { brand: "Proton", model: "Wira", yearStart: 1993, yearEnd: 2009 },
    { brand: "Proton", model: "X50", yearStart: 2020, yearEnd: 2025 },
    { brand: "Proton", model: "X70", yearStart: 2018, yearEnd: 2025 },
    { brand: "Proton", model: "X90", yearStart: 2023, yearEnd: 2025 },

    // Mazda Models
    { brand: "Mazda", model: "CX-5", yearStart: 2013, yearEnd: 2025 },
    { brand: "Mazda", model: "CX-8", yearStart: 2019, yearEnd: 2025 },
    { brand: "Mazda", model: "CX-30", yearStart: 2020, yearEnd: 2025 },

    // Chery Models
    { brand: "Chery", model: "Omoda 5", yearStart: 2023, yearEnd: 2025 },
    { brand: "Chery", model: "Tiggo 8 Pro", yearStart: 2023, yearEnd: 2025 },
    { brand: "Chery", model: "Omoda E5", yearStart: 2024, yearEnd: 2025 },
    { brand: "Chery", model: "Tiggo Cross", yearStart: 2025, yearEnd: 2025 },

    // Ford Models
    { brand: "Ford", model: "Ranger", yearStart: 2012, yearEnd: 2025 }
] as const

const FUZZY_MATCH_THRESHOLD = 0.4
const MAX_SUGGESTIONS = 3
const SUGGESTION_MIN_LENGTH = 0
const MODEL_MIN_LENGTH = 2

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getCarBrands = (): string[] => {
  return [...new Set(VEHICLE_DATABASE.map((v) => v.brand))].sort()
}

const getCarModels = (): Record<string, string[]> => {
  return VEHICLE_DATABASE.reduce((acc, vehicle) => {
    if (!acc[vehicle.brand]) {
      acc[vehicle.brand] = []
    }
    if (!acc[vehicle.brand].includes(vehicle.model)) {
      acc[vehicle.brand].push(vehicle.model)
    }
    return acc
  }, {} as Record<string, string[]>)
}

const fuzzyMatch = (input: string, target: string): number => {
  const inputLower = input.toLowerCase()
  const targetLower = target.toLowerCase()

  // Exact match
  if (inputLower === targetLower) return 1
  
  // Contains match
  if (targetLower.includes(inputLower)) return 0.8

  // Character similarity
  let matches = 0
  const minLength = Math.min(inputLower.length, targetLower.length)
  
  for (let i = 0; i < minLength; i++) {
    if (inputLower[i] === targetLower[i]) matches++
  }

  return matches / Math.max(inputLower.length, targetLower.length)
}

const generateYearSuggestions = (): string[] => {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 30 }, (_, i) => (currentYear - i).toString())
}

const findVehicleData = (brand: string, model: string): VehicleData | undefined => {
  return VEHICLE_DATABASE.find((v) => v.brand === brand && v.model === model)
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function VehicleDetailsStep({ formData, updateFormData }: VehicleDetailsStepProps) {
  const [brandSuggestions, setBrandSuggestions] = useState<string[]>([])
  const [modelSuggestions, setModelSuggestions] = useState<string[]>([])
  const [yearSuggestions, setYearSuggestions] = useState<string[]>([])
  const [modelError, setModelError] = useState<string>("")
  const [yearError, setYearError] = useState<string>("")

  // Get data once to avoid recalculating
  const carBrands = getCarBrands()
  const carModels = getCarModels()

  // ============================================================================
  // SUGGESTION GENERATORS
  // ============================================================================

  const generateBrandSuggestions = (input: string): string[] => {
    if (input.length <= SUGGESTION_MIN_LENGTH) return []

    return carBrands
      .map((brand) => ({ brand, score: fuzzyMatch(input, brand) }))
      .filter((item) => item.score > FUZZY_MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.brand)
      .slice(0, MAX_SUGGESTIONS)
  }

  const generateModelSuggestions = (brand: string, input: string): string[] => {
    if (!brand) return []

    const brandModels = carModels[brand]
    if (!brandModels) return []

    // If input is empty or very short, show top 3 models for the brand
    if (input.length <= SUGGESTION_MIN_LENGTH) {
      return brandModels.slice(0, MAX_SUGGESTIONS)
    }

    const filteredModels = brandModels
      .map((model) => ({ model, score: fuzzyMatch(input, model) }))
      .filter((item) => item.score > FUZZY_MATCH_THRESHOLD)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.model)

    // If no matches found, return top 3 models for the brand
    if (filteredModels.length === 0) {
      return brandModels.slice(0, MAX_SUGGESTIONS)
    }

    return filteredModels.slice(0, MAX_SUGGESTIONS)
  }

  const generateYearSuggestionsFiltered = (input: string): string[] => {
    if (input.length === 0) return []

    const years = generateYearSuggestions()
    return years.filter((year) => year.includes(input)).slice(0, MAX_SUGGESTIONS)
  }

  // ============================================================================
  // VALIDATION FUNCTIONS
  // ============================================================================

  const validateModel = (brand: string, model: string): string => {
    if (!brand) return "Please select a valid brand first."

    const brandModels = carModels[brand]
    if (!brandModels) return "Please select a valid brand first."

    if (model.length <= MODEL_MIN_LENGTH) return ""

    const exactMatch = brandModels.find((m) => m.toLowerCase() === model.toLowerCase())
    if (!exactMatch) {
      return `"${model}" might not be a valid model for ${brand}. See suggestions below.`
    }

    return ""
  }

  const validateYear = (brand: string, model: string, year: string): string => {
    if (!brand || !model || year.length !== 4) return ""

    const vehicleData = findVehicleData(brand, model)
    if (!vehicleData) return ""

    const yearNum = Number.parseInt(year)
    if (yearNum < vehicleData.yearStart || yearNum > vehicleData.yearEnd) {
      return `${brand} ${model} was only available from ${vehicleData.yearStart} to ${vehicleData.yearEnd}`
    }

    return ""
  }

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleBrandChange = (value: string): void => {
    updateFormData({ vehicleMake: value, vehicleModel: "", yearManufactured: "" })
    
    // Reset states
    setModelError("")
    setYearError("")
    setModelSuggestions([])
    setYearSuggestions([])

    // Generate suggestions
    const suggestions = generateBrandSuggestions(value)
    setBrandSuggestions(suggestions)
  }

  const handleModelChange = (value: string): void => {
    updateFormData({ vehicleModel: value, yearManufactured: "" })
    
    // Reset year states
    setYearError("")
    setYearSuggestions([])

    // Always generate suggestions when brand is selected
    if (formData.vehicleMake) {
      const suggestions = generateModelSuggestions(formData.vehicleMake, value)
      setModelSuggestions(suggestions)
    }

    const error = validateModel(formData.vehicleMake, value)
    setModelError(error)
  }

  const handleYearChange = (value: string): void => {
    updateFormData({ yearManufactured: value })

    // Generate suggestions
    const suggestions = generateYearSuggestionsFiltered(value)
    setYearSuggestions(suggestions)

    // Validate year
    const error = validateYear(formData.vehicleMake, formData.vehicleModel, value)
    setYearError(error)
  }

  const selectBrand = (brand: string): void => {
    updateFormData({ vehicleMake: brand, vehicleModel: "", yearManufactured: "" })
    setBrandSuggestions([])
    setYearSuggestions([])
    setModelError("")
    setYearError("")
    
    // Show top 3 models for the selected brand immediately
    const topModels = generateModelSuggestions(brand, "")
    setModelSuggestions(topModels)
  }

  const selectModel = (model: string): void => {
    updateFormData({ vehicleModel: model, yearManufactured: "" })
    setModelSuggestions([])
    setYearSuggestions([])
    setModelError("")
    setYearError("")
  }

  const selectYear = (year: string): void => {
    updateFormData({ yearManufactured: year })
    setYearSuggestions([])
    
    // Re-validate after selection
    const error = validateYear(formData.vehicleMake, formData.vehicleModel, year)
    setYearError(error)
  }

  // ============================================================================
  // RENDER COMPONENTS
  // ============================================================================

  const renderSuggestions = (suggestions: string[], onSelect: (value: string) => void, label: string) => {
    if (suggestions.length === 0) return null

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <p className="text-sm font-medium text-blue-700">{label}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onSelect(suggestion)}
              className="px-3 py-1.5 text-sm bg-white border border-blue-300 text-blue-700 rounded-md hover:bg-blue-100 hover:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    )
  }

  const renderError = (error: string, type: "warning" | "error" = "warning") => {
    if (!error) return null

    const styles = type === "error" 
      ? "border-red-200 bg-red-50 text-red-600 text-red-700"
      : "border-amber-200 bg-amber-50 text-amber-600 text-amber-700"

    return (
      <Alert className={styles.split(' ').slice(0, 2).join(' ')}>
        <AlertCircle className={`h-4 w-4 ${styles.split(' ')[2]}`} />
        <AlertDescription className={styles.split(' ')[3]}>{error}</AlertDescription>
      </Alert>
    )
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Vehicle Brand */}
      <div className="space-y-2">
        <Label htmlFor="vehicleBrand">Vehicle Brand</Label>
        <Input
          id="vehicleBrand"
          value={formData.vehicleMake || ""}
          onChange={(e) => handleBrandChange(e.target.value)}
          placeholder="Enter vehicle brand (e.g., Toyota, Honda, Perodua)"
        />
        {renderSuggestions(brandSuggestions, selectBrand, "Suggestions")}
      </div>

      {/* Vehicle Model */}
      <div className="space-y-2">
        <Label htmlFor="vehicleModel">Vehicle Model</Label>
        <Input
          id="vehicleModel"
          value={formData.vehicleModel || ""}
          onChange={(e) => handleModelChange(e.target.value)}
          placeholder="Enter vehicle model"
        />
        {renderSuggestions(modelSuggestions, selectModel, "Suggestions")}
        {renderError(modelError, "warning")}
      </div>

      {/* Vehicle Year */}
      <div className="space-y-2">
        <Label htmlFor="vehicleYear">Vehicle Year</Label>
        <Input
          id="vehicleYear"
          value={formData.yearManufactured || ""}
          onChange={(e) => handleYearChange(e.target.value)}
          placeholder="Enter year (e.g., 2020)"
        />
        {renderSuggestions(yearSuggestions, selectYear, "Suggestions")}
        {renderError(yearError, "error")}
      </div>
    </div>
  )
}

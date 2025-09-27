"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2, FileText, CheckCircle, AlertCircle, X } from "lucide-react"

// Import the autovalidator-sdk
import InputValidator from 'autovalidator-sdk';

interface SearchResult {
  text: string;
  score?: number;
  distance?: number;
  isFromVOC?: boolean;
}

interface SearchResponse {
  results: SearchResult[];
  query: string;
  domain: string;
  voc_result?: {
    car_brand: string;
    car_model: string;
    manufactured_year: string;
    voc_valid: boolean;
  };
}

interface ManufacturedYearRange {
  year_start?: number;
  year_end?: number;
}

interface VehicleDetailsPageProps {
  formData: any;
  onNext: () => void;
  onBack: () => void;
  onUpdateData: (data: any) => void;
}

export default function VehicleDetailsPage({ formData, onNext, onBack, onUpdateData }: VehicleDetailsPageProps) {
  const [brandSuggestions, setBrandSuggestions] = useState<SearchResult[]>([]);
  const [modelSuggestions, setModelSuggestions] = useState<SearchResult[]>([]);
  const [loadingBrand, setLoadingBrand] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [showBrandSuggestions, setShowBrandSuggestions] = useState(false);
  const [showModelSuggestions, setShowModelSuggestions] = useState(false);
  const [justSelectedBrand, setJustSelectedBrand] = useState(false);
  const [justSelectedModel, setJustSelectedModel] = useState(false);
  const [vocDataFields, setVocDataFields] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<ManufacturedYearRange>({});
  const [loadingYearRange, setLoadingYearRange] = useState(false);
  const [yearError, setYearError] = useState<string | null>(null);
  const [hasCheckedYearRange, setHasCheckedYearRange] = useState(false);
  const [vocData, setVocData] = useState<{
  carBrand: string;
  carModel: string;
  manufacturedYear: string;
}>({ carBrand: '', carModel: '', manufacturedYear: '' });
  const [showValidationModal, setShowValidationModal] = useState(false);

  //Applied car plate validation
  useEffect(() => {
    const carPlateInput = document.getElementById('carPlate') as HTMLInputElement | null;
      if (carPlateInput) {
        InputValidator.validateCarPlate(carPlateInput);
      }

    if (formData.sessionId) {
      setShowValidationModal(true);
      
      const timer = setTimeout(() => {
        setShowValidationModal(false);
      }, 4000);
      
      return () => clearTimeout(timer);

    }
  }, []);

const capitalizeFirstLetter = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

  const handleInputChange = (field: string, value: string | boolean) => {
    // Reset the corresponding flag when typing in the field
    if (field === "carBrand" && typeof value === "string" && value !== formData.carBrand) {
      setJustSelectedBrand(false);
      setYearRange({});
      setHasCheckedYearRange(false);
    }
    if (field === "carModel" && typeof value === "string" && value !== formData.carModel) {
      setJustSelectedModel(false);
      setYearRange({});
      setHasCheckedYearRange(false);
    }

    if (field === "manufacturedYear" && typeof value === "string") {
      // If we haven't checked year range yet and we have brand and model data
      if (!hasCheckedYearRange && formData.carBrand && formData.carModel) {
        fetchYearRange();
        setHasCheckedYearRange(true);
      }
      validateManufacturedYear(value);
    }
    
    onUpdateData({ [field]: value })
  }

  const detectBrandTypo = async (query: string) => {
  if (!query || query.length < 2) {
    // Always show VOC data suggestion if available, even with short query
    if (vocData.carBrand && vocDataFields.includes('carBrand')) {
      setBrandSuggestions([{ text: vocData.carBrand, isFromVOC: true }]);
      setShowBrandSuggestions(true);
      return;
    }
    
    setBrandSuggestions([]);
    setShowBrandSuggestions(false);
    return;
  }

  try {
    setLoadingBrand(true);
    const response = await fetch(`/api/detect/brand/${encodeURIComponent(query)}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data: SearchResponse = await response.json();
      
      let suggestions = [...data.results];
      
      // Always add VOC data at the top of suggestions if it exists
      if (vocData.carBrand && vocDataFields.includes('carBrand')) {
        // Check if VOC brand is not already in the suggestions
        const vocExists = suggestions.some(s => 
          s.text.toLowerCase() === vocData.carBrand.toLowerCase()
        );
        
        if (!vocExists) {
          suggestions = [
            { text: vocData.carBrand, isFromVOC: true },
            ...suggestions
          ];
        } else {
          // If it exists, mark it as from VOC
          suggestions = suggestions.map(s => 
            s.text.toLowerCase() === vocData.carBrand.toLowerCase() 
              ? { ...s, isFromVOC: true }
              : s
          );
        }
      }
      
      setBrandSuggestions(suggestions);
      setShowBrandSuggestions(suggestions.length > 0);
    } else {
      console.error("Failed to fetch brand suggestions");
      
      // Still show VOC suggestion if available
      if (vocData.carBrand && vocDataFields.includes('carBrand')) {
        setBrandSuggestions([{ text: vocData.carBrand, isFromVOC: true }]);
        setShowBrandSuggestions(true);
      } else {
        setBrandSuggestions([]);
        setShowBrandSuggestions(false);
      }
    }
  } catch (error) {
    console.error("Error fetching brand suggestions:", error);
    
    // Still show VOC suggestion if available
    if (vocData.carBrand && vocDataFields.includes('carBrand')) {
      setBrandSuggestions([{ text: vocData.carBrand, isFromVOC: true }]);
      setShowBrandSuggestions(true);
    } else {
      setBrandSuggestions([]);
      setShowBrandSuggestions(false);
    }
  } finally {
    setLoadingBrand(false);
  }
};

// Updated detectModelTypo function
const detectModelTypo = async (query: string) => {
  if (!query || query.length < 2) {
    // Always show VOC data suggestion if available, even with short query
    if (vocData.carModel && vocDataFields.includes('carModel')) {
      setModelSuggestions([{ text: vocData.carModel, isFromVOC: true }]);
      setShowModelSuggestions(true);
      return;
    }
    
    setModelSuggestions([]);
    setShowModelSuggestions(false);
    return;
  }

  try {
    setLoadingModel(true);
    const response = await fetch(`/api/detect/model/${encodeURIComponent(query)}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data: SearchResponse = await response.json();
      
      let suggestions = [...data.results];
      
      // Always add VOC data at the top of suggestions if it exists
      if (vocData.carModel && vocDataFields.includes('carModel')) {
        // Check if VOC model is not already in the suggestions
        const vocExists = suggestions.some(s => 
          s.text.toLowerCase() === vocData.carModel.toLowerCase()
        );
        
        if (!vocExists) {
          suggestions = [
            { text: vocData.carModel, isFromVOC: true },
            ...suggestions
          ];
        } else {
          // If it exists, mark it as from VOC
          suggestions = suggestions.map(s => 
            s.text.toLowerCase() === vocData.carModel.toLowerCase() 
              ? { ...s, isFromVOC: true }
              : s
          );
        }
      }
      
      setModelSuggestions(suggestions);
      setShowModelSuggestions(suggestions.length > 0);
    } else {
      console.error("Failed to fetch model suggestions");
      
      // Still show VOC suggestion if available
      if (vocData.carModel && vocDataFields.includes('carModel')) {
        setModelSuggestions([{ text: vocData.carModel, isFromVOC: true }]);
        setShowModelSuggestions(true);
      } else {
        setModelSuggestions([]);
        setShowModelSuggestions(false);
      }
    }
  } catch (error) {
    console.error("Error fetching model suggestions:", error);
    
    // Still show VOC suggestion if available
    if (vocData.carModel && vocDataFields.includes('carModel')) {
      setModelSuggestions([{ text: vocData.carModel, isFromVOC: true }]);
      setShowModelSuggestions(true);
    } else {
      setModelSuggestions([]);
      setShowModelSuggestions(false);
    }
  } finally {
    setLoadingModel(false);
  }
};

  const validateManufacturedYear = (yearValue: string) => {
    if (!yearValue) {
      setYearError(null);
      return;
    }

    const year = parseInt(yearValue);
    
    if (isNaN(year)) {
      setYearError("Please enter a valid year");
      return;
    }

    if (yearRange.year_start && yearRange.year_end) {
      if (year < yearRange.year_start || year > yearRange.year_end) {
        setYearError(`Manufactured Year must be between ${yearRange.year_start} and ${yearRange.year_end}`);
      } else {
        setYearError(null);
      }
    } else {
      setYearError(null);
    }
  };

  const saveCorrection = async (typo: string, corrected: string, domain: string) => {
    try {
      console.log('Saving correction:', { typo, corrected, domain });
      
      const response = await fetch('/api/save-correction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          typo,
          corrected,
          domain
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to save correction:', response.status, errorData);
      } else {
        console.log('Correction saved successfully');
      }
    } catch (error) {
      console.error('Error saving correction:', error);
    }
  };

  const selectBrandSuggestion = (suggestion: string) => {
    if (formData.carBrand && formData.carBrand !== suggestion) {
      saveCorrection(formData.carBrand, suggestion, "brand");
    }
    
    // Set flag to prevent immediate re-search
    setJustSelectedBrand(true);
    
    handleInputChange("carBrand", suggestion);
    setBrandSuggestions([]);
    setShowBrandSuggestions(false);
  };

  const selectModelSuggestion = (suggestion: string) => {
    if (formData.carModel && formData.carModel !== suggestion) {
      saveCorrection(formData.carModel, suggestion, "model");
    }
    
    // Set flag to prevent immediate re-search
    setJustSelectedModel(true);
    
    handleInputChange("carModel", suggestion);
    setModelSuggestions([]);
    setShowModelSuggestions(false);
  };

  // Move fetchYearRange to be a named function in the component
  const fetchYearRange = async () => {
    if (formData.carBrand && formData.carModel) {
      try {
        setLoadingYearRange(true);
        const response = await fetch('/api/get-manufactured-year-range', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            car_brand: formData.carBrand,
            car_model: formData.carModel
          }),
        });

        if (response.ok) {
          const data: ManufacturedYearRange = await response.json();
          setYearRange(data);
          
          // Re-validate the current year value with the new range
          if (formData.manufacturedYear) {
            validateManufacturedYear(formData.manufacturedYear);
          }
        } else {
          console.error("Failed to fetch year range");
          setYearRange({});
        }
      } catch (error) {
        console.error("Error fetching year range:", error);
        setYearRange({});
      } finally {
        setLoadingYearRange(false);
      }
    }
  };

  // Update the useEffect for fetching VOC data
useEffect(() => {
  const fetchVocData = async () => {
    if (formData.sessionId) {
      try {
        const response = await fetch('/api/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: "",
            domain: "brand", 
            session_id: formData.sessionId
          }),
        });

        if (response.ok) {
          const data: SearchResponse = await response.json();
          
          // If we have VOC data, store it for later use in suggestions
          if (data.voc_result && data.voc_result.voc_valid) {
            const { car_brand, car_model, manufactured_year } = data.voc_result;
            const updatedFields = [];
            
            if (car_brand) updatedFields.push('carBrand');
            if (car_model) updatedFields.push('carModel');
            if (manufactured_year) updatedFields.push('manufacturedYear');
            
            // Only track which fields came from VOC
            setVocDataFields(updatedFields);
            
            // Store VOC data with proper capitalization
            setVocData({
              carBrand: capitalizeFirstLetter(car_brand || ''),
              carModel: capitalizeFirstLetter(car_model || ''),
              manufacturedYear: manufactured_year || ''
            });
          }
        }
      } catch (error) {
        console.error("Error fetching VOC data:", error);
      }
    }
  };

  fetchVocData();
}, [formData.sessionId]);

  // Debounce function for brand input
  useEffect(() => {
    if (justSelectedBrand) {
      return; // Skip the search if we just selected a suggestion
    }
    
    const timeoutId = setTimeout(() => {
      if (formData.carBrand) {
        detectBrandTypo(formData.carBrand);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.carBrand, justSelectedBrand]);

  // Debounce function for model input
  useEffect(() => {
    if (justSelectedModel) {
      return; // Skip the search if we just selected a suggestion
    }
    
    const timeoutId = setTimeout(() => {
      if (formData.carModel) {
        detectModelTypo(formData.carModel);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.carModel, justSelectedModel]);

  // Helper to format confidence score
  const formatConfidence = (score?: number): string => {
    if (!score) return '';
    return (score * 100).toFixed(0) + '%';
  }


  return (
    <div className="min-h-screen bg-gray-50">
      {showValidationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-center flex-col space-y-4">
              <div className="p-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
              <p className="text-lg font-medium text-center text-gray-800">
                Validating information from your Vehicle Ownership Certificate...
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white px-4 py-3 border-b">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 text-left">BJAK Demo</h1>
        </div>
      </div>
      <div className="bg-white px-4 py-6 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium mb-2">
                1
              </div>
              <span className="text-base text-gray-500">VOC Upload</span>
            </div>
            <div className="flex-1 h-px bg-blue-600 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
                2
              </div>
              <span className="text-base text-blue-600 font-medium">Vehicle Info</span>
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
          <button onClick={onBack} className="flex items-center text-gray-600 mb-6 text-base hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 2: Vehicle Details</h2>
          
          {/* Car Brand */}
        <div className="mb-4">
          <label className="text-base font-medium text-gray-900 mb-2 block">
            Car Brand <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              value={formData.carBrand || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("carBrand", e.target.value)}
              className="w-full" // Remove special styling
              placeholder="e.g., Toyota, Honda, BMW"
            />
            {loadingBrand && (
              <div className="absolute right-3 top-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
            
            {showBrandSuggestions && brandSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg animate-in fade-in-50 duration-200">
                <div className="py-1 max-h-60 overflow-auto">
      <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 font-semibold flex items-center justify-between">
        <span>Suggestions</span>
        <button 
          onClick={() => {
            setShowBrandSuggestions(false);
            setBrandSuggestions([]);
          }}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close suggestions"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
                  {brandSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0 ${
                        suggestion.isFromVOC ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                      }`}
                      onClick={() => selectBrandSuggestion(suggestion.text)}
                    >
                      <div className="flex items-center">
                        {suggestion.isFromVOC ? (
                          <FileText className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2.5"></div>
                        )}
                        <span className={suggestion.isFromVOC ? 'font-medium text-green-800' : 'font-medium'}>
                          {suggestion.text}
                          {suggestion.isFromVOC && (
                            <span className="ml-2 text-xs text-green-700">(VOC)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
          
           {/* Car Model */}
        <div className="mb-4">
          <label className="text-base font-medium text-gray-900 mb-2 block">
            Car Model <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              value={formData.carModel || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("carModel", e.target.value)}
              className="w-full" // Remove special styling
              placeholder="e.g., Camry, Civic, X5"
            />
            {loadingModel && (
              <div className="absolute right-3 top-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
            
            {showModelSuggestions && modelSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg animate-in fade-in-50 duration-200">
                <div className="py-1 max-h-60 overflow-auto">
                  <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 font-semibold flex items-center justify-between">
        <span>Suggestions</span>
        <button 
          onClick={() => {
            setShowModelSuggestions(false);
            setModelSuggestions([]);
          }}
          className="text-gray-400 hover:text-gray-600"
          aria-label="Close suggestions"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
                  {modelSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className={`flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0 ${
                        suggestion.isFromVOC ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                      }`}
                      onClick={() => selectModelSuggestion(suggestion.text)}
                    >
                      <div className="flex items-center">
                        {suggestion.isFromVOC ? (
                          <FileText className="h-4 w-4 text-green-600 mr-2" />
                        ) : (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2.5"></div>
                        )}
                        <span className={suggestion.isFromVOC ? 'font-medium text-green-800' : 'font-medium'}>
                          {suggestion.text}
                          {suggestion.isFromVOC && (
                            <span className="ml-2 text-xs text-green-700">(VOC)</span>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Manufactured Year */}
        <div className="mb-6">
          <label className="text-base font-medium text-gray-900 mb-2 block">
            Manufactured Year <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Input
              value={formData.manufacturedYear || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("manufacturedYear", e.target.value)}
              className={`w-full ${yearError ? 'border-red-500 ring-red-200 focus-visible:ring-red-300' : ''}`}
              placeholder={yearRange.year_start && yearRange.year_end 
                ? `Between ${yearRange.year_start} and ${yearRange.year_end}` 
                : "e.g., 2020"
              }
            />
            {loadingYearRange && (
              <div className="absolute right-3 top-2">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          {/* Show VOC year as a suggestion if available and not already selected */}
          {vocData.manufacturedYear && 
           vocDataFields.includes('manufacturedYear') && 
           formData.manufacturedYear !== vocData.manufacturedYear && (
            <div className="mt-2 bg-green-50 border border-green-100 rounded p-2 flex items-center justify-between animate-in slide-in-from-top duration-300">
              <div className="flex items-center">
                <FileText className="h-4 w-4 text-green-600 mr-2" />
                <span className="text-sm text-green-800">
                  Year from VOC: <span className="font-medium">{vocData.manufacturedYear}</span>
                </span>
              </div>
              <button
                onClick={() => handleInputChange("manufacturedYear", vocData.manufacturedYear)}
                className="text-xs font-medium px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
              >
                Use this
              </button>
            </div>
          )}
          
          {yearError && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1.5 flex-shrink-0" />
              <span>{yearError}</span>
            </div>
          )}
          {yearRange.year_start && yearRange.year_end && !yearError && (
            <div className="mt-1.5 text-xs text-red-500">
              Valid years for {formData.carBrand} {formData.carModel}: {yearRange.year_start} - {yearRange.year_end}
            </div>
          )}
        </div>


          
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-900 mb-2">
              What's your Vehicle Registration Number? <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">Private-owned vehicle only.</p>
            <Input
              id="carPlate"
              value={formData.registrationNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("registrationNumber", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="mb-6 space-y-2">
            <button className="text-blue-600 text-base underline block">New car with no plate number</button>
            <button className="text-blue-600 text-base underline block">I want to register with my Passport</button>
            <button className="text-blue-600 text-base underline block">I want to insure a Company Vehicle</button>
          </div>


          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">E-Hailing</h3>
            <p className="text-base text-gray-600 mb-4">Is your vehicle used for e-hailing services?</p>
            <div className="flex gap-3">
              <Button
                onClick={() => handleInputChange("isEHailing", true)}
                className={`flex-1 ${
                  formData.isEHailing 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-white text-black border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Yes
              </Button>
              <Button
                onClick={() => handleInputChange("isEHailing", false)}
                className={`flex-1 ${
                  !formData.isEHailing 
                    ? "bg-blue-600 text-white hover:bg-blue-700" 
                    : "bg-white text-black border border-gray-300 hover:bg-gray-50"
                }`}
              >
                No
              </Button>
            </div>
          </div>
          <Button onClick={onNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base">
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
}
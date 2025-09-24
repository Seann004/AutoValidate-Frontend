"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2, FileText, CheckCircle } from "lucide-react"

interface SearchResult {
  text: string;
  score?: number;
  distance?: number;
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

  const handleInputChange = (field: string, value: string | boolean) => {
    // Reset the corresponding flag when typing in the field
    if (field === "carBrand" && typeof value === "string" && value !== formData.carBrand) {
      setJustSelectedBrand(false);
    }
    if (field === "carModel" && typeof value === "string" && value !== formData.carModel) {
      setJustSelectedModel(false);
    }
    
    onUpdateData({ [field]: value })
  }

  const detectBrandTypo = async (query: string) => {
    if (!query || query.length < 2) {
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
        setBrandSuggestions(data.results);
        setShowBrandSuggestions(data.results.length > 0);
      } else {
        console.error("Failed to fetch brand suggestions");
        setBrandSuggestions([]);
        setShowBrandSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching brand suggestions:", error);
      setBrandSuggestions([]);
      setShowBrandSuggestions(false);
    } finally {
      setLoadingBrand(false);
    }
  };

  const detectModelTypo = async (query: string) => {
    if (!query || query.length < 2) {
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
        setModelSuggestions(data.results);
        setShowModelSuggestions(data.results.length > 0);
      } else {
        console.error("Failed to fetch model suggestions");
        setModelSuggestions([]);
        setShowModelSuggestions(false);
      }
    } catch (error) {
      console.error("Error fetching model suggestions:", error);
      setModelSuggestions([]);
      setShowModelSuggestions(false);
    } finally {
      setLoadingModel(false);
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

  // Fetch VOC data when component mounts if session_id exists
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
              domain: "BRAND",
              session_id: formData.sessionId
            }),
          });

          if (response.ok) {
            const data: SearchResponse = await response.json();
            
            // If we have VOC data, populate the form fields
            if (data.voc_result && data.voc_result.voc_valid) {
              const { car_brand, car_model, manufactured_year } = data.voc_result;
              const updatedFields = [];
              
              if (car_brand) updatedFields.push('carBrand');
              if (car_model) updatedFields.push('carModel');
              if (manufactured_year) updatedFields.push('manufacturedYear');
              
              onUpdateData({
                carBrand: car_brand || formData.carBrand,
                carModel: car_model || formData.carModel,
                manufacturedYear: manufactured_year || formData.manufacturedYear
              });
              
              // Track which fields came from VOC
              setVocDataFields(updatedFields);
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

  // VOC badge component
  const VocBadge = () => (
    <div className="inline-flex items-center px-2 py-1 ml-2 rounded-md bg-green-50 border border-green-200">
      <FileText className="h-3.5 w-3.5 text-green-600 mr-1" />
      <span className="text-xs font-medium text-green-700">Direct from VOC</span>
    </div>
  );

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
          
          {formData.sessionId && vocDataFields.length > 0 && (
            <div className="mb-6 bg-green-50 border border-green-100 rounded-lg p-4 animate-in fade-in duration-300">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-0.5">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">VOC Data Retrieved Successfully</h3>
                  <div className="mt-1 text-sm text-green-700">
                    <p>We've pre-filled some information based on your VOC document.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Car Brand */}
          <div className="mb-4">
            <label className="flex items-center text-base font-medium text-gray-900 mb-2">
              <span>Car Brand <span className="text-red-500">*</span></span>
              {vocDataFields.includes('carBrand') && <VocBadge />}
            </label>
            <div className="relative">
              <Input
                value={formData.carBrand || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("carBrand", e.target.value)}
                className={`w-full ${vocDataFields.includes('carBrand') ? 'border-green-500 bg-green-50 ring-green-200 focus-visible:ring-green-300' : ''}`}
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
                    <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 font-semibold">
                      Suggestions
                    </div>
                    {brandSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                        onClick={() => selectBrandSuggestion(suggestion.text)}
                      >
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2.5"></div>
                          <span className="font-medium">{suggestion.text}</span>
                        </div>
                        {suggestion.score && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {formatConfidence(suggestion.score)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Car Model */}
          <div className="mb-4">
            <label className="flex items-center text-base font-medium text-gray-900 mb-2">
              <span>Car Model <span className="text-red-500">*</span></span>
              {vocDataFields.includes('carModel') && <VocBadge />}
            </label>
            <div className="relative">
              <Input
                value={formData.carModel || ""}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("carModel", e.target.value)}
                className={`w-full ${vocDataFields.includes('carModel') ? 'border-green-500 bg-green-50 ring-green-200 focus-visible:ring-green-300' : ''}`}
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
                    <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-200 font-semibold">
                      Suggestions
                    </div>
                    {modelSuggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between px-3 py-2 hover:bg-blue-50 cursor-pointer text-gray-700 border-b border-gray-100 last:border-b-0"
                        onClick={() => selectModelSuggestion(suggestion.text)}
                      >
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2.5"></div>
                          <span className="font-medium">{suggestion.text}</span>
                        </div>
                        {suggestion.score && (
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                            {formatConfidence(suggestion.score)}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Manufactured Year */}
          <div className="mb-6">
            <label className="flex items-center text-base font-medium text-gray-900 mb-2">
              <span>Manufactured Year <span className="text-red-500">*</span></span>
              {vocDataFields.includes('manufacturedYear') && <VocBadge />}
            </label>
            <Input
              value={formData.manufacturedYear || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("manufacturedYear", e.target.value)}
              className={`w-full ${vocDataFields.includes('manufacturedYear') ? 'border-green-500 bg-green-50 ring-green-200 focus-visible:ring-green-300' : ''}`}
              placeholder="e.g., 2020"
              type="number"
            />
          </div>

          {/* Rest of your form fields remain unchanged */}
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-900 mb-2">
              What's your Vehicle Registration Number? <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-gray-500 mb-3">Private-owned vehicle only.</p>
            <Input
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

          <div className="mb-4">
            <label className="block text-base font-medium text-gray-900 mb-2">
              Vehicle Owner's NRIC <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-blue-600 mb-3">
              Your IC Number is required to retrieve your KCU (No-Claim Discount)
            </p>
            <Input
              value={formData.ownerNric}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("ownerNric", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium text-gray-900 mb-2">Police IC / Army IC (if applicable)</label>
            <Input
              value={formData.policeIc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("policeIc", e.target.value)}
              placeholder="RFXXXXX"
              className="w-full"
            />
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
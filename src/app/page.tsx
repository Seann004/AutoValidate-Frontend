"use client"

import { useState } from "react"
import { X, ExternalLink, Copy, Mail, AlertTriangle, Code, FileText, Check } from "lucide-react"
import VocUploadPage from "@/components/page/voc-upload-page"
import VehicleDetailsPage from "@/components/page/vehicle-details-page"
import PersonalDetailsPage from "@/components/page/personal-details-page"

export default function InsuranceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // VOC upload
    vocFile: null,
    // Vehicle details
    registrationNumber: "",
    ownerNric: "",
    policeIc: "",
    isEHailing: false,
    // Personal details
    ownerName: "",
    promoCode: "",
    email: "",
    whatsappNumber: "",
    postcode: "",
    agreeTerms: false,
    receiveEmails: false,
    sendWhatsApp: true,
  })

  const [showSplash, setShowSplash] = useState(true)
  const [apiKeyCopied, setApiKeyCopied] = useState(false)
  const API_KEY = "xxx"
  const DOCS_URL = "https://www.test.com"

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
  }

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(API_KEY)
      setApiKeyCopied(true)
      setTimeout(() => setApiKeyCopied(false), 15000) // Reset after 2 seconds
    } catch {
      // ignore copy failures
    }
  }

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSplash(false)} />
          <div className="relative max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Demo / Judges Notes</h3>
                <button
                  onClick={() => setShowSplash(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-3">
              <div className="grid gap-3">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex-shrink-0 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center">
                    <Code className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">Prototype Demo</p>
                    <p className="text-xs text-gray-600 mt-1">
                      This is a prototype demo website to showcase the usability of our deployed API endpoint and published SDK.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex-shrink-0 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center">
                    <ExternalLink className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">Developer Documentation</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Head over to{" "}
                      <a href={DOCS_URL} target="_blank" rel="noreferrer" className="text-green-600 underline font-medium hover:text-green-700">
                        {DOCS_URL}
                      </a>{" "}
                      to see the developers documentation and learn how to test it out on your frontend.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex-shrink-0 w-7 h-7 bg-purple-500 rounded-full flex items-center justify-center">
                    <Copy className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">API Key</p>
                    <p className="text-xs text-gray-500 mt-1">API_KEY (check documentation how to use API KEY)</p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-gray-800">
                        {API_KEY}
                      </code>
                      <button
                        type="button"
                        onClick={copyApiKey}
                        className="inline-flex items-center px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors cursor-pointer"
                      >
                        {apiKeyCopied ? (
                          <>
                            <Check className="h-3 w-3 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex-shrink-0 w-7 h-7 bg-red-500 rounded-full flex items-center justify-center">
                    <Mail className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">Bug Reports</p>
                    <p className="text-xs text-gray-600 mt-1">
                      If any bugs are found, please feel free to email: <span className="font-medium text-red-700">xxx</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex-shrink-0 w-7 h-7 bg-yellow-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">Frontend Prototype Notice</p>
                    <p className="text-xs text-gray-600 mt-1">
                      There will be bugs in the frontend prototype we created as this is a DEMO website only. The main functionalities of our system are our API, VOC optional upload, and lightweight SDK.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex-shrink-0 w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center">
                    <FileText className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium text-sm">API Reference</p>
                    <p className="text-xs text-gray-600 mt-1">
                      API Reference can be found in the documentation linked above.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-5 py-3 border-t border-gray-200 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowSplash(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm cursor-pointer"
              >
                Got it, let's continue
              </button>
            </div>
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <VocUploadPage formData={formData} onNext={handleNext} onBack={handleBack} onUpdateData={updateFormData} />
      )}
      {currentStep === 2 && (
        <VehicleDetailsPage formData={formData} onNext={handleNext} onBack={handleBack} onUpdateData={updateFormData} />
      )}
      {currentStep === 3 && (
        <PersonalDetailsPage
          formData={formData}
          onNext={handleNext}
          onBack={handleBack}
          onUpdateData={updateFormData}
        />
      )}
    </>
  )
}
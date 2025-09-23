"use client"

import { useState } from "react"
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

  return (
    <>
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

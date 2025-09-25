"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

// Import the autovalidator-sdk
import InputValidator from 'autovalidator-sdk';
import { useEffect } from 'react';

// Register a custom validator for phone number
InputValidator.registerValidator('phoneNumber', {
    allowedChars: /[0-9]/,
    maxLength: 12,
    transform: (value) => {
        const digits = value.replace(/\D/g, '');
        if (digits.length <= 3) return digits;
        if (digits.length <= 10) return digits.slice(0, 3) + '-' + digits.slice(3);
        return digits.slice(0, 3) + '-' + digits.slice(3, 11);
    },
    pattern: /^\d{3}-\d{7,8}$/,
    keypressError: "Only numbers are allowed",
    validationError: "Phone number must follow XXX-XXXXXXX format (10-11 digits)"
});

interface PersonalDetailsPageProps {
  formData: any
  onNext: () => void
  onBack: () => void
  onUpdateData: (data: any) => void
}

export default function PersonalDetailsPage({ formData, onNext, onBack, onUpdateData }: PersonalDetailsPageProps) {
  const handleInputChange = (field: string, value: string | boolean) => {
    onUpdateData({ [field]: value })
  }



  useEffect(() => {
    const emailInput = document.getElementById('email') as HTMLInputElement | null;
    if (emailInput) {
      InputValidator.validateEmail(emailInput);
    }
    const postcodeInput = document.getElementById('postcode') as HTMLInputElement | null;
    if (postcodeInput) {
      InputValidator.validatePostcode(postcodeInput);
    }
    const phoneInput = document.getElementById('phoneNumber') as HTMLInputElement | null;
    if (phoneInput) {
      InputValidator.applyCustomValidator(phoneInput, 'phoneNumber');
    }
  }, []);

  const handleSubmit = () => {
    console.log("Form submitted:", formData)
  }

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
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium mb-2">
                2
              </div>
              <span className="text-base text-gray-500">Vehicle Info</span>
            </div>
            <div className="flex-1 h-px bg-blue-600 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
                3
              </div>
              <span className="text-base text-blue-600 font-medium">Personal Info</span>
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

          <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 3: Personal Details</h2>
          <div className="mb-4">
            <label className="block text-base font-medium text-gray-900 mb-2">
              Owner's Name <span className="text-red-500">*</span>
            </label>
            <Input
              id="ownerName"
              value={formData.ownerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("ownerName", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium text-gray-900 mb-2">Promo Code</label>
            <Input
              id="promoCode"
              value={formData.promoCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("promoCode", e.target.value)}
              placeholder="XXX"
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 underline">Done! We will send you a Quote</h3>
          </div>

          <div className="mb-4">
            <label className="block text-base font-medium text-gray-900 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-blue-600 mb-3">A Quote will be sent to your Email in 5 minutes!</p>
            <Input
              id="email"
              value={formData.email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("email", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="block text-base font-medium text-gray-900 mb-2">
              Whatsapp Number <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-blue-600 mb-3">Please provide WhatsApp phone number to receive quote</p>
            <Input
              id="phoneNumber"
              type="tel"
              value={formData.phoneNumber}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("phoneNumber", e.target.value)}
              className="w-full"
            />
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium text-gray-900 mb-2">
              Postcode for Cover Note <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-blue-600 mb-3">Note: Your quotation price is based on your postcode</p>
            <Input
              id="postcode"
              value={formData.postcode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("postcode", e.target.value)}
              className="w-full"
            />
          </div>
          <div className="mb-8 space-y-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.agreeTerms}
                onChange={(e) => handleInputChange("agreeTerms", e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="terms" className="text-base text-gray-700">
                I agree to the <span className="text-blue-600 underline">Terms and Conditions</span> and{" "}
                <span className="text-blue-600 underline">Privacy Policy</span> <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="emails"
                checked={formData.receiveEmails}
                onChange={(e) => handleInputChange("receiveEmails", e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="emails" className="text-base text-gray-700">
                Receive emails for insurance quotes, reminders and offers by BJAK{" "}
                <span className="text-red-500">*</span>
              </label>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="whatsapp"
                checked={formData.sendWhatsApp}
                onChange={(e) => handleInputChange("sendWhatsApp", e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 bg-blue-600 border-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="whatsapp" className="text-base text-gray-700">
                Yes, Send my quote via WhatsApp
              </label>
            </div>
          </div>

          <Button onClick={handleSubmit} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base">
            Get Quote
          </Button>
        </div>
      </div>
    </div>
  )
}

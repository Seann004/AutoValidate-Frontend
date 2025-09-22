"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"

interface VehicleDetailsPageProps {
  formData: any
  onNext: () => void
  onBack: () => void
  onUpdateData: (data: any) => void
}

export default function VehicleDetailsPage({ formData, onNext, onBack, onUpdateData }: VehicleDetailsPageProps) {
  const handleInputChange = (field: string, value: string | boolean) => {
    onUpdateData({ [field]: value })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-blue-600 text-left">BJAK</h1>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white px-4 py-6 border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium mb-2">
                1
              </div>
              <span className="text-base text-blue-600 font-medium">Vehicle Info</span>
            </div>
            <div className="flex-1 h-px bg-gray-300 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center text-sm font-medium mb-2">
                2
              </div>
              <span className="text-base text-gray-500">Personal Info</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-8 py-10">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-10">
          {/* Back Button */}
          <button onClick={onBack} className="flex items-center text-gray-600 mb-6 text-base hover:text-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          {/* Form Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Step 1: Vehicle Details</h2>

          {/* Vehicle Registration Number */}
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

          {/* Links */}
          <div className="mb-6 space-y-2">
            <button className="text-blue-600 text-base underline block">New car with no plate number</button>
            <button className="text-blue-600 text-base underline block">I want to register with my Passport</button>
            <button className="text-blue-600 text-base underline block">I want to insure a Company Vehicle</button>
          </div>

          {/* Vehicle Owner's NRIC */}
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

          {/* Police IC / Army IC */}
          <div className="mb-6">
            <label className="block text-base font-medium text-gray-900 mb-2">Police IC / Army IC (if applicable)</label>
            <Input
              value={formData.policeIc}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("policeIc", e.target.value)}
              placeholder="RFXXXXX"
              className="w-full"
            />
          </div>

          {/* E-Hailing Section */}
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

          {/* Next Step Button */}
          <Button onClick={onNext} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base">
            Next Step
          </Button>
        </div>
      </div>
    </div>
  )
}

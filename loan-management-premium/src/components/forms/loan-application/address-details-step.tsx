"use client";

import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface FormValues {
  applicantDetails: {
    presentAddress?: string;
    permanentAddress?: string;
    sameAsPermanent?: boolean;
  };
}

export function AddressDetailsStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<FormValues>();
  const sameAsPermanent = watch("applicantDetails.sameAsPermanent");
  const presentAddress = watch("applicantDetails.presentAddress");

  // Sync permanent address when toggle is on
  const handleToggle = (checked: boolean) => {
    setValue("applicantDetails.sameAsPermanent", checked);
    if (checked && presentAddress) {
      setValue("applicantDetails.permanentAddress", presentAddress);
    }
  };

  // Update permanent address when present address changes and toggle is on
  const handlePresentAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (sameAsPermanent) {
      setValue("applicantDetails.permanentAddress", e.target.value);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">Address Information</h2>
        <p className="text-gray-400">Please provide your complete address details</p>
      </div>

      <div className="space-y-6">
        {/* Present Address */}
        <div className="space-y-2">
          <Label htmlFor="presentAddress">Present Address *</Label>
          <Textarea
            id="presentAddress"
            {...register("applicantDetails.presentAddress", {
              onChange: handlePresentAddressChange
            })}
            placeholder="Enter your complete present address including house number, street, locality, etc."
            className="bg-gray-800/50 border-gray-700 min-h-[120px] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            rows={4}
          />
          {errors?.applicantDetails?.presentAddress && (
            <p className="text-sm text-red-500 mt-1">
              {errors.applicantDetails.presentAddress.message}
            </p>
          )}
        </div>

        {/* Same as Permanent Address Toggle */}
        <div className="flex items-center justify-between py-4 px-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
          <div className="space-y-1">
            <Label htmlFor="sameAsPermanent" className="text-base cursor-pointer">
              Same as permanent address?
            </Label>
            <p className="text-sm text-gray-400">
              Enable this if your permanent address is the same as your present address
            </p>
          </div>
          <Switch
            id="sameAsPermanent"
            checked={sameAsPermanent || false}
            onCheckedChange={handleToggle}
            className="data-[state=checked]:bg-purple-600"
          />
        </div>

        {/* Permanent Address */}
        <div className="space-y-2">
          <Label htmlFor="permanentAddress">Permanent Address *</Label>
          <Textarea
            id="permanentAddress"
            {...register("applicantDetails.permanentAddress")}
            placeholder="Enter your complete permanent address"
            className={`bg-gray-800/50 border-gray-700 min-h-[120px] focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 ${
              sameAsPermanent ? 'opacity-60' : ''
            }`}
            disabled={sameAsPermanent}
            rows={4}
          />
          {errors?.applicantDetails?.permanentAddress && !sameAsPermanent && (
            <p className="text-sm text-red-500 mt-1">
              {errors.applicantDetails.permanentAddress.message}
            </p>
          )}
        </div>

        {/* Location Information Note */}
        <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-700/50">
          <h3 className="text-sm font-semibold text-purple-400 mb-2">Location Information</h3>
          <p className="text-sm text-gray-400">
            Your location details (District, Taluka, Village/City, and Pincode) were already captured in the previous step. 
            These addresses should correspond to those location details.
          </p>
        </div>

        {/* Additional Notes */}
        <div className="p-4 bg-blue-900/20 rounded-lg border border-blue-700/50">
          <h3 className="text-sm font-semibold text-blue-400 mb-2">Important Notes</h3>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>• Please provide complete address including house/flat number, building name, street, and locality</li>
            <li>• This address will be used for all official correspondence</li>
            <li>• Make sure the address matches with your identity documents</li>
            <li>• The permanent address should match your Aadhar card address</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
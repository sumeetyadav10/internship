"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useMasters } from "@/hooks/useMasters";

export function SuretyDetailsStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { districts, talukas, villages, loading, talukasLoading, villagesLoading, loadTalukas, loadVillages } = useMasters();
  
  // Watch form fields
  const district = watch("suretyDetails.district");
  const taluka = watch("suretyDetails.taluka");
  const villageCity = watch("suretyDetails.villageCity");
  const sameAsPermanent = watch("suretyDetails.sameAsPermanent");
  const presentAddress = watch("suretyDetails.presentAddress");

  // Register district, taluka, villageCity fields manually since we're using controlled components
  useEffect(() => {
    register('suretyDetails.district', { required: "District is required" });
    register('suretyDetails.taluka', { required: "Taluka is required" });
    register('suretyDetails.villageCity', { required: "Village/City is required" });
  }, [register]);

  // Load talukas when district changes or on initial load
  useEffect(() => {
    if (district) {
      loadTalukas(district);
    }
  }, [district, loadTalukas]);

  // Load villages when taluka changes or on initial load
  useEffect(() => {
    if (taluka) {
      loadVillages(taluka);
    }
  }, [taluka, loadVillages]);

  // Handle same as permanent address
  useEffect(() => {
    if (sameAsPermanent && presentAddress) {
      setValue("suretyDetails.permanentAddress", presentAddress);
    }
  }, [sameAsPermanent, presentAddress, setValue]);

  return (
    <div>
      <h2 className="section-title">Surety Details</h2>
      
      <div className="form-grid">
        {/* Left Column */}
        <div className="left-column">
          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Surety's Name :</label>
              <input 
                type="text" 
                className={`form-input ${errors.suretyDetails?.suretyName ? 'error' : ''}`}
                {...register("suretyDetails.suretyName")}
                placeholder="Enter surety full name"
              />
            </div>
            {errors.suretyDetails?.suretyName && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.suretyName.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Relation :</label>
              <input 
                type="text" 
                className={`form-input ${errors.suretyDetails?.relation ? 'error' : ''}`}
                {...register("suretyDetails.relation")}
                placeholder="e.g., Father, Brother, Friend"
              />
            </div>
            {errors.suretyDetails?.relation && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.relation.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Occupation :</label>
              <input 
                type="text" 
                className={`form-input ${errors.suretyDetails?.occupation ? 'error' : ''}`}
                {...register("suretyDetails.occupation")}
                placeholder="Enter occupation"
              />
            </div>
            {errors.suretyDetails?.occupation && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.occupation.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Designation :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("suretyDetails.designation")}
                placeholder="Enter designation"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Employer :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("suretyDetails.employer")}
                placeholder="Enter employer name"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Work Address :</label>
              <textarea 
                className="textarea-input"
                {...register("suretyDetails.workAddress")}
                placeholder="Enter work address"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Email :</label>
              <input 
                type="email" 
                className="form-input"
                {...register("suretyDetails.email")}
                placeholder="example@email.com"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Mobile Number :</label>
              <input 
                type="tel" 
                className={`form-input ${errors.suretyDetails?.mobileNo ? 'error' : ''}`}
                {...register("suretyDetails.mobileNo", {
                  onChange: (e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      e.target.value = value;
                    }
                  }
                })}
                placeholder="10 digit mobile number"
                maxLength={10}
              />
            </div>
            {errors.suretyDetails?.mobileNo && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.mobileNo.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Aadhar Number :</label>
              <input 
                type="text" 
                className={`form-input ${errors.suretyDetails?.aadharNo ? 'error' : ''}`}
                {...register("suretyDetails.aadharNo", {
                  onChange: (e) => {
                    const value = e.target.value.replace(/\s/g, "");
                    if (value.length <= 12 && /^\d*$/.test(value)) {
                      e.target.value = value;
                    }
                  }
                })}
                placeholder="12 digit Aadhar number"
                maxLength={12}
              />
            </div>
            {errors.suretyDetails?.aadharNo && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.aadharNo.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">PAN Number :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("suretyDetails.panNo")}
                placeholder="Enter PAN number"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Monthly Salary :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("suretyDetails.monthlySalary")}
                placeholder="Enter monthly salary"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Other Income :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("suretyDetails.otherIncome")}
                placeholder="Enter other income if any"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Existing Liabilities :</label>
              <textarea 
                className="textarea-input"
                {...register("suretyDetails.existingLiabilities")}
                placeholder="Enter existing liabilities"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Property Details :</label>
              <textarea 
                className="textarea-input"
                {...register("suretyDetails.propertyDetails")}
                placeholder="Enter property details"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Bank Name :</label>
              <input 
                type="text" 
                className={`form-input ${errors.suretyDetails?.bankName ? 'error' : ''}`}
                {...register("suretyDetails.bankName")}
                placeholder="Enter bank name"
              />
            </div>
            {errors.suretyDetails?.bankName && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.bankName.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Bank Branch :</label>
              <input 
                type="text" 
                className={`form-input ${errors.suretyDetails?.bankBranch ? 'error' : ''}`}
                {...register("suretyDetails.bankBranch")}
                placeholder="Enter bank branch"
              />
            </div>
            {errors.suretyDetails?.bankBranch && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.bankBranch.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Account Number :</label>
              <input 
                type="text" 
                className={`form-input ${errors.suretyDetails?.accountNo ? 'error' : ''}`}
                {...register("suretyDetails.accountNo")}
                placeholder="Enter account number"
              />
            </div>
            {errors.suretyDetails?.accountNo && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.accountNo.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label required">Residential Address :</label>
            <textarea 
              className={`textarea-input ${errors.suretyDetails?.residentialAddress ? 'error' : ''}`}
              {...register("suretyDetails.residentialAddress")}
              placeholder="Enter residential address"
            />
            {errors.suretyDetails?.residentialAddress && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.residentialAddress.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Employment Duration :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("suretyDetails.employmentDuration")}
                placeholder="e.g., 5 years"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Banker Name :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("suretyDetails.bankerName")}
                placeholder="Enter banker name"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Location Details Section */}
      <h3 className="section-title">Surety Location Details</h3>
      
      <div className="form-grid">
        <div className="left-column">
          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">District :</label>
              <select 
                className={`form-select ${errors.suretyDetails?.district ? 'error' : ''}`}
                value={district || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("suretyDetails.district", value);
                  setValue("suretyDetails.taluka", "");
                  setValue("suretyDetails.villageCity", "");
                  setValue("suretyDetails.pincode", "");
                }}
                disabled={loading}
              >
                <option value="">Select District...</option>
                {(districts || []).map((district) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.suretyDetails?.district && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.district.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Taluka :</label>
              <select 
                className={`form-select ${errors.suretyDetails?.taluka ? 'error' : ''}`}
                value={taluka || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("suretyDetails.taluka", value);
                  setValue("suretyDetails.villageCity", "");
                  setValue("suretyDetails.pincode", "");
                }}
                disabled={!district || talukasLoading}
              >
                <option value="">Select Taluka...</option>
                {(talukas || []).map((taluka) => (
                  <option key={taluka.code} value={taluka.code}>
                    {taluka.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.suretyDetails?.taluka && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.taluka.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Village / City :</label>
              <select 
                className={`form-select ${errors.suretyDetails?.villageCity ? 'error' : ''}`}
                value={villageCity || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("suretyDetails.villageCity", value);
                  
                  if (value && villages && villages.length > 0) {
                    const selectedVillage = villages.find(v => v.code === value);
                    if (selectedVillage?.pincode) {
                      setValue("suretyDetails.pincode", selectedVillage.pincode);
                    } else {
                      setValue("suretyDetails.pincode", "");
                    }
                  } else {
                    setValue("suretyDetails.pincode", "");
                  }
                }}
                disabled={!taluka || villagesLoading}
              >
                <option value="">Select Village/City...</option>
                {(villages || []).map((village) => (
                  <option key={village.code} value={village.code}>
                    {village.name}
                  </option>
                ))}
              </select>
            </div>
            {errors.suretyDetails?.villageCity && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.villageCity.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Pincode :</label>
              <input 
                type="text" 
                className={`form-input ${errors.suretyDetails?.pincode ? 'error' : ''}`}
                {...register("suretyDetails.pincode")}
                readOnly
                style={{ background: '#f8f9fa' }}
              />
            </div>
            {errors.suretyDetails?.pincode && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.suretyDetails.pincode.message}
              </p>
            )}
          </div>
        </div>

        <div className="right-column">
          <div className="form-group">
            <label className="form-label">Present Address :</label>
            <textarea 
              className="textarea-input"
              {...register("suretyDetails.presentAddress")}
              placeholder="Enter present address"
            />
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Same as permanent address? :</label>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input 
                    type="checkbox"
                    id="surety-same-yes"
                    className="checkbox-input"
                    {...register("suretyDetails.sameAsPermanent")}
                  />
                  <label htmlFor="surety-same-yes" className="checkbox-label">Yes</label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Permanent Address :</label>
            <textarea 
              className="textarea-input"
              {...register("suretyDetails.permanentAddress")}
              placeholder="Enter permanent address"
              disabled={sameAsPermanent}
              style={{ background: sameAsPermanent ? '#f8f9fa' : 'white' }}
            />
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Surety Loan :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("suretyDetails.suretyLoan")}
                placeholder="Enter surety loan details"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
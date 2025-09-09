"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { useMasters } from "@/hooks/useMasters";

export function ApplicantDetailsStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext();
  const { districts, talukas, villages, loading, talukasLoading, villagesLoading, loadTalukas, loadVillages } = useMasters();
  
  // Watch form fields
  const district = watch("applicantDetails.district");
  const taluka = watch("applicantDetails.taluka");
  const villageCity = watch("applicantDetails.villageCity");
  const sameAsPermanent = watch("applicantDetails.sameAsPermanent");
  const presentAddress = watch("applicantDetails.presentAddress");

  // Register district, taluka, villageCity fields manually since we're using controlled components
  useEffect(() => {
    register('applicantDetails.district', { required: "District is required" });
    register('applicantDetails.taluka', { required: "Taluka is required" });
    register('applicantDetails.villageCity', { required: "Village/City is required" });
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
      setValue("applicantDetails.permanentAddress", presentAddress);
    }
  }, [sameAsPermanent, presentAddress, setValue]);

  // Generate years for dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => currentYear - i);

  return (
    <div>
      <div className="form-grid">
        {/* Left Column */}
        <div className="left-column">
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Loan A/C no. :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("applicantDetails.loanAccountNo")}
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Salutation :</label>
              <select 
                className="form-select"
                {...register("applicantDetails.salutation")}
              >
                <option value="">Select...</option>
                <option value="mr">Mr.</option>
                <option value="mrs">Mrs.</option>
                <option value="ms">Ms.</option>
                <option value="dr">Dr.</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">First Name :</label>
              <input 
                type="text" 
                className={`form-input ${errors.applicantDetails?.firstName ? 'error' : ''}`}
                {...register("applicantDetails.firstName")}
                placeholder="Enter first name"
              />
            </div>
            {errors.applicantDetails?.firstName && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.firstName.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Middle Name :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("applicantDetails.middleName")}
                placeholder="Enter middle name"
              />
            </div>
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Last Name :</label>
              <input 
                type="text" 
                className={`form-input ${errors.applicantDetails?.lastName ? 'error' : ''}`}
                {...register("applicantDetails.lastName")}
                placeholder="Enter last name"
              />
            </div>
            {errors.applicantDetails?.lastName && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.lastName.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Mobile No. :</label>
              <input 
                type="tel" 
                className={`form-input ${errors.applicantDetails?.mobileNo ? 'error' : ''}`}
                {...register("applicantDetails.mobileNo", {
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
            {errors.applicantDetails?.mobileNo && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.mobileNo.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Email :</label>
              <input 
                type="email" 
                className={`form-input ${errors.applicantDetails?.email ? 'error' : ''}`}
                {...register("applicantDetails.email")}
                placeholder="example@email.com"
              />
            </div>
            {errors.applicantDetails?.email && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.email.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Aadhar no. :</label>
              <input 
                type="text" 
                className={`form-input ${errors.applicantDetails?.aadharNo ? 'error' : ''}`}
                {...register("applicantDetails.aadharNo", {
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
            {errors.applicantDetails?.aadharNo && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.aadharNo.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">District :</label>
              <select 
                className={`form-select ${errors.applicantDetails?.district ? 'error' : ''}`}
                value={district || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("applicantDetails.district", value);
                  setValue("applicantDetails.taluka", "");
                  setValue("applicantDetails.villageCity", "");
                  setValue("applicantDetails.pincode", "");
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
            {errors.applicantDetails?.district && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.district.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Taluka :</label>
              <select 
                className={`form-select ${errors.applicantDetails?.taluka ? 'error' : ''}`}
                value={taluka || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("applicantDetails.taluka", value);
                  setValue("applicantDetails.villageCity", "");
                  setValue("applicantDetails.pincode", "");
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
            {errors.applicantDetails?.taluka && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.taluka.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Village / City :</label>
              <select 
                className={`form-select ${errors.applicantDetails?.villageCity ? 'error' : ''}`}
                value={villageCity || ""}
                onChange={(e) => {
                  const value = e.target.value;
                  setValue("applicantDetails.villageCity", value);
                  
                  if (value && villages && villages.length > 0) {
                    const selectedVillage = villages.find(v => v.code === value);
                    if (selectedVillage?.pincode) {
                      setValue("applicantDetails.pincode", selectedVillage.pincode);
                    } else {
                      setValue("applicantDetails.pincode", "");
                    }
                  } else {
                    setValue("applicantDetails.pincode", "");
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
            {errors.applicantDetails?.villageCity && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.villageCity.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Pincode :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("applicantDetails.pincode")}
                readOnly
                style={{ background: '#f8f9fa' }}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Year :</label>
              <select 
                className="form-select year-select"
                {...register("applicantDetails.year")}
              >
                <option value="">Select Year...</option>
                {years.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Present Address :</label>
            <textarea 
              className={`textarea-input ${errors.applicantDetails?.presentAddress ? 'error' : ''}`}
              {...register("applicantDetails.presentAddress")}
              placeholder="Present Address"
            />
            {errors.applicantDetails?.presentAddress && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.presentAddress.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Same as permanent address? :</label>
              <div className="checkbox-group">
                <div className="checkbox-item">
                  <input 
                    type="checkbox"
                    id="same-yes"
                    className="checkbox-input"
                    {...register("applicantDetails.sameAsPermanent")}
                  />
                  <label htmlFor="same-yes" className="checkbox-label">Yes</label>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label required">Permanent Address :</label>
            <textarea 
              className={`textarea-input ${errors.applicantDetails?.permanentAddress ? 'error' : ''}`}
              {...register("applicantDetails.permanentAddress")}
              placeholder="Permanent Address"
              disabled={sameAsPermanent}
              style={{ background: sameAsPermanent ? '#f8f9fa' : 'white' }}
            />
            {errors.applicantDetails?.permanentAddress && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.permanentAddress.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label required">Industry / Unit Name :</label>
              <input 
                type="text" 
                className={`form-input ${errors.applicantDetails?.industryName ? 'error' : ''}`}
                {...register("applicantDetails.industryName")}
                placeholder="Enter industry or unit name"
              />
            </div>
            {errors.applicantDetails?.industryName && (
              <p className="error-message" style={{ display: 'block' }}>
                {errors.applicantDetails.industryName.message}
              </p>
            )}
          </div>

          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Workingsheet :</label>
              <input 
                type="text" 
                className="form-input"
                {...register("applicantDetails.workingsheet")}
                placeholder="Enter workingsheet"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
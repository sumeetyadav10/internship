"use client";

import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { formatCurrency, numberToWords } from "@/lib/utils";

export function LoanDetailsStep() {
  const { register, watch, setValue, getValues } = useFormContext();
  
  // Watch individual fields instead of array to prevent dependency issues
  const workingCapital1 = watch("loanDetails.workingCapital1");
  const katchaStructure1 = watch("loanDetails.katchaStructure1");
  const machinery1 = watch("loanDetails.machinery1");
  const godown1 = watch("loanDetails.godown1");
  const grant1 = watch("loanDetails.grant1");
  const workingCapital2 = watch("loanDetails.workingCapital2");
  const katchaStructure2 = watch("loanDetails.katchaStructure2");
  const machinery2 = watch("loanDetails.machinery2");
  const godown2 = watch("loanDetails.godown2");
  const grant2 = watch("loanDetails.grant2");

  // Calculate total whenever amounts change
  useEffect(() => {
    const amounts = [
      workingCapital1,
      katchaStructure1,
      machinery1,
      godown1,
      grant1,
      workingCapital2,
      katchaStructure2,
      machinery2,
      godown2,
      grant2
    ];

    const total = amounts.reduce((sum, amount) => {
      const value = typeof amount === 'string' ? parseInt(amount || '0', 10) : (amount || 0);
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    
    // Only update if the value actually changed to prevent infinite loops
    const currentTotal = getValues("loanDetails.totalAmount");
    if (currentTotal !== total) {
      setValue("loanDetails.totalAmount", total);
      setValue("loanDetails.totalInWords", total > 0 ? numberToWords(total) : "");
    }
  }, [
    workingCapital1,
    katchaStructure1,
    machinery1,
    godown1,
    grant1,
    workingCapital2,
    katchaStructure2,
    machinery2,
    godown2,
    grant2,
    setValue,
    getValues
  ]);

  const handleAmountChange = (fieldName: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    const numericValue = value ? parseInt(value, 10) : 0;
    setValue(fieldName, numericValue);
  };

  return (
    <div>
      {/* Funds Requesting Section */}
      <div className="section-title">Funds Requesting</div>
      
      <div className="funds-grid">
        {/* Left Funds Column */}
        <div className="funds-column">
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Loan for Working Capital :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.workingCapital1", {
                  onChange: handleAmountChange("loanDetails.workingCapital1")
                })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Loan for Katcha Structure :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.katchaStructure1", {
                  onChange: handleAmountChange("loanDetails.katchaStructure1")
                })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Loan for Machinery :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.machinery1", {
                  onChange: handleAmountChange("loanDetails.machinery1")
                })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Loan for Godown :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.godown1", {
                  onChange: handleAmountChange("loanDetails.godown1")
                })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Grant :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.grant1", {
                  onChange: handleAmountChange("loanDetails.grant1")
                })}
              />
            </div>
          </div>
        </div>
        
        {/* Right Funds Column */}
        <div className="funds-column">
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">short term loan for stocking purpose :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.workingCapital2", {
                  onChange: handleAmountChange("loanDetails.workingCapital2")
                })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Loan for implements :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.katchaStructure2", {
                  onChange: handleAmountChange("loanDetails.katchaStructure2")
                })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Loan for Pucca structure :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.machinery2", {
                  onChange: handleAmountChange("loanDetails.machinery2")
                })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Loan for share capital :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.godown2", {
                  onChange: handleAmountChange("loanDetails.godown2")
                })}
              />
            </div>
          </div>
          
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Grant :</label>
              <input 
                type="number" 
                className="form-input"
                {...register("loanDetails.grant2", {
                  onChange: handleAmountChange("loanDetails.grant2")
                })}
              />
            </div>
          </div>
        </div>
        
        {/* Total Row */}
        <div className="total-row">
          <div className="form-group">
            <div className="form-row">
              <label className="form-label">Total in Words :</label>
              <input 
                type="text" 
                className="form-input" 
                value={watch("loanDetails.totalInWords") ? `${watch("loanDetails.totalInWords")} Rupees Only` : ''}
                style={{ width: '400px' }} 
                readOnly
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
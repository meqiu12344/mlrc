'use client';

import React, { createContext, useContext, useState } from 'react';
import { FormData, CalculatedRequirements } from '../types';

interface FormContextType {
  formData: FormData;
  setFormData: (data: FormData) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  requirements: CalculatedRequirements | null;
  setRequirements: (reqs: CalculatedRequirements | null) => void;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

const defaultFormData: FormData = {
  maxMonthlyPayment: null,
  primaryUseLocation: null,
  tripLength: null,
  annualKilometers: null,
  dailyCommute: null,
  commuteType: null,
  parkingAtWork: null,
  parkingAtHome: null,
  dailyKmDriven: 0,
  accelerationImportance: null,
  parkingSkills: null,
  nightDriving: null,
  householdSize: 1,
  childrenCount: 0,
  childSeats: 0,
  elderlyPassengers: false,
  weeklyGroceries: null,
  sportsEquipment: null,
  petTransport: null,
  strollerType: null,
  longTripsPerYear: 0,
  vacationStyle: null,
  trunkFrequency: null,
  winterConditions: null,
  roadType: null,
  hilliness: null,
  weekendActivities: null,
  trailerNeeded: null,
  dailyCommuteCongestion: null,
  mainConcern: null,
  mechanicalSkills: null,
  plannedOwnership: null,
  technologyPriority: null,
  servicePriority: null,
  ownershipDuration: null
};

export function FormProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [currentStep, setCurrentStep] = useState(1);
  const [requirements, setRequirements] = useState<CalculatedRequirements | null>(null);

  const resetForm = () => {
    setFormData(defaultFormData);
    setCurrentStep(1);
    setRequirements(null);
  };

  return (
    <FormContext.Provider 
      value={{
        formData,
        setFormData,
        currentStep,
        setCurrentStep,
        requirements,
        setRequirements,
        resetForm
      }}
    >
      {children}
    </FormContext.Provider>
  );
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within FormProvider');
  }
  return context;
}

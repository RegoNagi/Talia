import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Step1 } from '../components/steps/Step1';
import { Step2 } from '../components/steps/Step2';
import { Step3 } from '../components/steps/Step3';

const Stepper = ({ currentStep, steps }: { currentStep: number, steps: string[] }) => (
  <div className="flex justify-between items-center mb-8">
    {steps.map((step, index) => (
      <div key={step} className="flex flex-col items-center">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index <= currentStep ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'}`}>
          {index + 1}
        </div>
        <span className="text-xs mt-2 font-medium text-slate-600">{step}</span>
      </div>
    ))}
  </div>
);

const SuccessScreen = () => (
  <div className="text-center py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-2">Profile Updated Successfully</h3>
    <p className="text-slate-500">The student's information has been saved.</p>
  </div>
);

export const EditStudentProfile = ({ onBack }: { onBack: () => void }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isActive, setIsActive] = useState(true);
  
  const steps = [
    "Child Info",
    "Family Info",
    "Other info"
  ];

  const [formData, setFormData] = useState({
    // Step 1
    childFirstName: 'Layla',
    childSecondName: 'Ahmed',
    childThirdName: 'Mohamed',
    childLastName: 'Al-Mansour',
    childFirstNameAr: 'ليلى',
    childSecondNameAr: 'أحمد',
    childThirdNameAr: 'محمد',
    childLastNameAr: 'المنصور',
    childGender: 'Female',
    childReligion: 'Muslim',
    childNationality: 'Egyptian',
    childSecondNationality: 'None',
    nativeLanguage: 'Arabic',
    secondLanguage: 'English',
    englishProficiency: 'Fluent',
    childDob: '2010-05-14',
    childIdNumber: 'ST-2023-001',
    childIdFile: null,
    childPhoto: null,
    academicYear: '2026/2027',
    yearLevel: 'Grade 10',
    // Step 2
    fatherDeceased: false,
    fatherFirstName: 'Ahmed',
    fatherSecondName: 'Mohamed',
    fatherThirdName: 'Ali',
    fatherLastName: 'Al-Mansour',
    fatherNationality: 'Egyptian',
    fatherSecondNationality: 'None',
    fatherIdNumber: '28001010101010',
    fatherIdFile: null,
    fatherAcademicDegree: 'Master',
    fatherMarital: 'Married',
    fatherEmploymentStatus: 'Employed',
    fatherJobTitle: 'Senior Engineer',
    fatherCompanyName: 'Tech Corp',
    fatherEmail: 'ahmed@example.com',
    fatherMobile: '1000000000',
    fatherWhatsapp: '1000000000',
    
    motherDeceased: false,
    motherFirstName: 'Fatima',
    motherSecondName: 'Hassan',
    motherThirdName: 'Ibrahim',
    motherLastName: 'Mahmoud',
    motherNationality: 'Egyptian',
    motherSecondNationality: 'None',
    motherIdNumber: '28501010101010',
    motherIdFile: null,
    motherAcademicDegree: 'Bachelor',
    motherMarital: 'Married',
    motherEmploymentStatus: 'Employed',
    motherJobTitle: 'Teacher',
    motherCompanyName: 'International School',
    motherEmail: 'fatima@example.com',
    motherMobile: '1000000001',
    motherWhatsapp: '1000000001',
    
    legalGuardian: 'Father',
    guardianRelationship: 'Father',
    emergencyContact1: {
      firstName: 'Omar',
      secondName: 'Ahmed',
      thirdName: 'Ali',
      lastName: 'Al-Mansour',
      relativity: 'Uncle',
      mobile: '1000000002'
    },
    emergencyContact2: {
      firstName: 'Nadia',
      secondName: 'Hassan',
      thirdName: 'Ibrahim',
      lastName: 'Mahmoud',
      relativity: 'Aunt',
      mobile: '1000000003'
    },
    homeCity: 'Cairo',
    homeArea: 'Maadi',
    homeStreet: 'Street 9',
    homeBuilding: '10',
    homeApartment: '5',
    homeLandline: '0220000000',
    // Step 3
    hasMedical: 'No',
    medicalDetails: 'None',
    hasMedication: 'No',
    medicationDetails: 'None',
    busService: 'Yes',
    hasSiblings: 'No',
    siblings: [],
    siblingName: 'Omar Al-Mansour',
    siblingYearGroup: 'Year 5',
    appliedBefore: 'No',
    hobbies: 'Reading, Swimming',
    marketing: 'Social Media',
    additionalNotes: 'None'
  });

  const updateForm = (key: string, value: any) => setFormData(prev => ({ ...prev, [key]: value }));

  const nextStep = () => {
    if (currentStep < steps.length - 1) setCurrentStep(prev => prev + 1);
    else setIsSubmitted(true);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors mb-8"
        >
          <ArrowLeft size={20} /> Back to Layla's Profile
        </button>

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Student Profile</h1>
            <p className="mt-2 text-base text-slate-600">Update Layla's personal and academic information.</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2.5 rounded-full shadow-sm border border-slate-200 self-start">
            <span className="text-sm font-medium text-slate-700">Status: {isActive ? 'Active' : 'Inactive'}</span>
            <button 
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {!isSubmitted ? (
            <div className="p-6 md:p-10">
              <Stepper currentStep={currentStep} steps={steps} />
              
              <div className="mt-8">
                {currentStep === 0 && <Step1 formData={formData} updateForm={updateForm} />}
                {currentStep === 1 && <Step2 formData={formData} updateForm={updateForm} />}
                {currentStep === 2 && <Step3 formData={formData} updateForm={updateForm} />}
              </div>

              <div className="mt-10 flex justify-between border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`px-6 py-2 border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  {currentStep === steps.length - 1 ? 'Save Profile Changes' : 'Next Step'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-10">
              <SuccessScreen />
              <div className="mt-8 text-center">
                <button
                  type="button"
                  onClick={onBack}
                  className="px-6 py-2 bg-slate-900 text-white rounded-md text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  Return to Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

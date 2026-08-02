import React, { useState } from 'react';

// --- Dummy Components for Steps ---
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

const Step1 = ({ formData, updateForm }: any) => (
  <div className="space-y-4 animate-fadeIn">
    <h3 className="text-xl font-bold text-slate-900 mb-4">Child Information</h3>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
        <input type="text" className="w-full border border-slate-300 rounded-md p-2" value={formData.childFirstName || ''} onChange={e => updateForm('childFirstName', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
        <input type="text" className="w-full border border-slate-300 rounded-md p-2" value={formData.childLastName || ''} onChange={e => updateForm('childLastName', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">ID Number</label>
        <input type="text" className="w-full border border-slate-300 rounded-md p-2" value={formData.childIdNumber || ''} onChange={e => updateForm('childIdNumber', e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Year Level</label>
        <input type="text" className="w-full border border-slate-300 rounded-md p-2" value={formData.yearLevel || ''} onChange={e => updateForm('yearLevel', e.target.value)} />
      </div>
    </div>
  </div>
);

const Step2 = ({ formData, updateForm }: any) => (
  <div className="space-y-4 animate-fadeIn">
    <h3 className="text-xl font-bold text-slate-900 mb-4">Family Information</h3>
    <p className="text-slate-500">Family details go here...</p>
  </div>
);

const Step3 = ({ formData, updateForm }: any) => (
  <div className="space-y-4 animate-fadeIn">
    <h3 className="text-xl font-bold text-slate-900 mb-4">Other Information</h3>
    <p className="text-slate-500">Medical and transport details go here...</p>
  </div>
);

const Step4 = ({ formData, updateForm }: any) => (
  <div className="space-y-4 animate-fadeIn">
    <h3 className="text-xl font-bold text-slate-900 mb-4">Declaration</h3>
    <label className="flex items-center gap-2">
      <input type="checkbox" checked={formData.agreed} onChange={e => updateForm('agreed', e.target.checked)} className="w-4 h-4" />
      <span className="text-sm text-slate-700">I agree to the terms and conditions</span>
    </label>
  </div>
);

const SuccessScreen = () => (
  <div className="text-center py-12 animate-fadeIn">
    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-2">Profile Updated Successfully</h3>
    <p className="text-slate-500">The student's information has been saved.</p>
  </div>
);

export default function AdmissionForm({ onClose }: { onClose?: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const steps = [
    "Child Info",
    "Family Info",
    "Other info",
    "Declaration"
  ];

  const [formData, setFormData] = useState({
    // Step 1
    childFirstName: 'Layla',
    childLastName: 'Al-Mansour',
    childGender: 'Female',
    childReligion: 'Islam',
    childNationality: 'Egyptian',
    childSecondNationality: '',
    nativeLanguage: 'Arabic',
    secondLanguage: 'English',
    englishProficiency: 'Fluent',
    childDob: '2010-05-14',
    childIdNumber: 'ST-2023-001',
    childIdFile: null,
    academicYear: '2026/2027',
    yearLevel: 'Grade 10',
    // Step 2
    fatherDeceased: false,
    fatherFirstName: 'Ahmed',
    fatherSecondName: '',
    fatherThirdName: '',
    fatherLastName: 'Al-Mansour',
    fatherNationality: 'Egyptian',
    fatherSecondNationality: '',
    fatherIdNumber: '1234567890',
    fatherIdFile: null,
    fatherAcademicDegree: 'Master',
    fatherMarital: 'Married',
    fatherEmploymentStatus: 'Employed',
    fatherJobTitle: 'Engineer',
    fatherCompanyName: 'Tech Corp',
    fatherEmail: 'ahmed@example.com',
    fatherMobile: '+201000000000',
    fatherWhatsapp: '+201000000000',
    
    motherDeceased: false,
    motherFirstName: 'Fatima',
    motherSecondName: '',
    motherThirdName: '',
    motherLastName: 'Hassan',
    motherNationality: 'Egyptian',
    motherSecondNationality: '',
    motherIdNumber: '0987654321',
    motherIdFile: null,
    motherAcademicDegree: 'Bachelor',
    motherMarital: 'Married',
    motherEmploymentStatus: 'Employed',
    motherJobTitle: 'Teacher',
    motherCompanyName: 'School',
    motherEmail: 'fatima@example.com',
    motherMobile: '+201000000001',
    motherWhatsapp: '+201000000001',
    
    legalGuardian: 'Father',
    guardianRelationship: 'Father',
    emergencyContact1: {
      firstName: '',
      secondName: '',
      thirdName: '',
      lastName: '',
      relativity: '',
      mobile: ''
    },
    emergencyContact2: {
      firstName: '',
      secondName: '',
      thirdName: '',
      lastName: '',
      relativity: '',
      mobile: ''
    },
    homeCity: 'Cairo',
    homeArea: 'Maadi',
    homeStreet: 'Street 9',
    homeBuilding: '10',
    homeApartment: '5',
    homeLandline: '0220000000',
    // Step 3
    hasMedical: 'No',
    medicalDetails: '',
    hasMedication: 'No',
    medicationDetails: '',
    busService: 'Yes',
    // Step 4
    appliedBefore: 'No',
    hasSiblings: 'No',
    siblings: [],
    marketing: 'Social Media',
    // Step 5
    agreed: false
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Edit Student Profile</h1>
          <p className="mt-2 text-base text-slate-600">Update Layla's personal and academic information.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {!isSubmitted ? (
            <div className="p-6 md:p-10">
              <Stepper currentStep={currentStep} steps={steps} />
              
              <div className="mt-10 min-h-[300px]">
                {currentStep === 0 && <Step1 formData={formData} updateForm={updateForm} />}
                {currentStep === 1 && <Step2 formData={formData} updateForm={updateForm} />}
                {currentStep === 2 && <Step3 formData={formData} updateForm={updateForm} />}
                {currentStep === 3 && <Step4 formData={formData} updateForm={updateForm} />}
              </div>

              <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className={`px-6 py-2.5 rounded-md font-medium transition-colors ${
                    currentStep === 0 
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Back
                </button>
                
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={currentStep === 3 && !formData.agreed}
                  className={`px-8 py-2.5 rounded-md font-medium text-white transition-all shadow-sm ${
                    currentStep === 3 
                      ? (formData.agreed ? 'bg-green-600 hover:bg-green-700 shadow-green-600/20' : 'bg-green-600/50 cursor-not-allowed')
                      : 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
                  }`}
                >
                  {currentStep === 3 ? 'Save Changes' : 'Next Step'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-8 md:p-12">
              <SuccessScreen />
              <div className="mt-8 text-center">
                <button onClick={onClose} className="px-6 py-2 bg-slate-900 text-white rounded-md font-medium hover:bg-slate-800">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

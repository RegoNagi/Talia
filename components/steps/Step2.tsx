import React from 'react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { CustomSelect } from '../ui/CustomSelect';
import { FileUpload } from '../ui/FileUpload';
import { motion, AnimatePresence } from 'motion/react';
import { NATIONALITIES } from '../../lib/constants';

const DEGREES = ['Bachelor', 'Master', 'PhD'];
const EMPLOYMENT_STATUSES = ['Employed', 'Self-Employed', 'Unemployed', 'Retired'];

export const Step2 = ({ formData, updateForm }: any) => {
  const handleNationalityChange = (parent: 'father' | 'mother', value: string) => {
    updateForm(`${parent}Nationality`, value);
    updateForm(`${parent}IdNumber`, '');
    updateForm(`${parent}IdFile`, null);
  };

  const updateEmergencyContact = (num: 1 | 2, field: string, value: string) => {
    const key = `emergencyContact${num}`;
    updateForm(key, { ...(formData[key] || {}), [field]: value });
  };

  const handleLegalGuardianChange = (value: string) => {
    updateForm('legalGuardian', value);
    if (value !== 'Other') {
      updateForm('guardianRelationship', '');
    }
  };

  const handleEmploymentStatusChange = (parent: 'father' | 'mother', status: string) => {
    updateForm(`${parent}EmploymentStatus`, status);
    if (status === 'Unemployed') {
      updateForm(`${parent}JobTitle`, '');
      updateForm(`${parent}CompanyName`, '');
    }
  };

  const handleDeceasedToggle = (parent: 'father' | 'mother', isDeceased: boolean) => {
    updateForm(`${parent}Deceased`, isDeceased);
    if (isDeceased) {
      updateForm(`${parent}IdNumber`, '');
      updateForm(`${parent}IdFile`, null);
      updateForm(`${parent}Email`, '');
      updateForm(`${parent}Mobile`, '');
      updateForm(`${parent}Whatsapp`, '');
      updateForm(`${parent}Marital`, '');
    }

    const newFatherDeceased = parent === 'father' ? isDeceased : formData.fatherDeceased;
    const newMotherDeceased = parent === 'mother' ? isDeceased : formData.motherDeceased;

    if (newFatherDeceased && newMotherDeceased) {
      updateForm('legalGuardian', 'Other');
    } else if (newFatherDeceased) {
      if (formData.legalGuardian === 'Father') {
        updateForm('legalGuardian', '');
        updateForm('guardianRelationship', '');
      }
    } else if (newMotherDeceased) {
      if (formData.legalGuardian === 'Mother') {
        updateForm('legalGuardian', '');
        updateForm('guardianRelationship', '');
      }
    }
  };

  const renderParentSection = (parent: 'father' | 'mother', title: string) => {
    const isEgyptian = formData[`${parent}Nationality`] === 'Egyptian';
    const hasNationality = !!formData[`${parent}Nationality`];
    const isDeceased = formData[`${parent}Deceased`] || false;

    return (
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6 border-b-2 border-slate-900 pb-2">
          <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
          <label className="flex items-center cursor-pointer space-x-2">
            <div className="relative">
              <input 
                type="checkbox" 
                className="sr-only" 
                checked={isDeceased}
                onChange={(e) => handleDeceasedToggle(parent, e.target.checked)}
              />
              <div className={`block w-10 h-6 rounded-full transition-colors ${isDeceased ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
              <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isDeceased ? 'translate-x-4' : ''}`}></div>
            </div>
            <span className="text-slate-500 text-sm font-normal">Mark if deceased</span>
          </label>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div><Label required>First Name</Label><Input value={formData[`${parent}FirstName`] || ''} onChange={e => updateForm(`${parent}FirstName`, e.target.value)} required placeholder="First" /></div>
          <div><Label required>Second Name</Label><Input value={formData[`${parent}SecondName`] || ''} onChange={e => updateForm(`${parent}SecondName`, e.target.value)} required placeholder="Second" /></div>
          <div><Label required>Third Name</Label><Input value={formData[`${parent}ThirdName`] || ''} onChange={e => updateForm(`${parent}ThirdName`, e.target.value)} required placeholder="Third" /></div>
          <div><Label required>Last Name</Label><Input value={formData[`${parent}LastName`] || ''} onChange={e => updateForm(`${parent}LastName`, e.target.value)} required placeholder="Last" /></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label required>Nationality</Label>
            <CustomSelect 
              options={NATIONALITIES} 
              value={formData[`${parent}Nationality`]} 
              onChange={(v) => handleNationalityChange(parent, v)} 
              placeholder="Select Nationality" 
            />
          </div>
          <div>
            <Label>Second Nationality</Label>
            <CustomSelect 
              options={['None', ...NATIONALITIES]} 
              value={formData[`${parent}SecondNationality`]} 
              onChange={(v) => updateForm(`${parent}SecondNationality`, v)} 
              placeholder="Select Second Nationality" 
            />
          </div>
        </div>

        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${(!isDeceased && hasNationality) ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div>
                <Label required>{isEgyptian ? 'National ID Number' : 'Passport Number'}</Label>
                <Input 
                  value={formData[`${parent}IdNumber`] || ''} 
                  onChange={e => updateForm(`${parent}IdNumber`, e.target.value)} 
                  required 
                  placeholder={isEgyptian ? 'Enter 14-digit National ID' : 'Enter Passport Number'}
                />
              </div>
              <div>
                <Label required>{isEgyptian ? 'Upload National ID Photocopy' : 'Upload Passport Photocopy'}</Label>
                <FileUpload 
                  text={isEgyptian ? 'Drag ID front/back or select files' : 'Drag Passport photo page or select files'}
                  file={formData[`${parent}IdFile`]}
                  onFileSelect={(file) => updateForm(`${parent}IdFile`, file)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label required>Academic Degree</Label>
            <CustomSelect 
              options={DEGREES} 
              value={formData[`${parent}AcademicDegree`]} 
              onChange={(v) => updateForm(`${parent}AcademicDegree`, v)} 
              placeholder="Select Degree" 
            />
          </div>

          <div>
            <Label required>Employment Status</Label>
            <CustomSelect 
              options={EMPLOYMENT_STATUSES} 
              value={formData[`${parent}EmploymentStatus`]} 
              onChange={(v) => handleEmploymentStatusChange(parent, v)} 
              placeholder="Select Status" 
            />
          </div>

          <AnimatePresence mode="wait">
            {formData[`${parent}EmploymentStatus`] !== 'Unemployed' && (
              <motion.div
                key="job-title"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              >
                <Label required>Job Title</Label>
                <Input 
                  value={formData[`${parent}JobTitle`] || ''} 
                  onChange={e => updateForm(`${parent}JobTitle`, e.target.value)} 
                  required 
                  placeholder="Enter Job Title"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {formData[`${parent}EmploymentStatus`] !== 'Unemployed' && (
              <motion.div
                key="company-name"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              >
                <Label required>Company Name</Label>
                <Input 
                  value={formData[`${parent}CompanyName`] || ''} 
                  onChange={e => updateForm(`${parent}CompanyName`, e.target.value)} 
                  required 
                  placeholder="Enter Company Name"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${isDeceased ? 'grid-rows-[0fr] opacity-0' : 'grid-rows-[1fr] opacity-100'}`}>
          <div className="overflow-hidden">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <Label required>Marital Status</Label>
                <CustomSelect 
                  options={['Married', 'Divorced', 'Widowed']} 
                  value={formData[`${parent}Marital`]} 
                  onChange={(v) => updateForm(`${parent}Marital`, v)} 
                  placeholder="Select Status" 
                />
              </div>

              <div>
                <Label required>Email</Label>
                <Input 
                  type="email" 
                  value={formData[`${parent}Email`] || ''} 
                  onChange={e => updateForm(`${parent}Email`, e.target.value)} 
                  required 
                  placeholder="email@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
              <div>
                <Label required>Mobile</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-sm">
                    +
                  </span>
                  <Input 
                    type="tel" 
                    className="rounded-l-none"
                    value={formData[`${parent}Mobile`] || ''} 
                    onChange={e => updateForm(`${parent}Mobile`, e.target.value)} 
                    required 
                    placeholder="Country code + number"
                  />
                </div>
              </div>
              <div>
                <Label required>WhatsApp Number</Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-slate-50 text-slate-500 sm:text-sm">
                    +
                  </span>
                  <Input 
                    type="tel" 
                    className="rounded-l-none"
                    value={formData[`${parent}Whatsapp`] || ''} 
                    onChange={e => updateForm(`${parent}Whatsapp`, e.target.value)} 
                    required 
                    placeholder="Country code + number"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    );
  };

  const isFatherDeceased = formData.fatherDeceased || false;
  const isMotherDeceased = formData.motherDeceased || false;

  let legalGuardianOptions = ['Father', 'Mother', 'Other'];

  if (isFatherDeceased && isMotherDeceased) {
    legalGuardianOptions = ['Other'];
  } else if (isFatherDeceased) {
    legalGuardianOptions = ['Mother', 'Other'];
  } else if (isMotherDeceased) {
    legalGuardianOptions = ['Father', 'Other'];
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {renderParentSection('father', 'Father Information')}
      {renderParentSection('mother', 'Mother Information')}

      <hr className="my-8 border-slate-200" />

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b-2 border-slate-900 pb-2 inline-block">Legal Guardian</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 lg:col-span-1">
            <Label required>Legal Guardian</Label>
            <CustomSelect 
              options={legalGuardianOptions} 
              value={formData.legalGuardian} 
              onChange={handleLegalGuardianChange} 
              placeholder="Select Guardian" 
            />
          </div>
          
          <AnimatePresence mode="wait">
            {formData.legalGuardian === 'Other' && (
              <motion.div
                key="guardian-relationship"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:col-span-2 lg:col-span-1 overflow-hidden"
              >
                <Label required>Specify Guardian Relationship</Label>
                <Input 
                  value={formData.guardianRelationship || ''} 
                  onChange={e => updateForm('guardianRelationship', e.target.value)} 
                  required 
                  placeholder="e.g., Uncle, Aunt, Grandparent"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <hr className="my-8 border-slate-200" />

      <section className="mb-10 bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Home Address</h2>
        
        {/* Row 1: Broad Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <Label required>City / Governorate</Label>
            <CustomSelect 
              options={['Cairo', 'Giza', 'Alexandria', 'Other']} 
              value={formData.homeCity} 
              onChange={(v) => updateForm('homeCity', v)} 
              placeholder="Select City" 
            />
          </div>
          <div>
            <Label required>Area / District</Label>
            <Input 
              value={formData.homeArea || ''} 
              onChange={e => updateForm('homeArea', e.target.value)} 
              required 
              placeholder="Enter Area"
            />
          </div>
        </div>

        {/* Row 2: Specific Location */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <Label required>Street Address</Label>
            <Input 
              value={formData.homeStreet || ''} 
              onChange={e => updateForm('homeStreet', e.target.value)} 
              required 
              placeholder="Enter Street Address"
            />
          </div>
          <div>
            <Label required>Building Number</Label>
            <Input 
              value={formData.homeBuilding || ''} 
              onChange={e => updateForm('homeBuilding', e.target.value)} 
              required 
              placeholder="Enter Building No."
            />
          </div>
        </div>

        {/* Row 3: Granular Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <Label>Apartment / Flat Number</Label>
            <Input 
              value={formData.homeApartment || ''} 
              onChange={e => updateForm('homeApartment', e.target.value)} 
              placeholder="Enter Apt No."
            />
          </div>
          <div>
            <Label>Landline Number</Label>
            <Input 
              type="tel"
              value={formData.homeLandline || ''} 
              onChange={e => updateForm('homeLandline', e.target.value)} 
              placeholder="Enter Landline"
            />
          </div>
        </div>
      </section>

      <section className="mb-10 bg-slate-50 rounded-2xl p-6 border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-6">Emergency Contacts</h2>
        
        <h3 className="text-lg font-bold text-slate-800 mb-4">Contact 1</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div><Label required>First Name</Label><Input value={formData.emergencyContact1?.firstName || ''} onChange={e => updateEmergencyContact(1, 'firstName', e.target.value)} required placeholder="First" /></div>
          <div><Label required>Second Name</Label><Input value={formData.emergencyContact1?.secondName || ''} onChange={e => updateEmergencyContact(1, 'secondName', e.target.value)} required placeholder="Second" /></div>
          <div><Label required>Third Name</Label><Input value={formData.emergencyContact1?.thirdName || ''} onChange={e => updateEmergencyContact(1, 'thirdName', e.target.value)} required placeholder="Third" /></div>
          <div><Label required>Last Name</Label><Input value={formData.emergencyContact1?.lastName || ''} onChange={e => updateEmergencyContact(1, 'lastName', e.target.value)} required placeholder="Last" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div><Label required>Degree of relativity</Label><Input value={formData.emergencyContact1?.relativity || ''} onChange={e => updateEmergencyContact(1, 'relativity', e.target.value)} required /></div>
          <div>
            <Label required>Mobile</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-white text-slate-500 sm:text-sm">
                +
              </span>
              <Input 
                type="tel" 
                className="rounded-l-none"
                value={formData.emergencyContact1?.mobile || ''} 
                onChange={e => updateEmergencyContact(1, 'mobile', e.target.value)} 
                required 
                placeholder="Country code + number"
              />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-800 mb-4 mt-8">Contact 2</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div><Label required>First Name</Label><Input value={formData.emergencyContact2?.firstName || ''} onChange={e => updateEmergencyContact(2, 'firstName', e.target.value)} required placeholder="First" /></div>
          <div><Label required>Second Name</Label><Input value={formData.emergencyContact2?.secondName || ''} onChange={e => updateEmergencyContact(2, 'secondName', e.target.value)} required placeholder="Second" /></div>
          <div><Label required>Third Name</Label><Input value={formData.emergencyContact2?.thirdName || ''} onChange={e => updateEmergencyContact(2, 'thirdName', e.target.value)} required placeholder="Third" /></div>
          <div><Label required>Last Name</Label><Input value={formData.emergencyContact2?.lastName || ''} onChange={e => updateEmergencyContact(2, 'lastName', e.target.value)} required placeholder="Last" /></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><Label required>Degree of relativity</Label><Input value={formData.emergencyContact2?.relativity || ''} onChange={e => updateEmergencyContact(2, 'relativity', e.target.value)} required /></div>
          <div>
            <Label required>Mobile</Label>
            <div className="flex">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-200 bg-white text-slate-500 sm:text-sm">
                +
              </span>
              <Input 
                type="tel" 
                className="rounded-l-none"
                value={formData.emergencyContact2?.mobile || ''} 
                onChange={e => updateEmergencyContact(2, 'mobile', e.target.value)} 
                required 
                placeholder="Country code + number"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

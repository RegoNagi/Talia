import React, { useRef } from 'react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { CustomSelect } from '../ui/CustomSelect';
import { FileUpload } from '../ui/FileUpload';
import { Upload } from 'lucide-react';
import { NATIONALITIES } from '../../lib/constants';

export const Step1 = ({ formData, updateForm }: any) => {
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleNationalityChange = (value: string) => {
    updateForm('childNationality', value);
    updateForm('childIdNumber', '');
    updateForm('childIdFile', null);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      updateForm('childPhoto', e.target.files[0]);
    }
  };

  const isEgyptian = formData.childNationality === 'Egyptian';
  const hasNationality = !!formData.childNationality;

  return (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    {/* 1. HEADER */}
    <div className="mb-8 pt-4">
      <h2 className="text-2xl font-bold text-slate-900">Child Information</h2>
    </div>

    {/* 2. STUDENT NAMES */}
    <div className="space-y-8">
      {/* English Names */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">English Name</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div><Label required>First</Label><Input value={formData.childFirstName} onChange={e => updateForm('childFirstName', e.target.value)} required placeholder="First" /></div>
          <div><Label required>Second</Label><Input value={formData.childSecondName} onChange={e => updateForm('childSecondName', e.target.value)} required placeholder="Second" /></div>
          <div><Label required>Third</Label><Input value={formData.childThirdName} onChange={e => updateForm('childThirdName', e.target.value)} required placeholder="Third" /></div>
          <div><Label required>Last</Label><Input value={formData.childLastName} onChange={e => updateForm('childLastName', e.target.value)} required placeholder="Last" /></div>
        </div>
      </div>
      
      {/* Arabic Names */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Arabic Name</h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" dir="rtl">
          <div><Label required>الاسم الأول</Label><Input value={formData.childFirstNameAr || ''} onChange={e => updateForm('childFirstNameAr', e.target.value)} required placeholder="الأول" dir="rtl" /></div>
          <div><Label required>الاسم الثاني</Label><Input value={formData.childSecondNameAr || ''} onChange={e => updateForm('childSecondNameAr', e.target.value)} required placeholder="الثاني" dir="rtl" /></div>
          <div><Label required>الاسم الثالث</Label><Input value={formData.childThirdNameAr || ''} onChange={e => updateForm('childThirdNameAr', e.target.value)} required placeholder="الثالث" dir="rtl" /></div>
          <div><Label required>الاسم الأخير</Label><Input value={formData.childLastNameAr || ''} onChange={e => updateForm('childLastNameAr', e.target.value)} required placeholder="العائلة" dir="rtl" /></div>
        </div>
      </div>
    </div>

    {/* 3. CHILD'S PHOTO (STANDALONE) */}
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Child&apos;s Photo</h3>
      <input 
        type="file" 
        className="hidden" 
        ref={photoInputRef} 
        onChange={handlePhotoChange}
        accept="image/*"
      />
      <div 
        onClick={() => photoInputRef.current?.click()}
        className={`max-w-2xl mx-auto py-8 min-h-[160px] border border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer transition-colors relative overflow-hidden group ${
          formData.childPhoto ? 'border-green-500 bg-green-50' : 'border-slate-300 bg-slate-50/50 hover:bg-slate-100'
        }`}
      >
        {formData.childPhoto ? (
          <>
            <img 
              src={URL.createObjectURL(formData.childPhoto)} 
              alt="Child" 
              className="absolute inset-0 w-full h-full object-contain"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" className="bg-white text-slate-900 px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-100 transition">
                Change Photo
              </button>
            </div>
          </>
        ) : (
          <>
            <Upload className="w-8 h-8 text-slate-400" />
            <button type="button" className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition">
              Upload Photo
            </button>
            <p className="text-xs text-slate-500">JPEG or PNG, max 5MB</p>
          </>
        )}
      </div>
    </div>

    {/* 4. DEMOGRAPHICS & OFFICIAL DATA */}
    <div className="space-y-8 pt-4">
      <h3 className="text-lg font-semibold text-slate-800 border-b pb-2">Demographics & Official Data</h3>
      
      {/* Group A: Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <Label required>Gender</Label>
          <div className="flex items-center space-x-6 mt-3">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 mr-2">
                <input 
                  type="radio" 
                  name="gender" 
                  value="Male" 
                  checked={formData.childGender === 'Male'}
                  onChange={(e) => updateForm('childGender', e.target.value)}
                  className="peer sr-only" 
                />
                <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-slate-900 transition-colors"></div>
                <div className="absolute w-2.5 h-2.5 bg-slate-900 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Male</span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 mr-2">
                <input 
                  type="radio" 
                  name="gender" 
                  value="Female" 
                  checked={formData.childGender === 'Female'}
                  onChange={(e) => updateForm('childGender', e.target.value)}
                  className="peer sr-only" 
                />
                <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-slate-900 transition-colors"></div>
                <div className="absolute w-2.5 h-2.5 bg-slate-900 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Female</span>
            </label>
          </div>
        </div>
        <div>
          <Label required>Date of Birth</Label>
          <Input 
            type="date" 
            value={formData.childDob || ''} 
            onChange={e => updateForm('childDob', e.target.value)} 
            required 
          />
        </div>
        <div>
          <Label required>Religion</Label>
          <CustomSelect options={['Muslim', 'Christian']} value={formData.childReligion} onChange={(v) => updateForm('childReligion', v)} placeholder="Select Religion" />
        </div>
      </div>

      {/* Row 1: Academic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label required>Academic Year</Label>
          <CustomSelect options={['2026/2027', '2027/2028']} value={formData.academicYear} onChange={(v) => updateForm('academicYear', v)} placeholder="Select Year" />
        </div>
        <div>
          <Label required>Applying for year</Label>
          <CustomSelect options={['FS1', 'FS2', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Grade 10']} value={formData.yearLevel} onChange={(v) => updateForm('yearLevel', v)} placeholder="Select Level" />
        </div>
      </div>

      {/* Row 2: Languages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label required>Mother Tongue</Label>
          <CustomSelect options={['Arabic', 'English']} value={formData.nativeLanguage} onChange={(v) => updateForm('nativeLanguage', v)} placeholder="Select Language" />
        </div>
        <div>
          <Label>Second Language (Studied at School)</Label>
          <CustomSelect options={['English', 'French', 'German', 'None']} value={formData.secondLanguage} onChange={(v) => updateForm('secondLanguage', v)} placeholder="Select Language" />
        </div>
      </div>

      {/* Row 3: Nationality */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <Label required>Nationality</Label>
          <CustomSelect options={NATIONALITIES} value={formData.childNationality} onChange={handleNationalityChange} placeholder="Select Nationality" />
        </div>
        <div>
          <Label>Second Nationality</Label>
          <CustomSelect options={['None', ...NATIONALITIES]} value={formData.childSecondNationality} onChange={(v) => updateForm('childSecondNationality', v)} placeholder="Select Second Nationality" />
        </div>
      </div>

      <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${hasNationality ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-slate-200 mt-6">
            <div>
              <Label required>{isEgyptian ? 'National ID Number' : 'Passport Number'}</Label>
              <Input 
                value={formData.childIdNumber || ''} 
                onChange={e => updateForm('childIdNumber', e.target.value)} 
                required 
                placeholder={isEgyptian ? 'Enter 14-digit National ID' : 'Enter Passport Number'}
              />
            </div>
            
            <div>
              <Label required>{isEgyptian ? 'Upload Computerized Birth Certificate' : 'Upload Passport Photocopy'}</Label>
              <FileUpload 
                text={isEgyptian ? 'Drag & drop birth certificate here or Select Files' : 'Drag & drop passport here or Select Files'}
                file={formData.childIdFile}
                onFileSelect={(file) => updateForm('childIdFile', file)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

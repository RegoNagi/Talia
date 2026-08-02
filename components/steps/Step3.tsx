import React, { useState } from 'react';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { CustomSelect } from '../ui/CustomSelect';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Step3 = ({ formData, updateForm }: any) => {
  const [hasSiblingApplying, setHasSiblingApplying] = useState<string | null>(null);

  const addSibling = () => {
    updateForm('siblings', [...formData.siblings, { name: '', school: '', age: '', year: '' }]);
  };

  const removeSibling = (index: number) => {
    const newSiblings = [...formData.siblings];
    newSiblings.splice(index, 1);
    updateForm('siblings', newSiblings);
  };

  const updateSibling = (index: number, field: string, value: string) => {
    const newSiblings = [...formData.siblings];
    newSiblings[index][field] = value;
    updateForm('siblings', newSiblings);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Other info</h2>
      
      {/* Card A: Medical information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Medical information</h3>
        
        <div>
          <Label required>Does your child have any medical conditions/allergies?</Label>
          <div className="w-full md:w-1/3 mt-2">
            <CustomSelect options={['Yes', 'No']} value={formData.hasMedical} onChange={(v) => updateForm('hasMedical', v)} placeholder="Select" />
          </div>
        </div>
        
        <AnimatePresence>
          {formData.hasMedical === 'Yes' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <Label required>Please provide details</Label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-md focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white min-h-[100px]" 
                  value={formData.medicalDetails}
                  onChange={(e) => updateForm('medicalDetails', e.target.value)}
                  required
                ></textarea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div>
          <Label required>Is your child taking any medication?</Label>
          <div className="w-full md:w-1/3 mt-2">
            <CustomSelect options={['Yes', 'No']} value={formData.hasMedication} onChange={(v) => updateForm('hasMedication', v)} placeholder="Select" />
          </div>
        </div>
        
        <AnimatePresence>
          {formData.hasMedication === 'Yes' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4">
                <Label required>Please provide medication details</Label>
                <textarea 
                  className="w-full p-3 border border-slate-200 rounded-md focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white min-h-[100px]" 
                  value={formData.medicationDetails}
                  onChange={(e) => updateForm('medicationDetails', e.target.value)}
                  required
                ></textarea>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Card A2: Transportation services */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Transportation services</h3>
        <div>
          <Label required>Are you interested in Bus Service?</Label>
          <div className="w-full md:w-1/3 mt-2">
            <CustomSelect options={['Yes', 'No']} value={formData.busService} onChange={(v) => updateForm('busService', v)} placeholder="Select" />
          </div>
        </div>
      </div>

      {/* Card B: Siblings Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Siblings Information</h3>
        <Label required>Do you have siblings/relatives attending at the school?</Label>
        <div className="w-full md:w-1/3 mt-2 mb-6">
          <CustomSelect options={['Yes', 'No']} value={formData.hasSiblings} onChange={(v) => updateForm('hasSiblings', v)} placeholder="Select" />
        </div>

        <AnimatePresence>
          {formData.hasSiblings === 'Yes' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: 'auto' }} 
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 pt-2">
                {formData.siblings.map((sibling: any, index: number) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-md bg-slate-50 relative">
                    <button 
                      type="button" 
                      onClick={() => removeSibling(index)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <h4 className="font-medium text-slate-800 mb-4">Sibling {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div><Label required>Name</Label><Input value={sibling.name} onChange={(e) => updateSibling(index, 'name', e.target.value)} required /></div>
                      <div><Label required>Age</Label><Input type="number" value={sibling.age} onChange={(e) => updateSibling(index, 'age', e.target.value)} required /></div>
                      <div><Label>School/Nursery</Label><Input value={sibling.school} onChange={(e) => updateSibling(index, 'school', e.target.value)} /></div>
                      <div><Label>Year</Label><Input value={sibling.year} onChange={(e) => updateSibling(index, 'year', e.target.value)} /></div>
                    </div>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={addSibling}
                  className="flex items-center text-sm font-medium text-slate-900 hover:text-green-600 transition-colors mt-4"
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Another Sibling
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <Label>Does the applicant have any siblings applying to Parkway Cairo?</Label>
          <div className="flex items-center space-x-6 mt-3">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 mr-2">
                <input 
                  type="radio" 
                  name="hasSiblingApplying" 
                  value="yes" 
                  checked={hasSiblingApplying === 'yes'}
                  onChange={(e) => setHasSiblingApplying(e.target.value)}
                  className="peer sr-only" 
                />
                <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-slate-900 transition-colors"></div>
                <div className="absolute w-2.5 h-2.5 bg-slate-900 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">Yes</span>
            </label>
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 mr-2">
                <input 
                  type="radio" 
                  name="hasSiblingApplying" 
                  value="no" 
                  checked={hasSiblingApplying === 'no'}
                  onChange={(e) => setHasSiblingApplying(e.target.value)}
                  className="peer sr-only" 
                />
                <div className="w-5 h-5 border-2 border-slate-300 rounded-full peer-checked:border-slate-900 transition-colors"></div>
                <div className="absolute w-2.5 h-2.5 bg-slate-900 rounded-full opacity-0 peer-checked:opacity-100 transition-opacity"></div>
              </div>
              <span className="text-slate-700 font-medium group-hover:text-slate-900 transition-colors">No</span>
            </label>
          </div>

          <AnimatePresence mode="wait">
            {hasSiblingApplying === 'yes' && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24, transitionEnd: { overflow: 'visible' } }}
                exit={{ opacity: 0, height: 0, marginTop: 0, overflow: 'hidden' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-2">
                  <div>
                    <Label>Name of Sibling</Label>
                    <Input 
                      placeholder="Enter sibling's full name" 
                      value={formData.siblingName || ''}
                      onChange={(e) => updateForm('siblingName', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Year Group Applying For</Label>
                    <CustomSelect 
                      options={['FS1', 'FS2', 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6', 'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11', 'Year 12', 'Year 13']}
                      value={formData.siblingYearGroup}
                      onChange={(v) => updateForm('siblingYearGroup', v)}
                      placeholder="Select Year Group"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Card C: General Information */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6 space-y-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">General Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Did you apply to the school before?</Label>
            <CustomSelect options={['Yes', 'No']} value={formData.appliedBefore} onChange={(v) => updateForm('appliedBefore', v)} placeholder="Select" />
          </div>
          <div>
            <Label>Tell us if your child has any interests or hobbies</Label>
            <Input 
              placeholder="e.g. Football, Reading, Music" 
              value={formData.hobbies || ''}
              onChange={(e) => updateForm('hobbies', e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>How did you find out about the school?</Label>
            <CustomSelect options={['Social Media', 'Friends/Family', 'Search Engine', 'Advertisement', 'Other']} value={formData.marketing} onChange={(v) => updateForm('marketing', v)} placeholder="Select" />
          </div>
        </div>

        <div>
          <Label>Additional Notes</Label>
          <textarea 
            className="w-full p-3 border border-slate-200 rounded-md focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 bg-white min-h-[100px]" 
            placeholder="Any other information you'd like to share..."
            value={formData.additionalNotes || ''}
            onChange={(e) => updateForm('additionalNotes', e.target.value)}
          ></textarea>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MessageSquare, 
  Mail, 
  Edit, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Globe, 
  CreditCard,
  User,
  CheckCircle2,
  XCircle,
  Search,
  ChevronRight
} from 'lucide-react';

// Mock Data
const MOCK_PARENT = {
  id: 'P-1001',
  name: 'Ahmed Al-Mansour',
  nameAr: 'أحمد المنصور',
  relationship: 'Father / Legal Guardian',
  relationshipAr: 'الأب / ولي الأمر',
  status: 'Active',
  email: 'ahmed.almansour@example.com',
  mobile: '+20 10 123 4567',
  whatsapp: '+20 10 123 4567',
  jobTitle: 'Senior Software Engineer',
  jobTitleAr: 'مهندس برمجيات أول',
  companyName: 'Tech Solutions Inc.',
  companyNameAr: 'تيك سوليوشنز',
  academicDegree: 'Master of Computer Science',
  academicDegreeAr: 'ماجستير في علوم الحاسب',
  nationality: 'Egyptian',
  nationalityAr: 'مصري',
  nationalId: '1029384756',
  address: '123 Olaya St, Riyadh, Egyptian Arabia',
  addressAr: '123 شارع التحرير، الدقي، مصر',
  children: [
    { id: 'ST-2023-001', name: 'Layla', nameAr: 'ليلى', grade: 'Grade 10', avatar: 'https://ui-avatars.com/api/?name=Layla&background=random', status: 'Active' },
    { id: 'ST-2023-002', name: 'Omar', nameAr: 'عمر', grade: 'Grade 5', avatar: 'https://ui-avatars.com/api/?name=Omar&background=random', status: 'Active' }
  ],
  adminNotes: 'Very involved parent. Prefers WhatsApp for quick communication.',
  adminNotesAr: 'ولي أمر مهتم جداً. يفضل التواصل السريع عبر واتساب.'
};

const PARENTS_LIST = [
  MOCK_PARENT,
  {
    id: 'P-1002',
    name: 'Fatima Hassan',
    nameAr: 'فاطمة حسن',
    relationship: 'Mother',
    relationshipAr: 'الأم',
    status: 'Inactive',
    email: 'fatima.h@example.com',
    mobile: '+20 11 987 6543',
    children: [
      { id: 'ST-2023-003', name: 'Yousef', nameAr: 'يوسف', grade: 'Grade 8', avatar: 'https://ui-avatars.com/api/?name=Yousef&background=random' }
    ]
  }
];

export const ParentsManagement = ({ isRTL = false }: { isRTL?: boolean }) => {
  const [view, setView] = useState<'list' | 'details'>('list');
  const [selectedParent, setSelectedParent] = useState<typeof MOCK_PARENT | null>(null);

  const t = {
    searchParents: isRTL ? 'البحث عن أولياء الأمور...' : 'Search parents...',
    name: isRTL ? 'الاسم' : 'Name',
    contact: isRTL ? 'معلومات الاتصال' : 'Contact',
    children: isRTL ? 'الأبناء' : 'Children',
    status: isRTL ? 'الحالة' : 'Status',
    actions: isRTL ? 'الإجراءات' : 'Actions',
    active: isRTL ? 'نشط' : 'Active',
    inactive: isRTL ? 'غير نشط' : 'Inactive',
    back: isRTL ? 'العودة للدليل' : 'Back to Directory',
    message: isRTL ? 'رسالة' : 'Message',
    email: isRTL ? 'البريد الإلكتروني' : 'Email',
    edit: isRTL ? 'تعديل' : 'Edit',
    profAndPersonal: isRTL ? 'المعلومات المهنية والشخصية' : 'Professional & Personal',
    jobTitle: isRTL ? 'المسمى الوظيفي' : 'Job Title',
    companyName: isRTL ? 'اسم الشركة' : 'Company Name',
    academicDegree: isRTL ? 'الدرجة العلمية' : 'Academic Degree',
    nationality: isRTL ? 'الجنسية' : 'Nationality',
    nationalId: isRTL ? 'الرقم الوطني' : 'National ID',
    contactInfo: isRTL ? 'معلومات الاتصال' : 'Contact Information',
    mobile: isRTL ? 'رقم الهاتف المتنقل' : 'Mobile Number',
    whatsapp: isRTL ? 'رقم الواتساب' : 'WhatsApp Number',
    address: isRTL ? 'عنوان المنزل التفصيلي' : 'Detailed Home Address',
    linkedStudents: isRTL ? 'الطلاب المرتبطين' : 'Linked Students',
    adminNotes: isRTL ? 'ملاحظات الإدارة' : 'Admin Notes',
    saveNote: isRTL ? 'حفظ الملاحظة' : 'Save Note',
    addNotesPlaceholder: isRTL ? 'إضافة ملاحظات داخلية حول ولي الأمر هذا...' : 'Add internal notes about this parent...'
  };

  const getTranslatedGrade = (grade: string | undefined) => {
    if (!grade) return '';
    return isRTL ? grade.replace('Grade ', 'الصف ') : grade;
  };

  const handleViewProfile = (parent: any) => {
    setSelectedParent(parent);
    setView('details');
  };

  const handleBack = () => {
    setSelectedParent(null);
    setView('list');
  };

  // --- View 1: Parent Directory (List View) ---
  if (view === 'list') {
    return (
      <div className="space-y-6 animate-fadeIn" dir={isRTL ? "rtl" : "ltr"}>
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
           <div className="relative flex-1 max-w-md">
              <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-4' : 'left-4'}`} size={18} />
              <input 
                type="text" 
                placeholder={t.searchParents}
                className={`w-full border border-slate-200 bg-slate-50 rounded-full py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none ${isRTL ? 'pr-11 pl-5' : 'pl-11 pr-5'}`}
              />
           </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="overflow-x-auto">
           <table className={`w-full text-sm ${isRTL ? 'text-right' : 'text-left'}`}>
             <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
               <tr>
                 <th className="px-8 py-5">{t.name}</th>
                 <th className="px-6 py-5">{t.contact}</th>
                 <th className="px-6 py-5">{t.children}</th>
                 <th className="px-6 py-5">{t.status}</th>
                 <th className="px-6 py-5">{t.actions}</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               {PARENTS_LIST.map((parent) => (
                 <tr key={parent.id} onClick={() => handleViewProfile(parent)} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                   <td className="px-8 py-5">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center font-bold text-sm">
                         {(isRTL ? (parent.nameAr || parent.name) : parent.name).split(' ').map(n => n[0]).join('')}
                       </div>
                       <div>
                         <p className="font-bold text-slate-900">{isRTL ? (parent.nameAr || parent.name) : parent.name}</p>
                         <p className="text-xs text-slate-400 font-mono">{parent.id}</p>
                       </div>
                     </div>
                   </td>
                   <td className="px-6 py-5">
                     <div className="flex flex-col gap-1 text-slate-500">
                       <span className="flex items-center gap-1"><Mail size={12}/> {parent.email}</span>
                       <span className="flex items-center gap-1"><Phone size={12}/> {parent.mobile}</span>
                     </div>
                   </td>
                   <td className="px-6 py-5">
                     <div className="flex flex-wrap gap-2">
                       {parent.children.map(child => (
                         <span key={child.id} className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold border border-slate-200">
                           {isRTL ? (child.nameAr || child.name) : child.name}
                         </span>
                       ))}
                     </div>
                   </td>
                   <td className="px-6 py-5">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                       parent.status === 'Active' 
                         ? 'bg-green-50 text-green-700 border-green-100' 
                         : 'bg-slate-50 text-slate-600 border-slate-100'
                     }`}>
                       {parent.status === 'Active' ? t.active : t.inactive}
                     </span>
                   </td>
                   <td className="px-6 py-5">
                     <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors">
                       <ChevronRight size={18} className={isRTL ? "rotate-180" : ""} />
                     </button>
                   </td>
                 </tr>
               ))}
             </tbody>
           </table>
         </div>
       </div>
     </div>
    );
  }

  // --- View 2: Parent Details Profile ---
  if (view === 'details' && selectedParent) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10" dir={isRTL ? "rtl" : "ltr"}>
        <button 
          onClick={handleBack} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium transition-colors mb-4"
        >
          <ArrowLeft size={20} className={isRTL ? "rotate-180" : ""} /> {t.back}
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-2xl font-bold border-4 border-white shadow-md">
              {(isRTL ? (selectedParent.nameAr || selectedParent.name) : selectedParent.name).split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{isRTL ? (selectedParent.nameAr || selectedParent.name) : selectedParent.name}</h1>
              <div className="flex items-center gap-3 mt-2">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-slate-100 text-slate-700">
                  <User size={14} className={isRTL ? "ml-1.5" : "mr-1.5"} /> {isRTL ? (selectedParent.relationshipAr || selectedParent.relationship) : selectedParent.relationship}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedParent.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                  {selectedParent.status === 'Active' ? <CheckCircle2 size={14} className={isRTL ? "ml-1.5" : "mr-1.5"} /> : <XCircle size={14} className={isRTL ? "ml-1.5" : "mr-1.5"} />}
                  {selectedParent.status === 'Active' ? t.active : t.inactive}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <MessageSquare size={18} /> {t.message}
            </button>
            <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
              <Mail size={18} /> {t.email}
            </button>
            <button className="flex-1 md:flex-none px-4 py-2 bg-violet-600 text-white rounded-xl font-medium hover:bg-violet-700 transition-colors flex items-center justify-center gap-2 shadow-sm shadow-violet-200">
              <Edit size={18} /> {t.edit}
            </button>
          </div>
        </div>

        {/* CSS Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Cards 1 & 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card 1: Professional & Personal */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="text-violet-500" /> {t.profAndPersonal}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{t.jobTitle}</p>
                  <p className="text-slate-900 font-medium">{isRTL ? (selectedParent.jobTitleAr || selectedParent.jobTitle) : selectedParent.jobTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{t.companyName}</p>
                  <p className="text-slate-900 font-medium">{isRTL ? (selectedParent.companyNameAr || selectedParent.companyName) : selectedParent.companyName}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5"><GraduationCap size={16} /> {t.academicDegree}</p>
                  <p className="text-slate-900 font-medium">{isRTL ? (selectedParent.academicDegreeAr || selectedParent.academicDegree) : selectedParent.academicDegree}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5"><Globe size={16} /> {t.nationality}</p>
                  <p className="text-slate-900 font-medium">{isRTL ? (selectedParent.nationalityAr || selectedParent.nationality) : selectedParent.nationality}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5"><CreditCard size={16} /> {t.nationalId}</p>
                  <p className="text-slate-900 font-medium font-mono">{selectedParent.nationalId}</p>
                </div>
              </div>
            </div>

            {/* Card 2: Contact Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Phone className="text-violet-500" /> {t.contactInfo}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{t.mobile}</p>
                  <p className="text-slate-900 font-medium" dir="ltr">{selectedParent.mobile}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 mb-1">{t.whatsapp}</p>
                  <p className="text-slate-900 font-medium" dir="ltr">{selectedParent.whatsapp}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm font-medium text-slate-500 mb-1 flex items-center gap-1.5"><MapPin size={16} /> {t.address}</p>
                  <p className="text-slate-900 font-medium">{isRTL ? (selectedParent.addressAr || selectedParent.address) : selectedParent.address}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column (Cards 3 & 4) */}
          <div className="space-y-6">
            
            {/* Card 3: Linked Students */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <User className="text-violet-500" /> {t.linkedStudents}
              </h2>
              <div className="space-y-4">
                {selectedParent.children?.map(child => (
                  <div key={child.id} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
                    <img src={child.avatar || `https://ui-avatars.com/api/?name=${child.name}&background=random`} alt={child.name} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-sm">{isRTL ? (child.nameAr || child.name) : child.name}</h3>
                      <p className="text-xs text-slate-500">{getTranslatedGrade(child.grade)}</p>
                    </div>
                    <ChevronRight size={18} className={`text-slate-400 ${isRTL ? "rotate-180" : ""}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Card 4: Admin Notes */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-4">{t.adminNotes}</h2>
              <textarea 
                className="w-full h-32 p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none"
                placeholder={t.addNotesPlaceholder}
                defaultValue={isRTL ? ((selectedParent as any).adminNotesAr || selectedParent.adminNotes) : selectedParent.adminNotes}
              ></textarea>
              <div className="mt-3 flex justify-end">
                <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 transition-colors">
                  {t.saveNote}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  }

  return null;
};

const ChevronRightIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>
);


import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  FileText, 
  PieChart, 
  BarChart4, 
  ArrowUpRight, 
  ArrowDownRight, 
  Receipt,
  Download,
  Search,
  Wallet,
  Eye,
  FileCheck2,
  AlertCircle,
  Filter,
  Printer,
  Mail,
  Bell,
  MessageSquare,
  MoreVertical,
  CalendarDays,
  Send,
  Save,
  Trash2,
  Settings2,
  Percent,
  Edit2,
  X
} from 'lucide-react';

interface FinancialManagementProps {
  language: 'en' | 'ar';
}

interface InstallmentPlan {
  id: number;
  name: string;
  nameEn: string;
  enrolled: number;
  totalValue: number;
  isActive: boolean;
}

interface Transaction {
  id: string;
  studentName: string;
  studentNameEn: string;
  studentId: string;
  grade: string;
  gradeAr: string;
  status: 'paid' | 'overdue' | 'partial';
  amount: number; // For overview: "Amount" column
  balanceDue: number; // For student ledgers: "Balance Due"
  date: string;
  method: 'cash' | 'bank' | 'card';
}

interface Operation {
  id: string;
  date: string;
  studentName: string;
  studentNameEn: string;
  studentId: string;
  type: 'invoice' | 'payment';
  amount: number;
  status: 'paid' | 'partial' | 'overdue' | 'pending';
}

const MOCK_OPERATIONS: Operation[] = [
  { id: '#OP-20241', date: '11 May 2026', studentName: 'علي حسن سعيد', studentNameEn: 'Ali Hassan Saeed', studentId: 'STU-8921', type: 'payment', amount: 1500, status: 'paid' },
  { id: '#INV-9081', date: '10 May 2026', studentName: 'سلمى نور', studentNameEn: 'Salma Nour', studentId: 'STU-8924', type: 'invoice', amount: 1000, status: 'overdue' },
  { id: '#OP-20240', date: '09 May 2026', studentName: 'منى عادل', studentNameEn: 'Mona Adel', studentId: 'STU-8922', type: 'payment', amount: 2000, status: 'paid' },
  { id: '#INV-9080', date: '08 May 2026', studentName: 'أحمد محمود', studentNameEn: 'Ahmed Mahmoud', studentId: 'STU-8925', type: 'invoice', amount: 2000, status: 'pending' },
  { id: '#OP-20239', date: '08 May 2026', studentName: 'عائشة كامل', studentNameEn: 'Sara Kamel', studentId: 'STU-8928', type: 'payment', amount: 800, status: 'paid' },
];

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '#RCP-8012', studentName: 'علي حسن سعيد', studentNameEn: 'Ali Hassan Saeed', studentId: 'STU-8921', grade: 'Grade 10', gradeAr: 'الصف العاشر', status: 'partial', amount: 1500, balanceDue: 1500, date: '10 May 2026', method: 'cash' },
  { id: '#RCP-8011', studentName: 'منى عادل', studentNameEn: 'Mona Adel', studentId: 'STU-8922', grade: 'Grade 8', gradeAr: 'الصف الثامن', status: 'paid', amount: 2000, balanceDue: 0, date: '10 May 2026', method: 'bank' },
  { id: '#RCP-8010', studentName: 'طارق عمر', studentNameEn: 'Tariq Omar', studentId: 'STU-8923', grade: 'Grade 12', gradeAr: 'الصف الثاني عشر', status: 'paid', amount: 900, balanceDue: 0, date: '09 May 2026', method: 'card' },
  { id: '#RCP-8009', studentName: 'سلمى نور', studentNameEn: 'Salma Nour', studentId: 'STU-8924', grade: 'Grade 11', gradeAr: 'الصف الحادي عشر', status: 'overdue', amount: 0, balanceDue: 1000, date: '08 May 2026', method: 'cash' },
  { id: '#RCP-8008', studentName: 'أحمد محمود', studentNameEn: 'Ahmed Mahmoud', studentId: 'STU-8925', grade: 'Grade 10', gradeAr: 'الصف العاشر', status: 'overdue', amount: 500, balanceDue: 1000, date: '05 May 2026', method: 'bank' },
  { id: '#RCP-8007', studentName: 'نورة سالم', studentNameEn: 'Noura Salem', studentId: 'STU-8926', grade: 'Grade 8', gradeAr: 'الصف الثامن', status: 'paid', amount: 1200, balanceDue: 0, date: '04 May 2026', method: 'card' },
  { id: '#RCP-8006', studentName: 'يوسف إبراهيم', studentNameEn: 'Youssef Ibrahim', studentId: 'STU-8927', grade: 'Grade 12', gradeAr: 'الصف الثاني عشر', status: 'paid', amount: 1800, balanceDue: 0, date: '02 May 2026', method: 'cash' },
  { id: '#RCP-8005', studentName: 'عائشة كامل', studentNameEn: 'Sara Kamel', studentId: 'STU-8928', grade: 'Grade 11', gradeAr: 'الصف الحادي عشر', status: 'overdue', amount: 800, balanceDue: 700, date: '01 May 2026', method: 'bank' },
  { id: '#RCP-8004', studentName: 'عمر فاروق', studentNameEn: 'Omar Farouk', studentId: 'STU-8929', grade: 'Grade 10', gradeAr: 'الصف العاشر', status: 'paid', amount: 1500, balanceDue: 0, date: '28 Apr 2026', method: 'cash' },
  { id: '#RCP-8003', studentName: 'ليلى خالد', studentNameEn: 'Laila Khaled', studentId: 'STU-8930', grade: 'Grade 8', gradeAr: 'الصف الثامن', status: 'paid', amount: 2000, balanceDue: 0, date: '25 Apr 2026', method: 'card' },
  { id: '#RCP-8002', studentName: 'ماجد صالح', studentNameEn: 'Majed Saleh', studentId: 'STU-8931', grade: 'Grade 12', gradeAr: 'الصف الثاني عشر', status: 'overdue', amount: 1000, balanceDue: 800, date: '20 Apr 2026', method: 'bank' },
  { id: '#RCP-8001', studentName: 'دينا فؤاد', studentNameEn: 'Dina Fouad', studentId: 'STU-8932', grade: 'Grade 11', gradeAr: 'الصف الحادي عشر', status: 'paid', amount: 1500, balanceDue: 0, date: '15 Apr 2026', method: 'cash' },
];

const CustomSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = '', 
  className = '', 
  isRTL = false,
  disabled = false,
  keepOpen = false
}: { 
  value: string; 
  onChange: (v: string) => void; 
  options: { label: string; value: string }[]; 
  placeholder?: string; 
  className?: string; 
  isRTL?: boolean;
  disabled?: boolean;
  keepOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`w-full bg-white border border-slate-100 rounded-xl px-4 py-2.5 outline-none font-bold text-sm text-slate-700 flex justify-between items-center ${disabled ? 'opacity-60 cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:bg-slate-50 focus-within:ring-2 focus-within:ring-violet-500/20 focus-within:border-violet-500 transition-all'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? '' : 'text-slate-400 font-medium'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''} ${isRTL ? 'mr-2' : 'ml-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && !disabled && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <ul className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-none overflow-hidden max-h-60 overflow-y-auto">
            {options.map((opt, i) => (
              <li 
                key={i}
                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer text-sm font-bold transition-colors ${value === opt.value ? 'bg-slate-50 text-slate-900' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'} ${value === opt.value ? (isRTL ? 'border-r-2 border-violet-500' : 'border-l-2 border-violet-500') : ''}`}
                onClick={() => {
                  onChange(opt.value);
                  if (!keepOpen) setIsOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export const FinancialManagement: React.FC<FinancialManagementProps> = ({ language }) => {
  const isRTL = language === 'ar';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [activeModule, setActiveModule] = useState<'overview' | 'invoices' | 'installments' | 'reports' | 'student_ledgers'>('invoices');
  const [activeMainTab, setActiveMainTab] = useState<'dashboard' | 'transactions' | 'student_accounts'>('dashboard');

  const [opSearch, setOpSearch] = useState('');
  const [filterDateOp, setFilterDateOp] = useState('All');
  const [filterStatusOp, setFilterStatusOp] = useState('All');
  const [filterTypeOp, setFilterTypeOp] = useState('All');

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedStudentForDetails, setSelectedStudentForDetails] = useState<Transaction | null>(null);

  const [operations, setOperations] = useState<Operation[]>(MOCK_OPERATIONS);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const [feeItems, setFeeItems] = useState([
    { id: 1, grade: 'Grade 1', gradeAr: 'الصف الأول', name: 'Tuition', nameAr: 'رسوم دراسية', amount: 20000 },
    { id: 2, grade: 'Grade 1', gradeAr: 'الصف الأول', name: 'Bus', nameAr: 'رسوم باص', amount: 5000 },
  ]);

  // --- Fee Settings State ---
  const [feeSettingsGrades, setFeeSettingsGrades] = useState<string[]>(['Grade 1']);
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  
  interface FeeItem {
    id: string;
    name: string;
    nameEn: string;
    amount: number;
  }
  interface InstallmentItem {
    id: string;
    name: string;
    nameEn: string;
    dueDate: string;
    isActive: boolean;
    amount: number;
  }
  interface FeePlan {
    id: string;
    grades: string[];
    name: string;
    nameEn: string;
    isActive: boolean;
    feeItems: FeeItem[];
    installments: InstallmentItem[];
  }

  const [feePlans, setFeePlans] = useState<FeePlan[]>([
    {
      id: "plan_default",
      grades: ["Grade 10", "Grade 11", "Grade 12"],
      name: "خطة 3 أقساط - المرحلة الثانوية",
      nameEn: "High School 3 Installments Plan",
      isActive: true,
      feeItems: [
        { id: "f_1", name: "رسوم دراسية", nameEn: "Tuition Fees", amount: 15000 },
        { id: "f_2", name: "رسوم باص", nameEn: "Bus Fees", amount: 3000 }
      ],
      installments: [
        { id: "i_1", name: "القسط الأول", nameEn: "First Installment", dueDate: "2025-09-01", isActive: true, amount: 8000 },
        { id: "i_2", name: "القسط الثاني", nameEn: "Second Installment", dueDate: "2026-01-01", isActive: true, amount: 5000 },
        { id: "i_3", name: "القسط الثالث", nameEn: "Third Installment", dueDate: "2026-05-01", isActive: true, amount: 5000 }
      ]
    }
  ]);

  const gradePlans = feePlans.filter(p => p.grades.some(g => feeSettingsGrades.includes(g)));
  const currentPlan = activePlanId ? gradePlans.find(p => p.id === activePlanId) || gradePlans[0] : gradePlans[0];

  const updateCurrentPlan = (updates: Partial<FeePlan>) => {
    if (!currentPlan) return;
    setFeePlans(prev => prev.map(p => p.id === currentPlan.id ? { ...p, ...updates } : p));
  };

  const addFeeItemRow = () => {
     if (!currentPlan) return;
     updateCurrentPlan({ feeItems: [...currentPlan.feeItems, { id: `f_${Date.now()}`, name: '', nameEn: '', amount: 0 }] });
  };
  const updateFeeItem = (id: string, field: string, value: string | number) => {
     if (!currentPlan) return;
     updateCurrentPlan({ feeItems: currentPlan.feeItems.map(item => item.id === id ? { ...item, [field]: value } : item) });
  };
  const removeFeeItemRow = (id: string) => {
     if (!currentPlan) return;
     updateCurrentPlan({ feeItems: currentPlan.feeItems.filter(item => item.id !== id) });
  };

  const addInstallmentRow = () => {
     if (!currentPlan) return;
     updateCurrentPlan({ installments: [...currentPlan.installments, { id: `i_${Date.now()}`, name: '', nameEn: '', dueDate: '', isActive: true, amount: 0 }] });
  };
  const updateInstallment = (id: string, field: string, value: string | number | boolean) => {
     if (!currentPlan) return;
     updateCurrentPlan({ installments: currentPlan.installments.map(item => item.id === id ? { ...item, [field]: value } : item) });
  };
  const removeInstallmentRow = (id: string) => {
     if (!currentPlan) return;
     updateCurrentPlan({ installments: currentPlan.installments.filter(item => item.id !== id) });
  };

  const activatePlan = (planId: string) => {
     setFeePlans(prev => {
       const planToActivate = prev.find(x => x.id === planId);
       if (!planToActivate) return prev;
       return prev.map(p => {
         if (p.id === planId) return { ...p, isActive: true };
         const overlaps = p.grades.some(g => planToActivate.grades.includes(g));
         if (overlaps) return { ...p, isActive: false };
         return p;
       });
     });
  };

  const removePlan = (planId: string) => {
     setFeePlans(prev => prev.filter(p => p.id !== planId));
     if (activePlanId === planId) {
        setActivePlanId('');
     }
  };

  const createPlan = (template: number = 0) => {
    const newId = `plan_${Date.now()}`;
    const newPlan: FeePlan = {
      id: newId,
      grades: feeSettingsGrades.length > 0 ? feeSettingsGrades : ['Grade 1'],
      name: `خطة جديدة ${gradePlans.length + 1}`,
      nameEn: `New Plan ${gradePlans.length + 1}`,
      isActive: gradePlans.length === 0,
      feeItems: [
        { id: `f_${Date.now()}_1`, name: 'مصاريف دراسية', nameEn: 'Tuition Fees', amount: 10000 }
      ],
      installments: []
    };

    if (template > 0) {
      const splitAmount = Math.round(10000 / template);
      for (let i = 1; i <= template; i++) {
        newPlan.installments.push({
          id: `i_${Date.now()}_${i}`,
          name: `القسط ${i}`,
          nameEn: `Installment ${i}`,
          dueDate: '',
          isActive: true,
          amount: i === template ? 10000 - (splitAmount * (template - 1)) : splitAmount
        });
      }
    }

    setFeePlans(prev => [...prev, newPlan]);
    setActivePlanId(newId);
  }
  // -------------------------

  const [plans, setPlans] = useState<InstallmentPlan[]>([
    { id: 1, name: 'خطة 3 أقساط', nameEn: '3 Installments Plan', enrolled: 145, totalValue: 435000, isActive: true },
    { id: 2, name: 'خطة 5 أقساط', nameEn: '5 Installments Plan', enrolled: 89, totalValue: 267000, isActive: true },
    { id: 3, name: 'خطة الدفع الشهري', nameEn: 'Monthly Payment Plan', enrolled: 210, totalValue: 630000, isActive: false },
  ]);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<InstallmentPlan | null>(null);
  
  const [modalFormData, setModalFormData] = useState({
    name: '',
    totalValue: 0,
    isActive: true,
  });

  const [paymentForm, setPaymentForm] = useState({ studentId: '', amount: '' });
  const [invoiceForm, setInvoiceForm] = useState({ studentId: '', amount: '', feeItem: '', dueDate: '' });

  // When setting the selected student, prefill the forms if possible
  const handleSetSelectedStudent = (student: Transaction | null) => {
     setSelectedStudentForDetails(student);
     if (student) {
        setPaymentForm(prev => ({ ...prev, studentId: student.studentId }));
        setInvoiceForm(prev => ({ ...prev, studentId: student.studentId }));
     }
  };

  const handlePaymentSubmit = () => {
      if(!paymentForm.studentId || !paymentForm.amount) return;
      const student = transactions.find(t => t.studentId === paymentForm.studentId);
      if(student) {
          const newOp: Operation = {
              id: `#OP-${Math.floor(Math.random() * 10000)}`,
              date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' '),
              studentName: student.studentName,
              studentNameEn: student.studentNameEn,
              studentId: student.studentId,
              type: 'payment',
              amount: Number(paymentForm.amount),
              status: 'paid'
          };
          setOperations([newOp, ...operations]);
          
          const updatedTransactions = transactions.map(t => {
              if(t.studentId === paymentForm.studentId) {
                  const newBalance = Math.max(0, t.balanceDue - Number(paymentForm.amount));
                  const newPaid = t.amount + Number(paymentForm.amount);
                  return { ...t, amount: newPaid, balanceDue: newBalance, status: newBalance === 0 ? 'paid' : 'partial' } as Transaction;
              }
              return t;
          });
          setTransactions(updatedTransactions);
          
          if(selectedStudentForDetails?.studentId === paymentForm.studentId) {
              const updatedStudent = updatedTransactions.find(t => t.studentId === paymentForm.studentId);
              if (updatedStudent) setSelectedStudentForDetails(updatedStudent);
          }
      }
      setIsPaymentModalOpen(false);
      setPaymentForm(prev => ({ ...prev, amount: '' }));
  };

  const activeInvoicePlan = React.useMemo(() => {
    if (!invoiceForm.studentId) return null;
    const student = transactions.find(t => t.studentId === invoiceForm.studentId);
    if (!student) return null;
    return feePlans.find(p => p.grades.includes(student.grade) && p.isActive) || null;
  }, [invoiceForm.studentId, transactions, feePlans]);

  const handleInvoiceInstallmentChange = (v: string) => {
    if (!activeInvoicePlan) {
       setInvoiceForm(prev => ({ ...prev, feeItem: v }));
       return;
    }
    
    if (v === 'all') {
      const totalAmount = activeInvoicePlan.installments.reduce((acc, curr) => acc + curr.amount, 0);
      setInvoiceForm(prev => ({
        ...prev,
        feeItem: v,
        amount: totalAmount > 0 ? totalAmount.toString() : '',
        dueDate: ''
      }));
    } else {
      const inst = activeInvoicePlan.installments.find(i => i.id === v);
      setInvoiceForm(prev => ({
        ...prev,
        feeItem: v,
        amount: inst ? inst.amount.toString() : '',
        dueDate: inst ? inst.dueDate : ''
      }));
    }
  };

  const handleInvoiceSubmit = () => {
      if(!invoiceForm.studentId || !invoiceForm.amount) return;
      const student = transactions.find(t => t.studentId === invoiceForm.studentId);
      if(student) {
          const newOp: Operation = {
              id: `#INV-${Math.floor(Math.random() * 10000)}`,
              date: invoiceForm.dueDate ? new Date(invoiceForm.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' ') : new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, ' '),
              studentName: student.studentName,
              studentNameEn: student.studentNameEn,
              studentId: student.studentId,
              type: 'invoice',
              amount: Number(invoiceForm.amount),
              status: 'pending' // New invoice
          };
          setOperations([newOp, ...operations]);
          
          const updatedTransactions = transactions.map(t => {
              if(t.studentId === invoiceForm.studentId) {
                  const newBalance = t.balanceDue + Number(invoiceForm.amount);
                  return { ...t, balanceDue: newBalance, status: t.amount === 0 ? 'overdue' : 'partial' } as Transaction;
              }
              return t;
          });
          setTransactions(updatedTransactions);
          
          if(selectedStudentForDetails?.studentId === invoiceForm.studentId) {
              const updatedStudent = updatedTransactions.find(t => t.studentId === invoiceForm.studentId);
              if (updatedStudent) setSelectedStudentForDetails(updatedStudent);
          }
      }
      setIsInvoiceModalOpen(false);
      setInvoiceForm(prev => ({ ...prev, amount: '', feeItem: '', dueDate: '' }));
  };

  const openPlanModal = (plan: InstallmentPlan | null) => {
    setEditingPlan(plan);
    if (plan) {
      setModalFormData({ name: isRTL ? plan.name : plan.nameEn, totalValue: plan.totalValue, isActive: plan.isActive });
    } else {
      setModalFormData({ name: '', totalValue: 0, isActive: true });
    }
    setIsPlanModalOpen(true);
  };
  
  const handleSavePlan = () => {
    if (editingPlan) {
      setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, name: modalFormData.name, totalValue: modalFormData.totalValue, isActive: modalFormData.isActive } : p));
    } else {
      setPlans([...plans, { id: Date.now(), name: modalFormData.name, nameEn: modalFormData.name, enrolled: 0, totalValue: modalFormData.totalValue, isActive: modalFormData.isActive }]);
    }
    setIsPlanModalOpen(false);
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchSearch = t.studentName.includes(searchQuery) ||
                          t.studentNameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.studentId.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchGrade = selectedGrade === 'All' || t.grade === selectedGrade || t.gradeAr === selectedGrade;
      const matchStatus = selectedStatus === 'All' || t.status === selectedStatus;
      
      return matchSearch && matchGrade && matchStatus;
    });
  }, [searchQuery, selectedGrade, selectedStatus]);

  const { totalExpected, collected, overdue } = useMemo(() => {
    let exp = 0;
    let coll = 0;
    let ov = 0;
    filteredTransactions.forEach(t => {
      coll += t.amount;
      ov += t.balanceDue;
      exp += (t.amount + t.balanceDue);
    });
    return { totalExpected: exp, collected: coll, overdue: ov };
  }, [filteredTransactions]);

  const collectionRate = totalExpected > 0 ? Math.round((collected / totalExpected) * 100) : 0;

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'cash': return <span className="bg-violet-50 text-violet-700 font-bold px-3 py-1 rounded-full text-xs inline-block">{isRTL ? 'كاش' : 'Cash'}</span>;
      case 'bank': return <span className="bg-slate-100 text-slate-700 font-bold px-3 py-1 rounded-full text-xs inline-block">{isRTL ? 'تحويل بنكي' : 'Bank Transfer'}</span>;
      case 'card': return <span className="bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs inline-block">{isRTL ? 'بطاقة إئتمان' : 'Credit Card'}</span>;
      default: return null;
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'paid') return <span className="bg-emerald-50 text-emerald-600 font-bold px-3 py-1 rounded-full text-xs flex items-center justify-center gap-1 w-fit"><FileCheck2 size={12} /> {isRTL ? 'مدفوعة' : 'Paid'}</span>;
    if (status === 'overdue') return <span className="bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded-full text-xs flex items-center justify-center gap-1 w-fit"><AlertCircle size={12} /> {isRTL ? 'متأخرة' : 'Overdue'}</span>;
    if (status === 'partial') return <span className="bg-amber-50 text-amber-600 font-bold px-3 py-1 rounded-full text-xs flex items-center justify-center gap-1 w-fit"><PieChart size={12} /> {isRTL ? 'جزئي' : 'Partial'}</span>;
    return null;
  };

  const filteredOps = operations.filter(op => {
    const matchSearch = op.studentName.includes(opSearch) || 
      op.studentNameEn.toLowerCase().includes(opSearch.toLowerCase()) ||
      op.id.toLowerCase().includes(opSearch.toLowerCase());
    const matchStatus = filterStatusOp === 'All' || op.status === filterStatusOp;
    const matchType = filterTypeOp === 'All' || op.type === filterTypeOp;
    
    // Date filter logic
    const matchDate = filterDateOp === 'All' || (() => {
      const opDate = new Date(op.date);
      const now = new Date();
      if (filterDateOp === 'Today') {
        return opDate.toDateString() === now.toDateString();
      } else if (filterDateOp === 'ThisWeek') {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        return opDate >= oneWeekAgo && opDate <= now;
      } else if (filterDateOp === 'ThisMonth') {
        return opDate.getMonth() === now.getMonth() && opDate.getFullYear() === now.getFullYear();
      }
      return true;
    })();

    return matchSearch && matchStatus && matchType && matchDate;
  });

  const handleStudentClick = (studentNameEn: string) => {
    const student = transactions.find(t => t.studentNameEn === studentNameEn);
    if(student) {
      handleSetSelectedStudent(student);
      setActiveMainTab('student_accounts');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-10" dir={isRTL ? "rtl" : "ltr"}>
      {/* HEADER & MAIN TABS */}
      <div className="flex flex-col gap-4 w-full mb-2">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{isRTL ? 'المالية والمدفوعات' : 'Financial Management'}</h1>
            <p className="text-slate-500 mt-1 text-sm font-medium">{isRTL ? 'نظرة عامة على الإيرادات والفواتير والتحصيلات' : 'Overview of revenue, invoices, and collections'}</p>
          </div>
        </div>
        
        <div className="flex space-x-1 space-x-reverse bg-slate-100 p-1 w-fit rounded-[14px]">
          {[
            { id: 'dashboard', label: isRTL ? 'لوحة القيادة' : 'Dashboard' },
            { id: 'student_accounts', label: isRTL ? 'حسابات الطلاب' : 'Student Accounts' },
            { id: 'fee_settings', label: isRTL ? 'إعدادات الرسوم' : 'Fee Settings' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveMainTab(tab.id as any)}
              className={`px-5 py-2 rounded-[10px] text-sm font-bold transition-all shadow-none ${activeMainTab === tab.id ? 'bg-white text-slate-900 border border-slate-200/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeMainTab === 'dashboard' && (
        <div className="space-y-6 animate-fadeIn">
        {/* SMART SEARCH & FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[250px] relative">
          <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
            <Search size={18} />
          </div>
          <input 
            type="text" 
            placeholder={isRTL ? 'البحث عن طالب، رقم إيصال، أو فاتورة...' : 'Search student, receipt ID, or invoice...'} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} text-sm outline-none focus:ring-2 focus:ring-violet-500 transition-all font-medium`}
          />
        </div>
        <CustomSelect 
          value="2023-2024"
          onChange={() => {}}
          options={[ { value: '2023-2024', label: isRTL ? 'العام الدراسي: 2023-2024' : 'Academic Year: 2023-2024' } ]}
          isRTL={isRTL}
          className="min-w-[200px]"
        />
        <CustomSelect 
          value={selectedGrade}
          onChange={setSelectedGrade}
          options={[
            { value: 'All', label: isRTL ? 'الصف الدراسي: جميع الصفوف' : 'Grade: All Grades' },
            { value: isRTL ? 'الصف الثامن' : 'Grade 8', label: isRTL ? 'الصف الثامن' : 'Grade 8' },
            { value: isRTL ? 'الصف العاشر' : 'Grade 10', label: isRTL ? 'الصف العاشر' : 'Grade 10' },
            { value: isRTL ? 'الصف الحادي عشر' : 'Grade 11', label: isRTL ? 'الصف الحادي عشر' : 'Grade 11' },
            { value: isRTL ? 'الصف الثاني عشر' : 'Grade 12', label: isRTL ? 'الصف الثاني عشر' : 'Grade 12' },
          ]}
          isRTL={isRTL}
          className="min-w-[200px]"
        />
        <CustomSelect 
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={[
            { value: 'All', label: isRTL ? 'الحالة المالية: الكل' : 'Financial Status: All' },
            { value: 'paid', label: isRTL ? 'مدفوع' : 'Paid' },
            { value: 'partial', label: isRTL ? 'جزئي' : 'Partial' },
            { value: 'overdue', label: isRTL ? 'متأخر' : 'Overdue' },
          ]}
          isRTL={isRTL}
          className="min-w-[200px]"
        />
      </div>

      {/* FINANCIAL KPI WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-violet-300 transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">{isRTL ? 'إجمالي المتوقع' : 'Total Expected'}</p>
            <p className="text-2xl font-extrabold text-slate-800 font-mono">{totalExpected.toLocaleString()} ج.م</p>
            <p className="text-xs text-slate-400 mt-1 font-medium">{isRTL ? 'العام الدراسي الحالي' : 'Current Academic Year'}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-600 flex items-center justify-center group-hover:bg-slate-100 transition-colors">
            <Wallet size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-emerald-300 transition-colors">
          <div className="w-full mr-4 ml-4">
            <p className="text-sm font-bold text-slate-500 mb-1">{isRTL ? 'إجمالي المحصل' : 'Total Collected'}</p>
            <p className="text-2xl font-extrabold text-slate-800 font-mono">{collected.toLocaleString()} ج.م</p>
            <div className="flex items-center gap-2 mt-2 w-full">
              <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                 <div className="bg-emerald-500 rounded-full h-1.5 transition-all duration-500" style={{ width: `${collectionRate}%` }}></div>
              </div>
              <p className="text-xs text-emerald-600 font-bold">{collectionRate}%</p>
            </div>
          </div>
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
            <BarChart4 size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-rose-300 transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1 flex items-center gap-2">
              {isRTL ? 'المتأخرات' : 'Overdue'}
            </p>
            <p className="text-2xl font-extrabold text-slate-800 font-mono">{overdue.toLocaleString()} ج.م</p>
            <p className="text-xs text-rose-500 mt-1 font-medium flex items-center gap-1">
               {overdue > 0 ? <><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> {isRTL ? 'يتطلب المتابعة' : 'Requires follow-up'}</> : (isRTL ? 'لا متأخرات' : 'No overdue')}
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center group-hover:bg-rose-100 transition-colors">
            <AlertCircle size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between group hover:border-violet-300 transition-colors">
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">{isRTL ? 'متحصلات اليوم' : 'Today\'s Collections'}</p>
            <p className="text-2xl font-extrabold text-slate-800 font-mono">5,400 ج.م</p>
            <p className="text-xs text-emerald-500 mt-1 font-bold flex items-center gap-0.5"><ArrowUpRight size={14} /> +2% {isRTL ? 'عن الأمس' : 'vs yesterday'}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-violet-50 text-violet-600 flex items-center justify-center group-hover:bg-violet-100 transition-colors">
            <Plus size={24} />
          </div>
        </div>
      </div>

      {/* NAVIGATION & MODULE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          onClick={() => setActiveModule('invoices')}
          className={`bg-white border outline-none rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer flex items-center gap-5 group h-full
            ${activeModule === 'invoices' ? 'border-violet-600 shadow-lg shadow-violet-100/50 bg-violet-50/30' : 'border-slate-100 hover:border-violet-200 hover:shadow-violet-100/50'}
          `}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all shadow-inner
            ${activeModule === 'invoices' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'}
          `}>
            <Receipt size={32} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeModule === 'invoices' ? 'text-violet-900' : 'text-slate-800'}`}>{isRTL ? 'إدارة الفواتير' : 'Invoice Management'}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{isRTL ? 'مراجعة الفواتير المستحقة والمدفوعة' : 'Review pending and paid invoices'}</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveModule('installments')}
          className={`bg-white border outline-none rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer flex items-center gap-5 group h-full
            ${activeModule === 'installments' ? 'border-violet-600 shadow-lg shadow-violet-100/50 bg-violet-50/30' : 'border-slate-100 hover:border-violet-200 hover:shadow-violet-100/50'}
          `}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all shadow-inner
            ${activeModule === 'installments' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'}
          `}>
            <PieChart size={32} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeModule === 'installments' ? 'text-violet-900' : 'text-slate-800'}`}>{isRTL ? 'خطط الأقساط' : 'Installment Plans'}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{isRTL ? 'جدولة ومتابعة أقساط الطلاب' : 'Schedule and track student installments'}</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveModule('reports')}
          className={`bg-white border outline-none rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer flex items-center gap-5 group h-full
            ${activeModule === 'reports' ? 'border-violet-600 shadow-lg shadow-violet-100/50 bg-violet-50/30' : 'border-slate-100 hover:border-violet-200 hover:shadow-violet-100/50'}
          `}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all shadow-inner
            ${activeModule === 'reports' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'}
          `}>
            <BarChart4 size={32} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeModule === 'reports' ? 'text-violet-900' : 'text-slate-800'}`}>{isRTL ? 'التقارير المالية' : 'Financial Reports'}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{isRTL ? 'إحصائيات الإيرادات والمصروفات' : 'Revenue and expense statistics'}</p>
          </div>
        </div>

        <div 
          onClick={() => setActiveModule('student_ledgers')}
          className={`bg-white border outline-none rounded-3xl p-6 hover:shadow-xl transition-all cursor-pointer flex items-center gap-5 group h-full
            ${activeModule === 'student_ledgers' ? 'border-violet-600 shadow-lg shadow-violet-100/50 bg-violet-50/30' : 'border-slate-100 hover:border-violet-200 hover:shadow-violet-100/50'}
          `}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all shadow-inner
            ${activeModule === 'student_ledgers' ? 'bg-violet-600 text-white' : 'bg-violet-50 text-violet-600'}
          `}>
            <Wallet size={32} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${activeModule === 'student_ledgers' ? 'text-violet-900' : 'text-slate-800'}`}>{isRTL ? 'حسابات الطلاب' : 'Student Ledgers'}</h3>
            <p className="text-sm text-slate-500 font-medium mt-1">{isRTL ? 'متابعة أرصدة الطلاب وحالة السداد' : 'Track student balances and payment status'}</p>
          </div>
        </div>
      </div>

      {/* DYNAMIC CONTENT AREA */}
      {activeModule === 'invoices' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Invoice Status Chart */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 flex flex-col justify-center">
             <h3 className="text-sm font-bold text-slate-800 mb-6">{isRTL ? 'توزيع حالة الفواتير' : 'Invoice Status Distribution'}</h3>
             
             {(() => {
               const paidInvoices = filteredTransactions.filter(t => t.status === 'paid').length;
               const partialInvoices = filteredTransactions.filter(t => t.status === 'partial').length;
               const overdueInvoices = filteredTransactions.filter(t => t.status === 'overdue').length;
               const totalInvoices = paidInvoices + partialInvoices + overdueInvoices || 1;
               
               const paidPercent = Math.round((paidInvoices / totalInvoices) * 100);
               const partialPercent = Math.round((partialInvoices / totalInvoices) * 100);
               const overduePercent = Math.round((overdueInvoices / totalInvoices) * 100);
               
               return (
                 <>
                   <div className="flex w-full h-8 rounded-full overflow-hidden mb-4 border border-slate-100">
                     {paidPercent > 0 && <div className="bg-emerald-500 h-full transition-all duration-1000 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${paidPercent}%` }}>{paidPercent}%</div>}
                     {partialPercent > 0 && <div className="bg-orange-500 h-full transition-all duration-1000 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${partialPercent}%` }}>{partialPercent}%</div>}
                     {overduePercent > 0 && <div className="bg-rose-500 h-full transition-all duration-1000 flex items-center justify-center text-white text-xs font-bold" style={{ width: `${overduePercent}%` }}>{overduePercent}%</div>}
                     {totalInvoices === 1 && paidInvoices === 0 && partialInvoices === 0 && overdueInvoices === 0 && (
                        <div className="bg-slate-100 h-full w-full"></div>
                     )}
                   </div>
                   <div className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-bold text-slate-600">
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>{isRTL ? `مدفوعة: ${paidPercent}%` : `Paid: ${paidPercent}%`}</div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div>{isRTL ? `جزئي: ${partialPercent}%` : `Partial: ${partialPercent}%`}</div>
                     <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div>{isRTL ? `متأخرة: ${overduePercent}%` : `Overdue: ${overduePercent}%`}</div>
                   </div>
                 </>
               );
             })()}
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{isRTL ? 'الفواتير المستحقة والمدفوعة' : 'Due and Paid Invoices'}</h2>
            </div>
          <div className="overflow-x-auto min-h-[300px]">
            {filteredTransactions.length > 0 ? (
              <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-32">{isRTL ? 'رقم الفاتورة' : 'Invoice ID'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'الطالب' : 'Student'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'تاريخ الإصدار' : 'Issue Date'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'المبلغ' : 'Amount'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'الحالة' : 'Status'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-20">{isRTL ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">{tx.id.replace('RCP', 'INV')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${tx.studentNameEn.replace(' ', '+')}&background=9333ea&color=fff&size=128`} alt="student" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-sm text-slate-800">{isRTL ? tx.studentName : tx.studentNameEn}</p>
                            <p className="text-xs text-slate-500 font-medium">{isRTL ? tx.gradeAr : tx.grade} • {tx.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">{tx.date}</td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-medium">
                        {tx.status === 'overdue' ? <span className="text-rose-600 font-bold">{tx.date}</span> : tx.date}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-base font-bold text-slate-800">{(tx.amount + tx.balanceDue).toLocaleString()} ج.م</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-slate-400 hover:text-violet-600 bg-white border border-slate-200 hover:border-violet-200 rounded-lg p-2 shadow-sm transition-all group-hover:bg-violet-50">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Receipt className="text-slate-300 w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{isRTL ? 'لا توجد بيانات مطابقة للبحث' : 'No matching data'}</h3>
                <p className="text-slate-500 font-medium text-sm max-w-[300px]">{isRTL ? 'لا توجد بيانات مطابقة للبحث. جرب تغيير بعض كلمات البحث أو الفلاتر.' : 'No matching data. Try adjusting your search criteria.'}</p>
              </div>
            )}
          </div>
        </div>
        </div>
      )}

      {activeModule === 'installments' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Installments Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: 'mock_1', name: 'القسط الأول', nameEn: 'First Installment', amount: 15000, collected: 15000, dueDate: '2026-06-01' },
              { id: 'mock_2', name: 'القسط الثاني', nameEn: 'Second Installment', amount: 20000, collected: 5000, dueDate: '2026-09-01' },
              { id: 'mock_3', name: 'القسط الثالث', nameEn: 'Third Installment', amount: 15000, collected: 0, dueDate: '2026-12-01' }
            ].map((inst) => {
              const collectedPercent = Math.round((inst.collected / inst.amount) * 100);
              const remainingAmount = inst.amount - inst.collected;
              const isCollectedHigh = collectedPercent >= 50;
              const barColorClass = isCollectedHigh ? 'bg-emerald-500' : 'bg-rose-500';
              const textColorClass = isCollectedHigh ? 'text-emerald-600' : 'text-rose-600';
              const totalPlanAmount = 50000;
              const instPercent = Math.round((inst.amount / totalPlanAmount) * 100);

              return (
                <div key={inst.id} className="bg-white rounded-xl flex flex-col gap-4 border border-slate-100 p-5 shadow-none transition-colors hover:border-slate-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{isRTL ? inst.name : inst.nameEn}</h4>
                      <p className="text-xs font-medium text-slate-500 mt-1">{isRTL ? 'تاريخ الاستحقاق:' : 'Due Date:'} <span className="font-mono">{inst.dueDate}</span></p>
                    </div>
                    <div className={isRTL ? 'text-left' : 'text-right'}>
                      <p className="text-lg font-mono font-extrabold text-slate-800">{inst.amount.toLocaleString()} ج.م</p>
                      <p className="text-xs font-bold text-slate-400 mt-1">{instPercent}% {isRTL ? 'من الإجمالي' : 'of total'}</p>
                    </div>
                  </div>
                  
                  {/* Visual Progress Bar */}
                  <div className="pt-4 border-t border-slate-50 mt-auto">
                    <div className="flex justify-between items-center text-xs font-bold mb-2">
                      <span className={textColorClass}>{isRTL ? 'محصل' : 'Collected'}: {inst.collected.toLocaleString()} ج.م ({collectedPercent}%)</span>
                      <span className="text-slate-500">{isRTL ? 'متبقي' : 'Remaining'}: {remainingAmount.toLocaleString()} ج.م</span>
                    </div>
                    <div className="flex w-full h-2 rounded-full overflow-hidden border border-slate-100 bg-slate-50">
                      <div className={`${barColorClass} h-full transition-all duration-1000`} style={{ width: `${collectedPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Analytical Drill-Down */}
          <div className="mt-12">
            <div className="flex flex-col gap-8">
              {/* Chart A: Stage Performance */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-none flex flex-col">
                <h4 className="text-sm font-bold text-slate-800 mb-6">{isRTL ? 'أداء المراحل الدراسية' : 'Stage Performance'}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 items-center justify-center">
                  {[
                    { stage: 'رياض الأطفال', stageEn: 'Kindergarten', collected: 100000, partial: 20000, remaining: 30000 },
                    { stage: 'المرحلة الابتدائية', stageEn: 'Primary', collected: 300000, partial: 150000, remaining: 150000 },
                    { stage: 'المرحلة الإعدادية', stageEn: 'Middle', collected: 200000, partial: 120000, remaining: 180000 },
                    { stage: 'المرحلة الثانوية', stageEn: 'High', collected: 150000, partial: 130000, remaining: 220000 },
                  ].map((data, idx) => {
                    const total = data.collected + data.partial + data.remaining;
                    const collectedPercent = Math.round((data.collected / total) * 100);
                    const partialPercent = Math.round((data.partial / total) * 100);
                    // conic-gradient needs absolute stops: 0 to col%, col% to (col%+part%), (col%+part%) to 100%
                    const p1 = collectedPercent;
                    const p2 = collectedPercent + partialPercent;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-3">
                        <div className="relative w-24 h-24 rounded-full flex items-center justify-center shadow-none" 
                             style={{ background: `conic-gradient(#10b981 ${p1}%, #fbbf24 ${p1}% ${p2}%, #f43f5e ${p2}% 100%)` }}>
                          <div className="absolute inset-[8px] bg-white rounded-full flex items-center justify-center flex-col shadow-sm">
                            <span className="text-[15px] font-extrabold text-slate-800">{collectedPercent}%</span>
                            <span className="text-[9px] font-bold text-slate-400 -mt-1">{isRTL ? 'محصل' : 'Paid'}</span>
                          </div>
                        </div>
                        <div className="text-center">
                          <p className="text-[12px] font-bold text-slate-700">{isRTL ? data.stage : data.stageEn}</p>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">{total.toLocaleString()} ج.م</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-x-6 gap-y-2 mt-6 pt-5 border-t border-slate-50 text-xs font-bold text-slate-600 justify-center">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>{isRTL ? 'محصل' : 'Collected'}</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-400"></div>{isRTL ? 'جزئي' : 'Partial'}</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div>{isRTL ? 'متبقي' : 'Remaining'}</div>
                </div>
              </div>

              {/* Chart B: Detailed Grade Performance */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-none flex flex-col overflow-hidden">
                <h4 className="text-sm font-bold text-slate-800 mb-6 flex-shrink-0">{isRTL ? 'تفصيل الأداء حسب الصف' : 'Detailed Grade Performance'}</h4>
                <div className="flex overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-slate-200 items-end gap-2 flex-1 min-h-[260px]">
                  {[
                    { grade: 'الأول', gradeEn: 'Gr 1', collected: 45000, partial: 30000, remaining: 15000 },
                    { grade: 'الثاني', gradeEn: 'Gr 2', collected: 50000, partial: 30000, remaining: 20000 },
                    { grade: 'الثالث', gradeEn: 'Gr 3', collected: 40000, partial: 30000, remaining: 30000 },
                    { grade: 'الرابع', gradeEn: 'Gr 4', collected: 50000, partial: 35000, remaining: 25000 },
                    { grade: 'الخامس', gradeEn: 'Gr 5', collected: 30000, partial: 35000, remaining: 35000 },
                    { grade: 'السادس', gradeEn: 'Gr 6', collected: 40000, partial: 35000, remaining: 25000 },
                    { grade: 'السابع', gradeEn: 'Gr 7', collected: 70000, partial: 40000, remaining: 40000 },
                    { grade: 'الثامن', gradeEn: 'Gr 8', collected: 60000, partial: 45000, remaining: 60000 },
                    { grade: 'التاسع', gradeEn: 'Gr 9', collected: 50000, partial: 55000, remaining: 80000 },
                    { grade: 'العاشر', gradeEn: 'Gr 10', collected: 45000, partial: 45000, remaining: 70000 },
                    { grade: 'الحادي عشر', gradeEn: 'Gr 11', collected: 50000, partial: 45000, remaining: 65000 },
                    { grade: 'الثاني عشر', gradeEn: 'Gr 12', collected: 40000, partial: 55000, remaining: 85000 },
                  ].map((data, idx) => {
                    const total = data.collected + data.partial + data.remaining;
                    const collectedPercent = Math.round((data.collected / total) * 100);
                    const partialPercent = Math.round((data.partial / total) * 100);
                    const remainingPercent = 100 - collectedPercent - partialPercent;
                    
                    return (
                      <div key={idx} className="flex flex-col items-center gap-3 min-w-[56px] flex-1">
                        <div className="w-10 h-48 flex flex-col justify-end bg-slate-50 rounded-t-md overflow-hidden relative">
                           {remainingPercent > 0 && (
                             <div className="bg-rose-500 w-full transition-all duration-1000 flex items-center justify-center overflow-hidden" style={{ height: `${remainingPercent}%` }}>
                               {remainingPercent > 10 && <span className="text-[10px] font-bold text-white">{remainingPercent}%</span>}
                             </div>
                           )}
                           {partialPercent > 0 && (
                             <div className="bg-amber-400 w-full transition-all duration-1000 flex items-center justify-center overflow-hidden" style={{ height: `${partialPercent}%` }}>
                               {partialPercent > 10 && <span className="text-[10px] font-bold text-slate-800">{partialPercent}%</span>}
                             </div>
                           )}
                           {collectedPercent > 0 && (
                             <div className="bg-emerald-500 w-full transition-all duration-1000 flex items-center justify-center overflow-hidden" style={{ height: `${collectedPercent}%` }}>
                               {collectedPercent > 10 && <span className="text-[10px] font-bold text-white">{collectedPercent}%</span>}
                             </div>
                           )}
                        </div>
                        <span className="text-[12px] font-bold text-slate-600 text-center whitespace-nowrap">{isRTL ? data.grade : data.gradeEn}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-x-6 gap-y-2 mt-2 pt-4 border-t border-slate-50 text-xs font-bold text-slate-600 justify-center">
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></div>{isRTL ? 'محصل' : 'Collected'}</div>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-amber-400"></div>{isRTL ? 'جزئي' : 'Partial'}</div>
                  <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-sm bg-rose-500"></div>{isRTL ? 'متبقي' : 'Remaining'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModule === 'reports' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
          {/* List of Reports */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">{isRTL ? 'التقارير الجاهزة' : 'Standard Reports'}</h3>
            <div className="space-y-4">
              {[
                { id: 1, title: 'تقرير إغلاق اليومية', titleEn: 'Daily Closing Report', desc: 'ملخص المعاملات الناجحة اليومية', descEn: 'Summary of daily successful transactions.', date: '10 مايو 2026', dateEn: '10 May 2026' },
                { id: 2, title: 'تقرير المتأخرات الشامل', titleEn: 'Comprehensive Overdue Report', desc: 'قائمة بجميع أرصدة الطلاب المتأخرة', descEn: 'List of all students with overdue balances.', date: '01 مايو 2026', dateEn: '01 May 2026' },
                { id: 3, title: 'كشف حساب ضرائب', titleEn: 'Tax Statement', desc: 'كشوفات ضريبة القيمة المضافة الربع سنوية', descEn: 'Quarterly VAT and tax statements.', date: '30 أبريل 2026', dateEn: '30 Apr 2026' },
              ].map(report => (
                <div key={report.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-colors group">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-xl flex flex-shrink-0 items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-violet-600 group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-200">
                      <FileText size={20} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800">{isRTL ? report.title : report.titleEn}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{isRTL ? report.desc : report.descEn}</p>
                      <p className="text-xs text-slate-400 mt-2 font-mono">{isRTL ? report.date : report.dateEn}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-violet-600 bg-white border border-slate-200 hover:border-violet-200 rounded-lg p-2.5 shadow-sm transition-all flex-shrink-0">
                    <Download size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          {/* Simple Chart Mockup */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col items-center justify-center">
            <div className="w-full flex justify-between items-center mb-10 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">{isRTL ? 'صافي الإيرادات (شهرياً)' : 'Net Revenue (Monthly)'}</h3>
              <CustomSelect
                value="2026"
                onChange={() => {}}
                options={[
                  { value: '2026', label: '2026' },
                  { value: '2025', label: '2025' }
                ]}
                className="w-24"
              />
            </div>
            
            <div className="w-full h-48 flex items-end justify-between gap-4 mt-6 border-b border-slate-100 pb-2">
               {/* Mock bars */}
               {[
                 { monthAr: 'يناير', monthEn: 'Jan', height: 'h-[40%]', color: 'bg-violet-300', value: '12,500' },
                 { monthAr: 'فبراير', monthEn: 'Feb', height: 'h-[60%]', color: 'bg-violet-400', value: '18,200' },
                 { monthAr: 'مارس', monthEn: 'Mar', height: 'h-[50%]', color: 'bg-violet-400', value: '15,000' },
                 { monthAr: 'أبريل', monthEn: 'Apr', height: 'h-[90%]', color: 'bg-violet-600', value: '28,400' },
                 { monthAr: 'مايو', monthEn: 'May', height: 'h-[75%]', color: 'bg-violet-500', value: '22,100' },
                 { monthAr: 'يونيو', monthEn: 'Jun', height: 'h-[30%]', color: 'bg-slate-300', value: '8,900' },
               ].map((bar, i) => (
                  <div key={i} className="flex-1 flex flex-col justify-end items-center gap-2 relative group h-full">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-10 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg whitespace-nowrap pointer-events-none z-10 font-mono shadow-md">
                      {bar.value} ج.م
                    </div>
                    {/* Bar */}
                    <div className={`w-full rounded-t-lg transition-all hover:opacity-80 cursor-pointer relative ${bar.height} ${bar.color}`}></div>
                  </div>
               ))}
            </div>
            <div className="w-full flex justify-between px-2 mt-3 text-xs font-bold text-slate-400">
              {[
                 { monthAr: 'يناير', monthEn: 'Jan' },
                 { monthAr: 'فبراير', monthEn: 'Feb' },
                 { monthAr: 'مارس', monthEn: 'Mar' },
                 { monthAr: 'أبريل', monthEn: 'Apr' },
                 { monthAr: 'مايو', monthEn: 'May' },
                 { monthAr: 'يونيو', monthEn: 'Jun' },
              ].map((m, i) => (
                <span key={i} className="flex-1 text-center truncate">{isRTL ? m.monthAr : m.monthEn}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeModule === 'student_ledgers' && (
        <div className="flex flex-col gap-6 animate-fadeIn">

          <div className="bg-white rounded-3xl border border-slate-200 shadow-none overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800">{isRTL ? 'أرصدة الطلاب' : 'Student Ledgers'}</h2>
            </div>
            <div className="overflow-x-auto min-h-[300px]">
            {filteredTransactions.length > 0 ? (
              <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'اسم الطالب' : 'Student Name'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'الصف' : 'Grade'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'إجمالي الفواتير' : 'Total Billed'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'إجمالي المدفوع' : 'Total Paid'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-rose-500 uppercase tracking-widest">{isRTL ? 'الرصيد المستحق' : 'Balance Due'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'حالة السداد' : 'Payment Status'}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-32">{isRTL ? 'إجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTransactions.map((tx) => (
                    <tr key={`ledger-${tx.id}`} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={`https://ui-avatars.com/api/?name=${tx.studentNameEn.replace(' ', '+')}&background=9333ea&color=fff&size=128`} alt="student" className="w-8 h-8 rounded-full object-cover" />
                          <div>
                            <p className="font-bold text-sm text-slate-800">{isRTL ? tx.studentName : tx.studentNameEn}</p>
                            <p className="text-xs text-slate-500 font-medium">{tx.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 font-bold">{isRTL ? tx.gradeAr : tx.grade}</td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-base font-bold text-slate-800">{(tx.amount + tx.balanceDue).toLocaleString()} ج.م</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-base font-bold text-emerald-600">{tx.amount.toLocaleString()} ج.م</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-mono text-base font-bold ${tx.balanceDue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                          {tx.balanceDue.toLocaleString()} ج.م
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(tx.status)}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-violet-600 bg-violet-50 hover:bg-violet-600 hover:text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap">
                          <Eye size={14} /> {isRTL ? 'كشف الحساب' : 'View Ledger'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="text-slate-300 w-10 h-10" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{isRTL ? 'لا توجد بيانات مطابقة للبحث' : 'No matching data'}</h3>
                <p className="text-slate-500 font-medium text-sm max-w-[300px]">{isRTL ? 'لا توجد بيانات مطابقة للبحث. جرب تغيير بعض كلمات البحث أو الفلاتر.' : 'No matching data. Try adjusting your search criteria.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      </div>
      )}



      {activeMainTab === 'student_accounts' && (
        <div className="space-y-6 animate-fadeIn">
          {selectedStudentForDetails ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-none overflow-hidden p-6 animate-fadeIn">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <button 
                    onClick={() => handleSetSelectedStudent(null)}
                    className="text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-2 mb-4 transition-colors"
                  >
                    &larr; {isRTL ? 'العودة للقائمة' : 'Back to list'}
                  </button>
                  <h2 className="text-2xl font-extrabold text-slate-900">{isRTL ? selectedStudentForDetails.studentName : selectedStudentForDetails.studentNameEn}</h2>
                  <p className="text-slate-500 font-medium">#{selectedStudentForDetails.studentId} • {isRTL ? selectedStudentForDetails.gradeAr : selectedStudentForDetails.grade}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setIsMessageModalOpen(true)}
                    className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-none"
                  >
                    <MessageSquare size={16} /> {isRTL ? 'إرسال رسالة لولي الأمر' : 'Message Parent'}
                  </button>

                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-4">
                 <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <p className="text-sm font-bold text-slate-500 mb-1">{isRTL ? 'إجمالي الفواتير' : 'Total Billed'}</p>
                    <p className="text-2xl font-extrabold text-slate-800 font-mono">{(selectedStudentForDetails.amount + selectedStudentForDetails.balanceDue).toLocaleString()} ج.م</p>
                 </div>
                 <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-100">
                    <p className="text-sm font-bold text-emerald-600 mb-1">{isRTL ? 'إجمالي المدفوع' : 'Total Paid'}</p>
                    <p className="text-2xl font-extrabold text-emerald-700 font-mono">{selectedStudentForDetails.amount.toLocaleString()} ج.م</p>
                 </div>
                 <div className="bg-rose-50/50 rounded-xl p-5 border border-rose-100">
                    <p className="text-sm font-bold text-rose-600 mb-1">{isRTL ? 'الرصيد المستحق' : 'Balance Due'}</p>
                    <p className="text-2xl font-extrabold text-rose-700 font-mono">{selectedStudentForDetails.balanceDue.toLocaleString()} ج.م</p>
                 </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-4">{isRTL ? 'الأقساط والدفعات المستحقة' : 'Installments & Due Payments'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                 {(() => {
                    const student = selectedStudentForDetails;
                    const total = student.amount + student.balanceDue;
                    const i1 = Math.round(total * 0.4);
                    const i2 = Math.round(total * 0.3);
                    const i3 = total - i1 - i2;
                    let remainingPaid = student.amount;

                    const createInst = (id: string, name: string, nameAr: string, val: number, dueDate: string, type: 'past'|'current'|'future') => {
                       let status: 'paid' | 'overdue' | 'due_now' | 'upcoming';
                       if (remainingPaid >= val) {
                         status = 'paid';
                         remainingPaid -= val;
                       } else if (remainingPaid > 0) {
                         status = type === 'past' ? 'overdue' : 'due_now';
                         remainingPaid = 0;
                       } else {
                         status = type === 'past' ? 'overdue' : type === 'current' ? 'due_now' : 'upcoming';
                       }
                       if(student.status === 'paid') status = 'paid';
                       return { id, name, nameAr, amount: val, dueDate, status, daysOverdue: (type === 'past' && status === 'overdue') ? 25 : 0 };
                    };
                    
                    const installments = [
                      createInst('INST-1', 'First Installment', 'القسط الأول', i1, '01 Sep 2025', 'past'),
                      createInst('INST-2', 'Second Installment', 'القسط الثاني', i2, '01 Jan 2026', 'past'),
                      createInst('INST-3', 'Third Installment', 'القسط الثالث', i3, '01 May 2026', 'current'),
                    ];

                    return installments.map((inst, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${inst.status === 'paid' ? 'border-emerald-100 bg-emerald-50/30' : inst.status === 'overdue' ? 'border-rose-200 bg-rose-50/50' : inst.status === 'due_now' ? 'border-blue-200 bg-blue-50/50' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="flex justify-between items-start mb-2">
                           <h4 className={`font-bold ${inst.status === 'paid' ? 'text-emerald-800' : inst.status === 'overdue' ? 'text-rose-800' : inst.status === 'due_now' ? 'text-blue-800' : 'text-slate-700'}`}>
                             {isRTL ? inst.nameAr : inst.name}
                           </h4>
                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${inst.status === 'paid' ? 'bg-emerald-100 text-emerald-700' : inst.status === 'overdue' ? 'bg-rose-100 text-rose-700' : inst.status === 'due_now' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'}`}>
                             {inst.status === 'paid' && (isRTL ? 'مدفوع' : 'Paid')}
                             {inst.status === 'overdue' && (isRTL ? `متأخر (${inst.daysOverdue} يوم)` : `Overdue (${inst.daysOverdue} days)`)}
                             {inst.status === 'due_now' && (isRTL ? 'مستحق الآن' : 'Due Now')}
                             {inst.status === 'upcoming' && (isRTL ? 'قادم' : 'Upcoming')}
                           </span>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                           <div>
                             <p className="text-xs text-slate-500 mb-0.5">{isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}</p>
                             <p className="font-mono text-sm font-bold text-slate-700 flex items-center gap-1"><CalendarDays size={14} /> {inst.dueDate}</p>
                           </div>
                           <p className={`font-mono text-lg font-extrabold ${inst.status === 'paid' ? 'text-emerald-700' : inst.status === 'overdue' ? 'text-rose-700' : inst.status === 'due_now' ? 'text-blue-700' : 'text-slate-700'}`}>
                             {inst.amount.toLocaleString()} ج.م
                           </p>
                        </div>
                      </div>
                    ));
                 })()}
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-4">{isRTL ? 'سجل العمليات السابقة' : 'Previous Transactions'}</h3>
              <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
                 <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'رقم العملية' : 'Op ID'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'التاريخ' : 'Date'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'النوع' : 'Type'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'المبلغ' : 'Amount'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'الحالة' : 'Status'}</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-20">{isRTL ? 'إجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {operations.filter(op => op.studentId === selectedStudentForDetails.studentId).length > 0 ? (
                        operations.filter(op => op.studentId === selectedStudentForDetails.studentId).map(op => (
                          <tr key={op.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-4 text-sm text-slate-600 font-mono font-medium">{op.id}</td>
                            <td className="px-6 py-4 text-sm text-slate-600 font-medium">{op.date}</td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-bold text-slate-700">
                                {op.type === 'invoice' ? (isRTL ? 'فاتورة' : 'Invoice') : (isRTL ? 'دفعة' : 'Payment')}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-mono text-sm font-bold ${op.type === 'invoice' ? 'text-slate-800' : 'text-emerald-600'}`}>
                                {op.type === 'payment' ? '+' : ''}{op.amount.toLocaleString()} ج.م
                              </span>
                            </td>
                            <td className="px-6 py-4">{getStatusBadge(op.status)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button title={isRTL ? 'عرض/طباعة' : 'View/Print'} className="text-slate-400 hover:text-slate-700 bg-white border border-slate-200 hover:border-slate-300 rounded-lg p-2 transition-all">
                                  <Printer size={16} />
                                </button>
                                {op.type === 'invoice' && (
                                  <>
                                    <button title={isRTL ? 'إرسال بريد إلكتروني' : 'Send Email'} className="text-slate-400 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-200 rounded-lg p-2 transition-all">
                                      <Mail size={16} />
                                    </button>
                                    {op.status === 'overdue' && (
                                      <button title={isRTL ? 'إرسال تذكير' : 'Send Reminder'} className="text-rose-400 hover:text-white bg-white hover:bg-rose-500 border border-slate-200 hover:border-rose-500 rounded-lg p-2 transition-all">
                                        <Bell size={16} />
                                      </button>
                                    )}
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-sm font-medium text-slate-500">
                             {isRTL ? 'لا يوجد سجل عمليات.' : 'No transaction history.'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                 </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">


            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800 shrink-0">{isRTL ? 'حسابات الطلاب' : 'Student Ledgers'}</h2>
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                  <div className="relative flex-1 md:w-[240px]">
                    <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none text-slate-400`}>
                      <Search size={18} />
                    </div>
                    <input 
                      type="text" 
                      placeholder={isRTL ? 'بحث عن طالب...' : 'Search student...'} 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} text-sm outline-none focus:border-violet-500 focus:bg-white transition-colors font-medium text-slate-700`}
                    />
                  </div>
                  <CustomSelect 
                    value={selectedGrade}
                    onChange={setSelectedGrade}
                    options={[
                      { value: 'All', label: isRTL ? 'جميع الصفوف' : 'All Grades' },
                      { value: isRTL ? 'الصف الثامن' : 'Grade 8', label: isRTL ? 'الصف الثامن' : 'Grade 8' },
                      { value: isRTL ? 'الصف العاشر' : 'Grade 10', label: isRTL ? 'الصف العاشر' : 'Grade 10' },
                      { value: isRTL ? 'الصف الحادي عشر' : 'Grade 11', label: isRTL ? 'الصف الحادي عشر' : 'Grade 11' },
                      { value: isRTL ? 'الصف الثاني عشر' : 'Grade 12', label: isRTL ? 'الصف الثاني عشر' : 'Grade 12' },
                    ]}
                    isRTL={isRTL}
                    className="flex-1 md:flex-none min-w-[160px]"
                  />
                  <CustomSelect 
                    value={selectedStatus}
                    onChange={setSelectedStatus}
                    options={[
                      { value: 'All', label: isRTL ? 'حالة السداد: الكل' : 'Payment Status: All' },
                      { value: 'paid', label: isRTL ? 'خالص' : 'Cleared' },
                      { value: 'partial', label: isRTL ? 'جزئي' : 'Partial' },
                      { value: 'overdue', label: isRTL ? 'عليه متأخرات' : 'Overdue' },
                    ]}
                    isRTL={isRTL}
                    className="flex-1 md:flex-none min-w-[160px]"
                  />
                </div>
              </div>
            <div className="overflow-x-auto min-h-[300px]">
              {filteredTransactions.length > 0 ? (
                <table className={`w-full ${isRTL ? 'text-right' : 'text-left'} border-collapse`}>
                  <thead>
                    <tr className="bg-[#f8fafc] border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'اسم الطالب' : 'Student Name'}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'الصف' : 'Grade'}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'إجمالي الفواتير' : 'Total Billed'}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'إجمالي المدفوع' : 'Total Paid'}</th>
                      <th className="px-6 py-4 text-xs font-bold text-rose-500 uppercase tracking-widest">{isRTL ? 'الرصيد المستحق' : 'Balance Due'}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">{isRTL ? 'حالة السداد' : 'Payment Status'}</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest w-32">{isRTL ? 'إجراء' : 'Action'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredTransactions.map((tx) => (
                      <tr key={`ledger-${tx.id}`} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={`https://ui-avatars.com/api/?name=${tx.studentNameEn.replace(' ', '+')}&background=9333ea&color=fff&size=128`} alt="student" className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-sm text-slate-800">{isRTL ? tx.studentName : tx.studentNameEn}</p>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">{tx.studentId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 font-bold">{isRTL ? tx.gradeAr : tx.grade}</td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-bold text-slate-800">{(tx.amount + tx.balanceDue).toLocaleString()} ج.م</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-bold text-emerald-600">{tx.amount.toLocaleString()} ج.م</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-mono text-sm font-bold ${tx.balanceDue > 0 ? 'text-rose-600' : 'text-slate-400'}`}>
                            {tx.balanceDue.toLocaleString()} ج.م
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(tx.status)}
                        </td>
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => handleSetSelectedStudent(tx)}
                            className="text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-none flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <Eye size={14} /> {isRTL ? 'عرض التفاصيل' : 'View Details'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-slate-500 font-bold text-sm">{isRTL ? 'لا توجد بيانات مطابقة للبحث' : 'No matching data'}</p>
                </div>
              )}
            </div>
            </div>
          </div>
          )}
        </div>
      )}

      {activeMainTab === 'fee_settings' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-none">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">{isRTL ? 'إعدادات الرسوم' : 'Fee Settings'}</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">{isRTL ? 'تهيئة بنود الرسوم والأقساط الدراسية' : 'Configure fee items and installments'}</p>
            </div>
            <button className="bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-none flex items-center justify-center gap-2 text-sm">
              <Save size={18} />
              {isRTL ? 'حفظ الإعدادات' : 'Save Settings'}
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-none">
            {/* Grade Selection */}
            <div className="mb-8 p-6 bg-slate-50 border border-slate-100 rounded-2xl">
               <h3 className="font-bold text-sm text-slate-700 mb-4">{isRTL ? 'تحديد الصفوف الدراسية المستهدفة' : 'Select Target Grade Levels'}</h3>
               <div className="flex flex-col md:flex-row gap-4 items-start">
                 <div className="w-full md:w-1/3">
                   <CustomSelect 
                      value=""
                      onChange={v => {
                        if (v && !feeSettingsGrades.includes(v)) {
                          setFeeSettingsGrades(prev => [...prev, v]);
                        }
                      }}
                      options={[
                        { value: '', label: isRTL ? 'إضافة صف...' : 'Add Grade...' },
                        { value: 'Grade 1', label: isRTL ? 'الصف الأول' : 'Grade 1' },
                        { value: 'Grade 2', label: isRTL ? 'الصف الثاني' : 'Grade 2' },
                        { value: 'Grade 3', label: isRTL ? 'الصف الثالث' : 'Grade 3' },
                        { value: 'Grade 4', label: isRTL ? 'الصف الرابع' : 'Grade 4' },
                        { value: 'Grade 5', label: isRTL ? 'الصف الخامس' : 'Grade 5' },
                        { value: 'Grade 6', label: isRTL ? 'الصف السادس' : 'Grade 6' },
                        { value: 'Grade 7', label: isRTL ? 'الصف السابع' : 'Grade 7' },
                        { value: 'Grade 8', label: isRTL ? 'الصف الثامن' : 'Grade 8' },
                        { value: 'Grade 9', label: isRTL ? 'الصف التاسع' : 'Grade 9' },
                        { value: 'Grade 10', label: isRTL ? 'الصف العاشر' : 'Grade 10' },
                        { value: 'Grade 11', label: isRTL ? 'الصف الحادي عشر' : 'Grade 11' },
                        { value: 'Grade 12', label: isRTL ? 'الصف الثاني عشر' : 'Grade 12' }
                      ]}
                      placeholder={isRTL ? 'إضافة صف...' : 'Add Grade...'}
                      isRTL={isRTL}
                      keepOpen={true}
                   />
                 </div>
                 <div className="flex-1 flex flex-wrap gap-2">
                   {feeSettingsGrades.map(g => {
                      const gAr = g.replace('Grade', 'الصف').replace('10','العاشر').replace('11','الحادي عشر').replace('12','الثاني عشر').replace('1','الأول').replace('2','الثاني').replace('3','الثالث').replace('4','الرابع').replace('5','الخامس').replace('6','السادس').replace('7','السابع').replace('8','الثامن').replace('9','التاسع');
                      return (
                         <div key={g} className="bg-white text-violet-700 px-3 py-2 rounded-xl flex items-center gap-2 text-sm font-bold border border-violet-100 shadow-sm animate-fade-in-up">
                           {isRTL ? gAr : g}
                           <button 
                             onClick={() => setFeeSettingsGrades(prev => prev.filter(x => x !== g))} 
                             className="text-slate-400 hover:text-red-500 bg-slate-50 hover:bg-red-50 p-1 rounded-md transition-colors"
                           >
                             <X size={14} />
                           </button>
                         </div>
                      );
                   })}
                   {feeSettingsGrades.length === 0 && (
                     <p className="text-sm text-slate-400 font-medium py-2">{isRTL ? 'لم يتم تحديد أي صفوف' : 'No grades selected'}</p>
                   )}
                 </div>
               </div>
            </div>

            {/* Plans List */}
            <div className="mb-8 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                <h3 className="font-bold text-slate-800 text-lg">{isRTL ? 'خطط الرسوم المتاحة' : 'Available Fee Plans'}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                   <button onClick={() => createPlan(0)} className="text-sm font-bold bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white px-4 py-2 rounded-xl transition-all shadow-none">
                     + {isRTL ? 'خطة جديدة مخصصة' : 'New Custom Plan'}
                   </button>
                   <div className="hidden sm:block w-px h-6 bg-slate-200 mx-1"></div>
                   <button onClick={() => createPlan(3)} className="text-sm font-semibold bg-transparent text-slate-500 border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
                     + {isRTL ? '3 أقساط' : '3 Inst.'}
                   </button>
                   <button onClick={() => createPlan(4)} className="text-sm font-semibold bg-transparent text-slate-500 border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
                     + {isRTL ? '4 أقساط' : '4 Inst.'}
                   </button>
                   <button onClick={() => createPlan(6)} className="text-sm font-semibold bg-transparent text-slate-500 border border-slate-200 hover:bg-slate-50 px-3 py-2 rounded-xl transition-colors">
                     + {isRTL ? '6 أقساط' : '6 Inst.'}
                   </button>
                </div>
              </div>
              
              {gradePlans.length === 0 ? (
                <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white">
                  <div className="mx-auto w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <PieChart className="text-slate-400" size={32} />
                  </div>
                  <h4 className="text-slate-900 font-bold mb-2">{isRTL ? 'لا توجد خطط رسوم مسجلة' : 'No fee plans registered'}</h4>
                  <p className="text-slate-500 font-medium text-sm mb-6 max-w-sm mx-auto leading-relaxed">{isRTL ? 'قم بإنشاء خطة رسوم مخصصة أو استخدم أحد القوالب الجاهزة للبدء في تنظيم المصروفات والأقساط.' : 'Create a custom fee plan or use one of the templates to start organizing fees and installments.'}</p>
                  <button onClick={() => createPlan(0)} className="text-sm font-bold bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white px-6 py-2.5 rounded-xl transition-all shadow-none">
                    + {isRTL ? 'إنشاء خطتك الأولى' : 'Create your first plan'}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {gradePlans.map(plan => (
                    <div 
                      key={plan.id} 
                      onClick={() => setActivePlanId(plan.id)}
                      className={`relative p-5 rounded-2xl border cursor-pointer transition-all duration-300 bg-white ${
                         plan.isActive 
                           ? 'border-emerald-200 shadow-sm ring-4 ring-emerald-50' 
                           : (activePlanId === plan.id ? 'border-slate-300 shadow-sm ring-4 ring-slate-50' : 'border-slate-100 hover:border-slate-200')
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3 group/header">
                        {editingPlanId === plan.id ? (
                           <input 
                              type="text" 
                              autoFocus
                              onClick={e => e.stopPropagation()}
                              value={isRTL ? plan.name : plan.nameEn}
                              onChange={e => {
                                 setFeePlans(prev => prev.map(p => p.id === plan.id ? { ...p, [isRTL ? 'name' : 'nameEn']: e.target.value } : p));
                              }}
                              onBlur={() => setEditingPlanId(null)}
                              onKeyDown={e => e.key === 'Enter' && setEditingPlanId(null)}
                              className="font-bold text-slate-900 text-lg bg-transparent outline-none w-[70%] border-b border-violet-300"
                              placeholder={isRTL ? 'اسم الخطة' : 'Plan Name'}
                           />
                        ) : (
                           <div className="flex items-center gap-2 max-w-[80%]">
                             <div className="flex items-center gap-2">
                               {plan.isActive && <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>}
                               <h4 className="font-bold text-slate-900 text-lg truncate">{isRTL ? plan.name : plan.nameEn}</h4>
                             </div>
                             <button 
                               onClick={(e) => { e.stopPropagation(); setEditingPlanId(plan.id); setActivePlanId(plan.id); }}
                               className="text-slate-400 hover:text-violet-600 opacity-0 group-hover/header:opacity-100 transition-opacity flex-shrink-0 ml-1"
                             >
                               <Edit2 size={16} />
                             </button>
                           </div>
                        )}
                        <div className="flex items-center gap-2 flex-shrink-0">
                           {!plan.isActive && (
                              <button 
                                onClick={(e) => { e.stopPropagation(); removePlan(plan.id); }}
                                className="text-slate-300 hover:text-red-500 transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                           )}
                        </div>
                      </div>
                      <p className="text-sm font-medium text-slate-500 mb-6">{plan.installments.length} {isRTL ? 'أقساط' : 'Installments'}</p>
                      
                      <button 
                         onClick={(e) => {
                           e.stopPropagation();
                           activatePlan(plan.id);
                         }}
                         className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${plan.isActive ? 'bg-slate-50 text-slate-400 border-slate-100 cursor-default' : 'bg-transparent text-slate-600 border-slate-200 hover:bg-slate-50'}`}
                      >
                         {plan.isActive ? (isRTL ? 'الخطة النشطة' : 'Active Plan') : (isRTL ? 'تعيين كخطة نشطة' : 'Set Active')}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {currentPlan && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                 {/* Section B: Fee Configuration */}
                 <div>
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600">
                           <Receipt size={16} />
                         </div>
                         <h3 className="font-extrabold text-slate-800 text-lg">{isRTL ? 'بنود الرسوم' : 'Fee Items'}</h3>
                       </div>
                       <button onClick={addFeeItemRow} className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5">
                         <Plus size={16} /> {isRTL ? 'إضافة بند' : 'Add Item'}
                       </button>
                    </div>
                    
                    <div className="space-y-3">
                       {currentPlan.feeItems.map(item => (
                         <div key={item.id} className="flex gap-3 items-start group">
                           <div className="flex-1 space-y-2">
                             <input 
                                type="text" 
                                value={isRTL ? item.name : item.nameEn} 
                                onChange={e => updateFeeItem(item.id, isRTL ? 'name' : 'nameEn', e.target.value)}
                                placeholder={isRTL ? 'اسم البند...' : 'Item name...'}
                                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 outline-none focus:border-violet-300 font-bold text-sm text-slate-800 transition-colors"
                             />
                           </div>
                           <div className="w-1/3 relative">
                             <input 
                                type="number" 
                                value={item.amount || ''} 
                                onChange={e => updateFeeItem(item.id, 'amount', Number(e.target.value))}
                                placeholder="0"
                                className={`w-full bg-slate-50 border border-slate-100 rounded-xl py-2.5 outline-none focus:border-violet-300 font-mono text-sm font-bold text-slate-800 transition-colors ${isRTL ? 'pr-3 pl-8' : 'pl-3 pr-8'}`}
                             />
                             <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none text-slate-400 font-bold text-xs`}>
                               ج.م
                             </div>
                           </div>
                           <button onClick={() => removeFeeItemRow(item.id)} className="w-[42px] h-[42px] flex-shrink-0 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                             <Trash2 size={16} />
                           </button>
                         </div>
                       ))}
                    </div>
                    
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                      <span className="font-bold text-slate-500 text-sm">{isRTL ? 'إجمالي الرسوم الدراسية' : 'Total Course Fees'}</span>
                      <span className="font-mono text-2xl font-extrabold text-slate-900">{currentPlan.feeItems.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()} <span className="text-sm font-sans text-slate-400">ج.م</span></span>
                    </div>
                 </div>

                 {/* Section C: Installment Configuration */}
                 <div>
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-2">
                         <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600">
                           <CalendarDays size={16} />
                         </div>
                         <h3 className="font-extrabold text-slate-800 text-lg">{isRTL ? 'إدارة الأقساط' : 'Installment Management'}</h3>
                       </div>
                       <button onClick={addInstallmentRow} className="text-violet-600 hover:text-violet-700 hover:bg-violet-50 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-1.5">
                         <Plus size={16} /> {isRTL ? 'إضافة قسط' : 'Add Installment'}
                       </button>
                    </div>
                    
                    <div className="space-y-4">
                       {currentPlan.installments.map((item, index) => (
                         <div key={item.id} className="bg-slate-50 border border-slate-100 p-4 rounded-2xl relative group">
                            {/* Close Button */}
                            <button onClick={() => removeInstallmentRow(item.id)} className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} text-slate-300 hover:text-red-500 transition-colors`}>
                               <Trash2 size={16} />
                            </button>
                            
                            <div className={`mb-4 flex items-center gap-3 ${isRTL ? 'pl-8' : 'pr-8'}`}>
                              <div className="flex-1">
                                <input 
                                  type="text"
                                  value={isRTL ? item.name : item.nameEn}
                                  onChange={e => updateInstallment(item.id, isRTL ? 'name' : 'nameEn', e.target.value)}
                                  placeholder={isRTL ? 'اسم القسط (مثال: القسط الأول)' : 'Installment Name (e.g. First Installment)'}
                                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-violet-300 font-bold text-sm text-slate-800 focus:ring-2 focus:ring-violet-50 transition-all"
                                />
                              </div>
                              <div className="w-28 relative">
                                 <input 
                                   type="number"
                                   value={item.amount || ''}
                                   onChange={e => updateInstallment(item.id, 'amount', Number(e.target.value))}
                                   placeholder="0"
                                   className={`w-full bg-white border border-slate-200 rounded-xl py-2 outline-none focus:border-violet-300 font-mono text-sm font-bold text-slate-800 focus:ring-2 focus:ring-violet-50 transition-all ${isRTL ? 'pr-3 pl-8' : 'pl-3 pr-8'}`}
                                 />
                                 <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-2' : 'right-0 pr-2'} flex items-center pointer-events-none text-slate-400 font-bold text-[10px]`}>
                                   ج.م
                                 </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                               <div className="flex-1 relative">
                                 <input 
                                   type="date"
                                   value={item.dueDate}
                                   onChange={e => updateInstallment(item.id, 'dueDate', e.target.value)}
                                   className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 outline-none focus:border-violet-300 font-mono text-sm text-slate-600 focus:ring-2 focus:ring-violet-50 transition-all"
                                 />
                               </div>
                               <div className="flex items-center gap-2">
                                 <span className="text-xs font-bold text-slate-500">{isRTL ? 'الحالة:' : 'Status:'}</span>
                                 <button 
                                   onClick={() => updateInstallment(item.id, 'isActive', !item.isActive)}
                                   className={`w-10 h-5 rounded-full relative transition-colors ${item.isActive ? 'bg-teal-500' : 'bg-slate-200'}`}
                                 >
                                   <div className={`absolute top-0.5 ${isRTL ? 'right-0.5' : 'left-0.5'} w-4 h-4 rounded-full bg-white transition-transform ${item.isActive ? (isRTL ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}`} />
                                 </button>
                                 <span className={`text-xs font-bold ${item.isActive ? 'text-teal-600' : 'text-slate-400'} min-w-[3rem]`}>{item.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}</span>
                               </div>
                            </div>

                         </div>
                       ))}
                       
                       <div className="bg-slate-50 rounded-xl p-4 flex justify-between items-center mt-6 border border-slate-100">
                          <span className="font-bold text-slate-600 text-sm">{isRTL ? 'إجمالي الأقساط' : 'Total Installments'}</span>
                          <div className="flex items-center gap-3">
                             {currentPlan.installments.reduce((acc, curr) => acc + (curr.amount || 0), 0) !== currentPlan.feeItems.reduce((acc, curr) => acc + (curr.amount || 0), 0) && (
                                <span className="text-xs font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-md">{isRTL ? 'عدم تطابق مع الرسوم' : 'Mismatch with Fees'}</span>
                             )}
                             <span className={`font-mono text-xl font-extrabold ${currentPlan.installments.reduce((acc, curr) => acc + (curr.amount || 0), 0) === currentPlan.feeItems.reduce((acc, curr) => acc + (curr.amount || 0), 0) ? 'text-teal-600' : 'text-slate-800'}`}>{currentPlan.installments.reduce((acc, curr) => acc + (curr.amount || 0), 0).toLocaleString()} <span className="text-xs font-sans opacity-70">ج.م</span></span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl p-6 md:p-8 relative animate-fadeIn shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  {isRTL ? 'تسجيل دفعة جديدة' : 'Register Payment'}
                </h3>
                <p className="text-slate-500 font-medium text-sm mt-1">{isRTL ? 'سجل تحصيل دفعة لطالب' : 'Record a payment collection for a student'}</p>
              </div>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isRTL ? 'اسم الطالب' : 'Student Name'}</label>
                <CustomSelect 
                  value={paymentForm.studentId}
                  onChange={v => setPaymentForm(prev => ({...prev, studentId: v}))}
                  options={[
                    { value: '', label: isRTL ? 'اختر الطالب...' : 'Select student...' },
                    ...transactions.map(t => ({ value: t.studentId, label: isRTL ? t.studentName : t.studentNameEn }))
                  ]}
                  placeholder={isRTL ? 'اختر الطالب...' : 'Select student...'}
                  isRTL={isRTL}
                  disabled={!!selectedStudentForDetails}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isRTL ? 'المبلغ' : 'Amount'}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={paymentForm.amount}
                    onChange={e => setPaymentForm(prev => ({...prev, amount: e.target.value}))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all font-mono text-slate-800 font-bold text-lg"
                    placeholder="0.00"
                  />
                  <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center pointer-events-none text-slate-400 font-bold`}>
                    ج.م
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isRTL ? 'طريقة الدفع' : 'Payment Method'}</label>
                <CustomSelect 
                  value="cash"
                  onChange={() => {}}
                  options={[
                    { value: 'cash', label: isRTL ? 'نقدي (Cash)' : 'Cash' },
                    { value: 'bank', label: isRTL ? 'تحويل بنكي' : 'Bank Transfer' },
                    { value: 'card', label: isRTL ? 'بطاقة ائتمان' : 'Credit Card' },
                  ]}
                  isRTL={isRTL}
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all shadow-none"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={handlePaymentSubmit}
                className="flex-[2] bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-violet-200 flex justify-center items-center gap-2"
              >
                <Plus size={18} /> {isRTL ? 'تأكيد التسجيل' : 'Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-3xl p-6 md:p-10 relative animate-fadeIn shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  {isRTL ? 'إصدار فاتورة جديدة' : 'Issue Invoice'}
                </h3>
                <p className="text-slate-500 font-medium text-sm mt-1">{isRTL ? 'إصدار فاتورة لطالب محدد' : 'Create a new invoice for a student'}</p>
              </div>
              <button 
                onClick={() => setIsInvoiceModalOpen(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full text-slate-400 bg-slate-50 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isRTL ? 'اسم الطالب' : 'Student Name'}</label>
                <CustomSelect 
                  value={invoiceForm.studentId}
                  onChange={v => setInvoiceForm(prev => ({...prev, studentId: v}))}
                  options={[
                    { value: '', label: isRTL ? 'اختر الطالب...' : 'Select student...' },
                    ...transactions.map(t => ({ value: t.studentId, label: isRTL ? t.studentName : t.studentNameEn }))
                  ]}
                  placeholder={isRTL ? 'اختر الطالب...' : 'Select student...'}
                  isRTL={isRTL}
                  disabled={!!selectedStudentForDetails}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isRTL ? 'الربط بقسط' : 'Link to Installment'}</label>
                <CustomSelect 
                  value={invoiceForm.feeItem}
                  onChange={handleInvoiceInstallmentChange}
                  options={[
                    { value: '', label: isRTL ? 'اختر القسط...' : 'Select installment...' },
                    ...(activeInvoicePlan ? activeInvoicePlan.installments.map(inst => ({
                       value: inst.id, label: isRTL ? inst.name : inst.nameEn
                    })) : []),
                    { value: 'all', label: isRTL ? 'كل الأقساط' : 'All Installments' }
                  ]}
                  placeholder={isRTL ? 'اختر القسط...' : 'Select installment...'}
                  isRTL={isRTL}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isRTL ? 'المبلغ' : 'Amount'}</label>
                <div className="relative">
                  <input 
                    type="number"
                    value={invoiceForm.amount}
                    onChange={e => setInvoiceForm(prev => ({...prev, amount: e.target.value}))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-50 transition-all font-mono text-slate-800 font-bold text-lg"
                    placeholder="0.00"
                  />
                  <div className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center pointer-events-none text-slate-400 font-bold`}>
                    ج.م
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{isRTL ? 'تاريخ الاستحقاق' : 'Due Date'}</label>
                <input 
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={e => setInvoiceForm(prev => ({...prev, dueDate: e.target.value}))}
                  readOnly={invoiceForm.feeItem !== 'all' && invoiceForm.feeItem !== ''}
                  className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none transition-all font-mono text-slate-800 ${invoiceForm.feeItem !== 'all' && invoiceForm.feeItem !== '' ? 'opacity-60 cursor-not-allowed text-slate-500 bg-slate-100' : 'focus:border-violet-500 focus:ring-4 focus:ring-violet-50'}`}
                />
              </div>
            </div>

            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => setIsInvoiceModalOpen(false)}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all shadow-none"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={handleInvoiceSubmit}
                className="flex-[2] bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-violet-200 flex justify-center items-center gap-2"
              >
                <FileText size={18} /> {isRTL ? 'إصدار الفاتورة' : 'Issue Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR MESSAGE PARENT */}
      {isMessageModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-none w-full max-w-md p-6 relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {isRTL ? 'إرسال رسالة لولي الأمر' : 'Message Parent'}
              </h3>
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{isRTL ? 'إلى' : 'To'}</label>
                <div className={`w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-medium text-slate-500`}>
                  {selectedStudentForDetails?.studentName} {isRTL ? '(ولي الأمر)' : '(Parent)'}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{isRTL ? 'نص الرسالة' : 'Message Content'}</label>
                <textarea 
                  rows={4}
                  placeholder={isRTL ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-violet-400 transition-all font-medium text-slate-800 resize-none"
                />
              </div>

            </div>

            <div className="mt-8 flex gap-3">
               <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 rounded-xl transition-all shadow-none"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={() => setIsMessageModalOpen(false)}
                className="flex-1 bg-gradient-to-r from-violet-600 to-cyan-500 hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all shadow-none flex items-center justify-center gap-2"
              >
                <Send size={18} /> {isRTL ? 'إرسال' : 'Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL FOR INSTALLMENT PLANS */}
      {isPlanModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 relative animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">
                {editingPlan ? (isRTL ? 'إدارة خطة الأقساط' : 'Manage Installment Plan') : (isRTL ? 'إنشاء خطة جديدة' : 'Create New Plan')}
              </h3>
              <button 
                onClick={() => setIsPlanModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{isRTL ? 'اسم الخطة' : 'Plan Name'}</label>
                <input 
                  type="text" 
                  value={modalFormData.name}
                  onChange={e => setModalFormData({...modalFormData, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50 transition-all font-medium text-slate-800"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">{isRTL ? 'إجمالي القيمة المبدئية' : 'Total Value'}</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={modalFormData.totalValue}
                    onChange={e => setModalFormData({...modalFormData, totalValue: Number(e.target.value)})}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'} outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50 transition-all font-mono font-bold text-slate-800`}
                  />
                  <span className={`absolute inset-y-0 ${isRTL ? 'left-0 pl-4' : 'right-0 pr-4'} flex items-center text-sm font-bold text-slate-400 pointer-events-none`}>
                    ج.م
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">{isRTL ? 'حالة الخطة' : 'Plan Status'}</label>
                <div 
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${modalFormData.isActive ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-200 bg-slate-50'}`}
                  onClick={() => setModalFormData({...modalFormData, isActive: !modalFormData.isActive})}
                >
                  <span className={`text-sm font-bold ${modalFormData.isActive ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {modalFormData.isActive ? (isRTL ? 'نشط' : 'Active') : (isRTL ? 'غير نشط' : 'Inactive')}
                  </span>
                  
                  {/* Toggle switch */}
                  <div className={`w-11 h-6 rounded-full flex items-center p-1 transition-colors duration-300 ${modalFormData.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${modalFormData.isActive ? (isRTL ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'}`} />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                onClick={() => setIsPlanModalOpen(false)}
                className="flex-1 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold py-3 rounded-xl transition-colors"
              >
                {isRTL ? 'إلغاء' : 'Cancel'}
              </button>
              <button 
                onClick={handleSavePlan}
                className="flex-[2] bg-violet-600 text-white hover:bg-violet-700 font-bold py-3 rounded-xl transition-colors shadow-lg shadow-violet-200"
              >
                {isRTL ? 'حفظ الخطة' : 'Save Plan'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

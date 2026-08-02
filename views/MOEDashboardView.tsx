import { translations } from "./translations";
import React, { useState, useEffect, useRef } from "react";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ChevronDown,
  MapPin,
  AlertTriangle,
  AlertCircle,
  Clock,
  Users,
  Activity,
  GraduationCap,
  Building,
  Briefcase,
  Calendar,
  Monitor,
  Wrench,
  BookOpen,
  Globe,
  LineChart,
  ClipboardCheck,
  Star,
  TrendingUp,
  ArrowLeft,
  Wallet,
  PieChart,
  CheckCircle2,
  Package,
  UserPlus,
  Eye,
  RefreshCw,
  Server,
  CheckCircle,
  Archive,
  Award,
  Banknote,
  Hammer,
  Wifi,
  Beaker,
  FilePlus,
  Shield,
  PenTool,
  MonitorUp,
  Trophy,
  Presentation,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

const InteractiveAttendanceChart = () => {
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);
  const data = [
    { id: 1, week: 'الأسبوع 1', value: '91%', cx: 0, cy: 30 },
    { id: 2, week: 'الأسبوع 2', value: '92.5%', cx: 10, cy: 22 },
    { id: 3, week: 'الأسبوع 3', value: '93%', cx: 20, cy: 19 },
    { id: 4, week: 'الأسبوع 4', value: '92%', cx: 30, cy: 25 },
    { id: 5, week: 'الأسبوع 5', value: '90%', cx: 40, cy: 35 },
    { id: 6, week: 'الأسبوع 6', value: '88%', cx: 50, cy: 45 },
    { id: 7, week: 'الأسبوع 7', value: '89%', cx: 60, cy: 40 },
    { id: 8, week: 'الأسبوع 8', value: '94%', cx: 70, cy: 15 },
    { id: 9, week: 'الأسبوع 9', value: '94.5%', cx: 75, cy: 12 },
    { id: 10, week: 'الأسبوع 10', value: '95%', cx: 80, cy: 10 },
    { id: 11, week: 'الأسبوع 11', value: '93%', cx: 90, cy: 20 },
    { id: 12, week: 'الأسبوع 12', value: '94.2%', cx: 100, cy: 14 }
  ];

  return (
    <div className="flex-1 w-full mt-6 relative rounded-md overflow-hidden flex items-end">
      {/* Tooltip */}
      {hoveredPoint !== null && (
        <div 
          className="absolute z-20 bg-slate-800 text-white text-[10px] py-1 px-2 rounded font-bold pointer-events-none transform -translate-x-1/2 -translate-y-full whitespace-nowrap shadow-lg flex flex-col items-center justify-center pointer-events-none"
          style={{ 
            left: `${data[hoveredPoint].cx}%`, 
            top: `calc(${(data[hoveredPoint].cy / 60) * 100}% - 8px)` 
          }}
        >
          <span>{data[hoveredPoint].week}</span>
          <span className="text-emerald-300">{data[hoveredPoint].value}</span>
        </div>
      )}

      {/* SVG Chart */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
        {/* Target Line */}
        <line x1="0" y1="10" x2="100" y2="10" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2,2" />
        
        {/* Area Fill */}
        <path d={`M0,60 ${data.map(d => `L${d.cx},${d.cy}`).join(' ')} L100,60 Z`} fill="#d1fae5" opacity="0.6" />
        
        {/* Line */}
        <path d={`M${data.map(d => `${d.cx},${d.cy}`).join(' L')}`} fill="none" stroke="#10b981" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Points & Interactive Zones */}
        {data.map((d, index) => (
          <g key={d.id}>
            {/* The point (visible when hovered or the last point) */}
            {(hoveredPoint === index || index === data.length - 1) && (
              <circle 
                cx={d.cx} 
                cy={d.cy} 
                r="2.5" 
                fill="#10b981" 
                stroke="white" 
                strokeWidth="1" 
                className={hoveredPoint === index ? "animate-pulse" : ""}
                vectorEffect="non-scaling-stroke"
              />
            )}
            
            {/* Invisible hover target (elongated horizontally to be easy to hit) */}
            <rect 
              x={d.cx - 5}
              y="0"
              width="10" 
              height="60" 
              fill="transparent" 
              cursor="pointer"
              onMouseEnter={() => setHoveredPoint(index)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          </g>
        ))}
      </svg>
    </div>
  );
};

const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel =
    options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div
      className="relative inline-block w-full sm:w-auto min-w-[140px]"
      ref={containerRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-slate-200 rounded-lg px-4 py-2 bg-white flex items-center justify-between text-sm text-slate-700 shadow-sm hover:border-slate-300 transition-colors focus:outline-none"
      >
        <span className="truncate me-2">{selectedLabel}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-full bg-white border border-slate-100 rounded-lg shadow-lg z-50 overflow-hidden min-w-[140px]">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`px-4 py-2 text-sm cursor-pointer text-start transition-colors ${value === option.value ? "bg-indigo-50 text-indigo-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const MOEDashboardView = ({
  language = "ar",
  activeTabProp = "overview",
  onTabChange
}: {
  language?: string;
  activeTabProp?: string;
  onTabChange?: (tab: string) => void;
}) => {
  const t = translations[language as "en" | "ar"] || translations["en"];
  const [activeTab, setActiveTabInternal] = useState(activeTabProp);

  const setActiveTab = (tab: string) => {
    setActiveTabInternal(tab);
    if (onTabChange) onTabChange(tab);
  };

  useEffect(() => {
    setActiveTabInternal(activeTabProp);
  }, [activeTabProp]);
  
  const [tableTab, setTableTab] = useState<"technology" | "buildings" | "teachers">("technology");
  const [granularity, setGranularity] = useState("monthly");
  const [extremeMode, setExtremeMode] = useState<"passRates" | "attendance">(
    "passRates",
  );
  const [opsTab, setOpsTab] = useState<"مباشرة" | "حديثاً">("مباشرة");
  const [hrOpsTab, setHrOpsTab] = useState<"مباشرة" | "حديثاً">("مباشرة");
  const [maintenanceOpsTab, setMaintenanceOpsTab] = useState<"مباشرة" | "حديثاً">("مباشرة");
  const [financeOpsTab, setFinanceOpsTab] = useState<"مباشرة" | "حديثاً">("مباشرة");

  const rawChartDataMap: Record<string, any[]> = {
    daily: [
      {
        name: "الأحد",
        national: 75,
        topScore: 85,
        topName: "القاهرة",
        bottomScore: 50,
        bottomName: "السويس",
      },
      {
        name: "الإثنين",
        national: 76,
        topScore: 86,
        topName: "الإسكندرية",
        bottomScore: 52,
        bottomName: "الغردقة",
      },
      {
        name: "الثلاثاء",
        national: 76,
        topScore: 88,
        topName: "المنصورة",
        bottomScore: 51,
        bottomName: "القاهرة الجديدة",
      },
      {
        name: "الأربعاء",
        national: 78,
        topScore: 87,
        topName: "طنطا",
        bottomScore: 55,
        bottomName: "السويس",
      },
      {
        name: "الخميس",
        national: 79,
        topScore: 89,
        topName: "القاهرة",
        bottomScore: 54,
        bottomName: "الإسماعيلية",
      },
    ],
    weekly: [
      {
        name: "الأسبوع 1",
        national: 72,
        topScore: 80,
        topName: "المنصورة",
        bottomScore: 48,
        bottomName: "الإسكندرية",
      },
      {
        name: "الأسبوع 2",
        national: 74,
        topScore: 82,
        topName: "القاهرة",
        bottomScore: 50,
        bottomName: "الغردقة",
      },
      {
        name: "الأسبوع 3",
        national: 75,
        topScore: 85,
        topName: "الإسكندرية",
        bottomScore: 55,
        bottomName: "القاهرة الجديدة",
      },
      {
        name: "الأسبوع 4",
        national: 78,
        topScore: 88,
        topName: "المنصورة",
        bottomScore: 58,
        bottomName: "السويس",
      },
    ],
    monthly: [
      {
        name: "سبتمبر",
        national: 65,
        topScore: 75,
        topName: "الإسكندرية",
        bottomScore: 45,
        bottomName: "الإسماعيلية",
      },
      {
        name: "أكتوبر",
        national: 68,
        topScore: 78,
        topName: "طنطا",
        bottomScore: 48,
        bottomName: "الإسكندرية",
      },
      {
        name: "نوفمبر",
        national: 72,
        topScore: 82,
        topName: "القاهرة",
        bottomScore: 52,
        bottomName: "السويس",
      },
      {
        name: "ديسمبر",
        national: 70,
        topScore: 80,
        topName: "المنصورة",
        bottomScore: 50,
        bottomName: "القاهرة الجديدة",
      },
      {
        name: "يناير",
        national: 75,
        topScore: 85,
        topName: "الإسكندرية",
        bottomScore: 55,
        bottomName: "الغردقة",
      },
      {
        name: "فبراير",
        national: 78,
        topScore: 88,
        topName: "القاهرة",
        bottomScore: 58,
        bottomName: "الإسكندرية",
      },
      {
        name: "مارس",
        national: 76,
        topScore: 86,
        topName: "المنصورة",
        bottomScore: 56,
        bottomName: "السويس",
      },
      {
        name: "أبريل",
        national: 79,
        topScore: 89,
        topName: "طنطا",
        bottomScore: 59,
        bottomName: "القاهرة الجديدة",
      },
      {
        name: "مايو",
        national: 82,
        topScore: 92,
        topName: "القاهرة",
        bottomScore: 62,
        bottomName: "الغردقة",
      },
    ],
    term: [
      {
        name: "الترم الأول",
        national: 71,
        topScore: 82,
        topName: "المنصورة",
        bottomScore: 52,
        bottomName: "القاهرة الجديدة",
      },
      {
        name: "الترم الثاني",
        national: 78,
        topScore: 89,
        topName: "القاهرة",
        bottomScore: 60,
        bottomName: "السويس",
      },
    ],
    yearly: [
      {
        name: "2023",
        national: 68,
        topScore: 80,
        topName: "القاهرة",
        bottomScore: 40,
        bottomName: "السويس",
      },
      {
        name: "2024",
        national: 70,
        topScore: 82,
        topName: "المنصورة",
        bottomScore: 45,
        bottomName: "الإسماعيلية",
      },
      {
        name: "2025",
        national: 75,
        topScore: 85,
        topName: "الإسكندرية",
        bottomScore: 50,
        bottomName: "القاهرة الجديدة",
      },
      {
        name: "2026",
        national: 78,
        topScore: 88,
        topName: "طنطا",
        bottomScore: 55,
        bottomName: "الغردقة",
      },
    ],
  };
  const rechartsData = rawChartDataMap[granularity];

  const granularityLabels: Record<string, string> = {
    monthly: "شهري",
    term: "ترم",
    yearly: "سنوي",
  };
  const getGranularityLabel = (g: string) => granularityLabels[g] || "";

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          className="bg-white p-3 border border-slate-100 shadow-lg rounded-xl min-w-[200px]"
          dir="rtl"
        >
          <p className="font-bold text-slate-900 mb-2 border-b border-slate-100 pb-2">
            {label}
          </p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                المتوسط القومي:
              </span>
              <span className="text-slate-900">{data.national}%</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                أعلى منطقة ({data.topName}):
              </span>
              <span className="text-emerald-700">{data.topScore}%</span>
            </div>
            <div className="flex justify-between items-center text-sm font-medium">
              <span className="flex items-center gap-1.5 text-rose-600">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                أقل منطقة ({data.bottomName}):
              </span>
              <span className="text-rose-700">{data.bottomScore}%</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  const [assessmentMode, setAssessmentMode] = useState<"exams" | "lms">(
    "exams",
  );
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const [demoFilters, setDemoFilters] = useState({
    stage: "all",
    grade: "all",
    status: "all",
  });
  const [assessmentFilters, setAssessmentFilters] = useState({
    stage: "all",
    grade: "all",
    subject: "all",
    status: "all",
  });
  const [expandedDemoRegions, setExpandedDemoRegions] = useState<string[]>([]);

  const [curriculumFilters, setCurriculumFilters] = useState({
    stage: "all",
    grade: "all",
    subject: "all",
  });
  const [virtualFilters, setVirtualFilters] = useState({
    stage: "all",
    grade: "all",
  });
  const [activityFilters, setActivityFilters] = useState({
    stage: "all",
    type: "all",
  });

  const [expandedCurriculum, setExpandedCurriculum] = useState<string[]>([]);
  const [expandedVirtual, setExpandedVirtual] = useState<string[]>([]);
  const [expandedActivity, setExpandedActivity] = useState<string[]>([]);

  const toggleRegion = (id: string) => {
    setExpandedRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleDemoRegion = (id: string) => {
    setExpandedDemoRegions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    );
  };

  const toggleCurriculum = (id: string) =>
    setExpandedCurriculum((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleVirtual = (id: string) =>
    setExpandedVirtual((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleActivity = (id: string) =>
    setExpandedActivity((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const curriculumData = [
    {
      id: "reg_tripoli",
      name: "القاهرة",
      target: "الفصل الرابع",
      actual: "الفصل الثالث",
      status: "متأخر",
      statusColor: "bg-rose-100 text-rose-700",
      schools: [
        {
          id: "sch_t1",
          name: "أكاديمية القاهرة الدولية",
          target: "الفصل الرابع",
          actual: "الفصل الرابع",
          status: "متوافق",
          statusColor: "bg-emerald-100 text-emerald-700",
        },
        {
          id: "sch_t2",
          name: "مدرسة الإسكندرية النموذجية",
          target: "الفصل الرابع",
          actual: "الفصل الثالث",
          status: "متأخر",
          statusColor: "bg-rose-100 text-rose-700",
        },
      ],
    },
    {
      id: "reg_benghazi",
      name: "الإسكندرية",
      target: "الفصل الرابع",
      actual: "الفصل الرابع",
      status: "متوافق",
      statusColor: "bg-emerald-100 text-emerald-700",
      schools: [
        {
          id: "sch_b1",
          name: "مدرسة المنصورة الحديثة",
          target: "الفصل الرابع",
          actual: "الفصل الخامس",
          status: "متقدم",
          statusColor: "bg-blue-100 text-blue-700",
        },
        {
          id: "sch_b2",
          name: "مدارس الإسكندرية المتقدمة",
          target: "الفصل الرابع",
          actual: "الفصل الرابع",
          status: "متوافق",
          statusColor: "bg-emerald-100 text-emerald-700",
        },
      ],
    },
    {
      id: "reg_sabha",
      name: "الإسكندرية",
      target: "الفصل الرابع",
      actual: "الفصل الثاني",
      status: "متأخر",
      statusColor: "bg-rose-100 text-rose-700",
      schools: [
        {
          id: "sch_s1",
          name: "أكاديمية القاهرة الجديدة للتميز",
          target: "الفصل الرابع",
          actual: "الفصل الثاني",
          status: "متأخر",
          statusColor: "bg-rose-100 text-rose-700",
        },
      ],
    },
  ];

  const virtualClassesData = [
    {
      id: "reg_tripoli",
      name: "القاهرة",
      scheduled: 450,
      executed: 430,
      attendance: 85,
      interaction: 72,
      schools: [
        {
          id: "sch_t1",
          name: "مدرسة الإسكندرية النموذجية",
          scheduled: 120,
          executed: 115,
          attendance: 88,
          interaction: 75,
        },
        {
          id: "sch_t2",
          name: "أكاديمية طنطا للتميز",
          scheduled: 80,
          executed: 80,
          attendance: 92,
          interaction: 80,
        },
      ],
    },
    {
      id: "reg_benghazi",
      name: "الإسكندرية",
      scheduled: 320,
      executed: 300,
      attendance: 82,
      interaction: 68,
      schools: [
        {
          id: "sch_b1",
          name: "مدرسة المنصورة الحديثة",
          scheduled: 150,
          executed: 145,
          attendance: 85,
          interaction: 70,
        },
      ],
    },
    {
      id: "reg_sabha",
      name: "الإسكندرية",
      scheduled: 200,
      executed: 160,
      attendance: 65,
      interaction: 50,
      schools: [
        {
          id: "sch_s1",
          name: "أكاديمية القاهرة الجديدة للتميز",
          scheduled: 50,
          executed: 40,
          attendance: 60,
          interaction: 45,
        },
      ],
    },
  ];

  const extracurricularData = [
    {
      id: "reg_tripoli",
      name: "القاهرة",
      totalParticipants: 12500,
      dominantActivity: "رياضي",
      dominantColor: "text-indigo-700 bg-indigo-100 border-indigo-200",
      schools: [
        {
          id: "sch_t1",
          name: "أكاديمية القاهرة الدولية",
          totalParticipants: 450,
          dominantActivity: "برمجة",
          dominantColor: "text-cyan-700 bg-cyan-100 border-cyan-200",
        },
        {
          id: "sch_t2",
          name: "ثانوية القاهرة",
          totalParticipants: 620,
          dominantActivity: "رياضي",
          dominantColor: "text-indigo-700 bg-indigo-100 border-indigo-200",
        },
      ],
    },
    {
      id: "reg_benghazi",
      name: "الإسكندرية",
      totalParticipants: 9800,
      dominantActivity: "فنون",
      dominantColor: "text-pink-700 bg-pink-100 border-pink-200",
      schools: [
        {
          id: "sch_b1",
          name: "مدرسة المنصورة الحديثة",
          totalParticipants: 320,
          dominantActivity: "خدمة مجتمع",
          dominantColor: "text-amber-700 bg-amber-100 border-amber-200",
        },
      ],
    },
    {
      id: "reg_sabha",
      name: "الإسكندرية",
      totalParticipants: 3400,
      dominantActivity: "رياضي",
      dominantColor: "text-indigo-700 bg-indigo-100 border-indigo-200",
      schools: [
        {
          id: "sch_s1",
          name: "أكاديمية القاهرة الجديدة للتميز",
          totalParticipants: 150,
          dominantActivity: "فن خطابة",
          dominantColor: "text-emerald-700 bg-emerald-100 border-emerald-200",
        },
      ],
    },
  ];

  const mapPinIcon = (
    <svg
      className="w-4 h-4 text-slate-400 me-2"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"
      ></path>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      ></path>
    </svg>
  );

  const getBadgeClasses = (colorClass: string) => {
    if (colorClass.includes("emerald"))
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800";
    if (colorClass.includes("rose"))
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800";
    if (colorClass.includes("amber"))
      return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800";
    return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800";
  };

  const demographicData = [
    {
      id: "tripoli",
      name: t.tripoliRegion,
      enrolled: "45,000",
      gender: { boys: 52, girls: 48, label: t.boys52Girls48 },
      attendance: "94%",
      attendanceColor: "text-emerald-600",
      chronic: "4%",
      chronicColor: "text-slate-700",
      schools: [
        {
          id: "t1",
          name: `Al-Farouk ${t.middle} School`,
          enrolled: "1,200",
          gender: { boys: 100, girls: 0, label: t.boysSchool },
          attendance: "96%",
          attendanceColor: "text-emerald-600",
          chronic: "2%",
          chronicColor: "text-slate-600",
        },
        {
          id: "t2",
          name: t.tripoliGirlsAcademy,
          enrolled: "950",
          gender: { boys: 0, girls: 100, label: t.girlsSchool },
          attendance: "82%",
          attendanceColor: "text-rose-600",
          chronic: "15%",
          chronicColor: "text-rose-600",
        },
      ],
    },
    {
      id: "sabha",
      name: t.sabhaRegion,
      enrolled: "12,000",
      gender: {
        boys: 55,
        girls: 45,
        label: t.boys55Girls45 || "55% بنين / 45% بنات",
      },
      attendance: "76%",
      attendanceColor: "text-rose-600",
      chronic: "22%",
      chronicColor: "text-rose-600",
      schools: [
        {
          id: "s1",
          name: "Mansoura Modern School",
          enrolled: "850",
          gender: { boys: 40, girls: 60, label: "40% بنين / 60% بنات" },
          attendance: "72%",
          attendanceColor: "text-rose-600",
          chronic: "25%",
          chronicColor: "text-rose-600",
        },
      ],
    },
    {
      id: "benghazi",
      name: t.benghazi || "Alexandria",
      enrolled: "38,000",
      gender: { boys: 50, girls: 50, label: "50% بنين / 50% بنات" },
      attendance: "89%",
      attendanceColor: "text-amber-600",
      chronic: "8%",
      chronicColor: "text-amber-600",
      schools: [
        {
          id: "b1",
          name: "Alexandria Central",
          enrolled: "1,500",
          gender: { boys: 100, girls: 0, label: t.boysSchool },
          attendance: "91%",
          attendanceColor: "text-emerald-600",
          chronic: "5%",
          chronicColor: "text-slate-600",
        },
        {
          id: "b2",
          name: "New Cairo Academy of Excellence",
          enrolled: "1,300",
          gender: { boys: 0, girls: 100, label: t.girlsSchool },
          attendance: "85%",
          attendanceColor: "text-amber-600",
          chronic: "12%",
          chronicColor: "text-amber-600",
        },
      ],
    },
  ];

  const qatariData = [
    {
      id: "tripoli",
      name: t.tripoliRegion,
      exams: {
        enrolled: "45,000",
        submission: "88%",
        pass: "76%",
        passColor: "text-emerald-600",
        fail: "24%",
        failColor: "text-rose-600",
        status: t.stable,
        statusColor: "bg-blue-100 text-blue-700",
      },
      lms: {
        enrolled: "45,000",
        submission: "95%",
        pass: "82%",
        passColor: "text-emerald-600",
        fail: "18%",
        failColor: "text-slate-600",
        status: t.excellent,
        statusColor: "bg-emerald-100 text-emerald-700",
      },
      schools: [
        {
          id: "t1",
          name: t.alFaroukMiddleSchool,
          exams: {
            enrolled: "1,200",
            submission: "95%",
            pass: "85%",
            passColor: "text-emerald-600",
            fail: "15%",
            failColor: "text-slate-600",
            status: t.excellent,
            statusColor: "bg-emerald-100 text-emerald-700",
          },
          lms: {
            enrolled: "1,200",
            submission: "98%",
            pass: "90%",
            passColor: "text-emerald-600",
            fail: "10%",
            failColor: "text-slate-600",
            status: t.excellent,
            statusColor: "bg-emerald-100 text-emerald-700",
          },
        },
        {
          id: "t2",
          name: t.tripoliCentralBoys,
          exams: {
            enrolled: "850",
            submission: "82%",
            pass: "70%",
            passColor: "text-emerald-600",
            fail: "30%",
            failColor: "text-rose-600",
            status: t.stable,
            statusColor: "bg-blue-100 text-blue-700",
          },
          lms: {
            enrolled: "850",
            submission: "88%",
            pass: "75%",
            passColor: "text-emerald-600",
            fail: "25%",
            failColor: "text-slate-600",
            status: t.stable,
            statusColor: "bg-blue-100 text-blue-700",
          },
        },
      ],
    },
    {
      id: "benghazi",
      name: t.benghazi,
      exams: {
        enrolled: "38,000",
        submission: "85%",
        pass: "72%",
        passColor: "text-emerald-600",
        fail: "28%",
        failColor: "text-rose-600",
        status: t.stable,
        statusColor: "bg-blue-100 text-blue-700",
      },
      lms: {
        enrolled: "38,000",
        submission: "90%",
        pass: "78%",
        passColor: "text-emerald-600",
        fail: "22%",
        failColor: "text-slate-600",
        status: t.stable,
        statusColor: "bg-blue-100 text-blue-700",
      },
      schools: [
        {
          id: "b1",
          name: "مدرسة المنصورة الحديثة",
          exams: {
            enrolled: "1,500",
            submission: "96%",
            pass: "88%",
            passColor: "text-emerald-600",
            fail: "12%",
            failColor: "text-slate-600",
            status: t.excellent,
            statusColor: "bg-emerald-100 text-emerald-700",
          },
          lms: {
            enrolled: "1,500",
            submission: "97%",
            pass: "89%",
            passColor: "text-emerald-600",
            fail: "11%",
            failColor: "text-slate-600",
            status: t.excellent,
            statusColor: "bg-emerald-100 text-emerald-700",
          },
        },
        {
          id: "b2",
          name: "مدارس الإسكندرية المتقدمة",
          exams: {
            enrolled: "1,100",
            submission: "80%",
            pass: "65%",
            passColor: "text-amber-600",
            fail: "35%",
            failColor: "text-rose-600",
            status: t.needsAttention || "بحاجة لاهتمام",
            statusColor: "bg-amber-100 text-amber-700",
          },
          lms: {
            enrolled: "1,100",
            submission: "85%",
            pass: "70%",
            passColor: "text-amber-600",
            fail: "30%",
            failColor: "text-rose-600",
            status: t.stable,
            statusColor: "bg-blue-100 text-blue-700",
          },
        },
      ],
    },
    {
      id: "sabha",
      name: t.sabhaRegion,
      exams: {
        enrolled: "15,000",
        submission: "65%",
        pass: "42%",
        passColor: "text-rose-600",
        fail: "58%",
        failColor: "text-rose-600",
        status: t.criticalIntervention,
        statusColor: "bg-rose-100 text-rose-700",
      },
      lms: {
        enrolled: "15,000",
        submission: "70%",
        pass: "45%",
        passColor: "text-rose-600",
        fail: "55%",
        failColor: "text-rose-600",
        status: t.criticalIntervention,
        statusColor: "bg-rose-100 text-rose-700",
      },
      schools: [
        {
          id: "s1",
          name: "أكاديمية القاهرة الجديدة للتميز",
          exams: {
            enrolled: "800",
            submission: "60%",
            pass: "35%",
            passColor: "text-rose-600",
            fail: "65%",
            failColor: "text-rose-600",
            status: t.systemicAlert || "تنبيه نظامي",
            statusColor: "bg-rose-100 text-rose-700",
          },
          lms: {
            enrolled: "800",
            submission: "62%",
            pass: "38%",
            passColor: "text-rose-600",
            fail: "62%",
            failColor: "text-rose-600",
            status: t.systemicAlert || "تنبيه نظامي",
            statusColor: "bg-rose-100 text-rose-700",
          },
        },
      ],
    },
    {
      id: "misrata",
      name: t.misrata,
      exams: {
        enrolled: "28,000",
        submission: "89%",
        pass: "80%",
        passColor: "text-emerald-600",
        fail: "20%",
        failColor: "text-slate-600",
        status: t.excellent,
        statusColor: "bg-emerald-100 text-emerald-700",
      },
      lms: {
        enrolled: "28,000",
        submission: "92%",
        pass: "85%",
        passColor: "text-emerald-600",
        fail: "15%",
        failColor: "text-slate-600",
        status: t.excellent,
        statusColor: "bg-emerald-100 text-emerald-700",
      },
      schools: [
        {
          id: "m1",
          name: "أكاديمية المنصورة للتميز",
          exams: {
            enrolled: "600",
            submission: "99%",
            pass: "95%",
            passColor: "text-emerald-600",
            fail: "5%",
            failColor: "text-slate-600",
            status: t.excellent,
            statusColor: "bg-emerald-100 text-emerald-700",
          },
          lms: {
            enrolled: "600",
            submission: "100%",
            pass: "98%",
            passColor: "text-emerald-600",
            fail: "2%",
            failColor: "text-slate-600",
            status: t.excellent,
            statusColor: "bg-emerald-100 text-emerald-700",
          },
        },
      ],
    },
    {
      id: "zawiya",
      name: t.zawiya,
      exams: {
        enrolled: "22,000",
        submission: "84%",
        pass: "75%",
        passColor: "text-emerald-600",
        fail: "25%",
        failColor: "text-rose-600",
        status: t.stable,
        statusColor: "bg-blue-100 text-blue-700",
      },
      lms: {
        enrolled: "22,000",
        submission: "86%",
        pass: "78%",
        passColor: "text-emerald-600",
        fail: "22%",
        failColor: "text-slate-600",
        status: t.stable,
        statusColor: "bg-blue-100 text-blue-700",
      },
      schools: [
        {
          id: "z1",
          name: "مدرسة طنطا النموذجية للبنات",
          exams: {
            enrolled: "950",
            submission: "91%",
            pass: "85%",
            passColor: "text-emerald-600",
            fail: "15%",
            failColor: "text-slate-600",
            status: t.excellent,
            statusColor: "bg-emerald-100 text-emerald-700",
          },
          lms: {
            enrolled: "950",
            submission: "93%",
            pass: "88%",
            passColor: "text-emerald-600",
            fail: "12%",
            failColor: "text-slate-600",
            status: t.excellent,
            statusColor: "bg-emerald-100 text-emerald-700",
          },
        },
      ],
    },
    {
      id: "ghat",
      name: t.ghat,
      exams: {
        enrolled: "5,000",
        submission: "58%",
        pass: "40%",
        passColor: "text-rose-600",
        fail: "60%",
        failColor: "text-rose-600",
        status: t.criticalIntervention,
        statusColor: "bg-rose-100 text-rose-700",
      },
      lms: {
        enrolled: "5,000",
        submission: "65%",
        pass: "48%",
        passColor: "text-rose-600",
        fail: "52%",
        failColor: "text-rose-600",
        status: t.criticalIntervention,
        statusColor: "bg-rose-100 text-rose-700",
      },
      schools: [
        {
          id: "g1",
          name: "أكاديمية القاهرة الجديدة للتميز",
          exams: {
            enrolled: "450",
            submission: "55%",
            pass: "38%",
            passColor: "text-rose-600",
            fail: "62%",
            failColor: "text-rose-600",
            status: t.systemicAlert || "تنبيه نظامي",
            statusColor: "bg-rose-100 text-rose-700",
          },
          lms: {
            enrolled: "450",
            submission: "62%",
            pass: "45%",
            passColor: "text-rose-600",
            fail: "55%",
            failColor: "text-rose-600",
            status: t.criticalIntervention,
            statusColor: "bg-rose-100 text-rose-700",
          },
        },
      ],
    },
  ];

  const tabs = [
    { id: "overview", label: t.nationalOverview },
    { id: "academics", label: t.academicsStudents },
    { id: "hr", label: t.hrEducators },
    { id: "infrastructure", label: t.infrastructure },
    { id: "financials", label: t.financials },
  ];

  const regions = [
    {
      name: "Cairo",
      top: "25%",
      left: "30%",
      index: "88%",
      status: "On Track",
      color: "bg-green-500",
    },
    {
      name: "Alexandria",
      top: "35%",
      left: "65%",
      index: "85%",
      status: "{t.stable}",
      color: "bg-green-500",
    },
    {
      name: "Alexandria",
      top: "65%",
      left: "45%",
      index: "62%",
      status: "Critical Alerts",
      color: "bg-red-500",
      pulse: true,
    },
  ];

  const alerts = [
    {
      type: "{t.dropoutRisk}",
      desc: "{t.dropoutRiskDesc}",
      badgeColor: "bg-red-100 text-red-700",
      iconColor: "text-red-500",
    },
    {
      type: "{t.academicDrop}",
      desc: "{t.academicDropDesc}",
      badgeColor: "bg-orange-100 text-orange-700",
      iconColor: "text-orange-500",
    },
    {
      type: "{t.resourceAlert}",
      desc: "{t.resourceAlertDesc}",
      badgeColor: "bg-yellow-100 text-yellow-700",
      iconColor: "text-yellow-600",
    },
  ];

  const tableData = [
    { region: t.westernZone, examAvg: "78%", hwAvg: "82%", status: t.normal },
    { region: t.easternZone, examAvg: "74%", hwAvg: "79%", status: t.stable },
    {
      region: t.southernZone,
      examAvg: "65%",
      hwAvg: "68%",
      status: t.attentionNeeded,
    },
  ];

  return (
    <div className="animate-fadeIn space-y-6 pb-20 max-w-[1600px] mx-auto">
      {/* Header & Sector Navigation */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            {t.moeCommandCenter}
          </h2>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "bg-violet-100 text-violet-800 border border-violet-700 shadow-sm"
                    : "bg-transparent text-slate-500 hover:bg-slate-200 hover:text-slate-800 border border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Filters */}
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-between gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2 text-sm text-slate-700 h-[42px] shadow-sm min-w-[160px] hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Clock size={16} className="text-slate-400" />
              <span className="font-medium">{t.academicYear}</span>
            </div>
            <ChevronDown size={14} className="text-slate-400 ms-2" />
          </button>
          <button className="flex items-center justify-between gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2 text-sm text-slate-700 h-[42px] shadow-sm min-w-[160px] hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <MapPin size={16} className="text-slate-400" />
              <span className="font-medium">{t.allRegions}</span>
            </div>
            <ChevronDown size={14} className="text-slate-400 ms-2" />
          </button>
          <button className="flex items-center justify-between gap-2 border border-slate-200 bg-white rounded-lg px-4 py-2 text-sm text-slate-700 h-[42px] shadow-sm min-w-[160px] hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-2 whitespace-nowrap">
              <GraduationCap size={16} className="text-slate-400" />
              <span className="font-medium">{t.allStages}</span>
            </div>
            <ChevronDown size={14} className="text-slate-400 ms-2" />
          </button>
          <button
            title={t.exportReport}
            className="flex items-center justify-center w-[42px] h-[42px] bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-sm transition-colors shrink-0"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {activeTab === "overview" && (
        <>
          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Card 1: Academics (Hero) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between group">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <h3 className="font-bold text-slate-700">إجمالي المقيدين</h3>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
                  1.45M
                </p>
                {/* Horizontal Stacked Progress Bar */}
                <div className="mt-auto pt-2">
                  <div className="flex w-full h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-blue-500 w-[52%]"></div>
                    <div className="bg-fuchsia-400 w-[48%]"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-medium">
                    <span className="text-blue-600">بنين 52%</span>
                    <span className="text-fuchsia-500">بنات 48%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Infrastructure */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <h3 className="font-bold text-slate-700">المدارس العاملة</h3>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                  4,120
                </p>
                <p className="text-sm font-medium text-slate-500 mb-4">
                  التوزيع حسب المرحلة الدراسية
                </p>
                {/* Educational Phase Breakdown */}
                <div className="mt-auto">
                  <div className="flex w-full h-2 rounded-full overflow-hidden mb-2">
                    <div className="bg-emerald-500 w-[55%]"></div>
                    <div className="bg-blue-500 w-[30%]"></div>
                    <div className="bg-amber-500 w-[15%]"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> <span>ابتدائي (55%)</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> <span>إعدادي (30%)</span></div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div> <span>ثانوي (15%)</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Human Resources */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <h3 className="font-bold text-slate-700">القوى العاملة</h3>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                  85,400
                </p>
                <p className="text-sm font-medium text-red-500 mb-4">
                  عجز قدره 450 معلم
                </p>
                {/* Target vs Actual Progress Bar */}
                <div className="mt-auto">
                  <div className="flex w-full h-2 rounded-full overflow-hidden">
                    <div className="bg-slate-800 w-[99%]"></div>
                    <div className="bg-red-500 w-[1%]"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-medium text-slate-500 mt-2">
                    <span>متاح: 85,400</span>
                    <span className="text-red-500">الاحتياج: 85,850</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Finance */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4">
                <Wallet className="w-5 h-5 text-slate-400" strokeWidth={1.5} />
                <h3 className="font-bold text-slate-700">الميزانية المستهلكة</h3>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
                  76.4%
                </p>
                <p className="text-sm font-medium text-slate-500 mb-4">
                  من إجمالي المخصصات
                </p>
                {/* Consumption Bar */}
                <div className="mt-auto">
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-2">
                    <div className="bg-indigo-600 h-3 rounded-full w-[76.4%]"></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-medium text-slate-500">
                    <span className="text-indigo-600 font-semibold">المصروف: 76.4%</span>
                    <span>المتبقي: 23.6%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Strategic KPIs Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 w-full" dir="rtl">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2">
                <GraduationCap className="text-slate-400 w-5 h-5" strokeWidth={1.5} />
                <span className="font-bold text-slate-700">الأداء الأكاديمي</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mt-3">84.2%</div>
              <div className="flex items-center gap-1 mt-2 mb-4">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-semibold text-emerald-600">+2.1% عن الشهر الماضي</span>
              </div>
              {/* Smooth Line Chart */}
              <div className="w-full h-10 mt-auto mb-2">
                <svg className="w-full h-full" viewBox="0 0 100 25" preserveAspectRatio="none">
                  <path d="M0,25 C10,25 20,20 30,18 C40,16 50,22 60,15 C70,8 80,10 100,5" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
                  <circle cx="100" cy="5" r="3" fill="#6366f1" />
                </svg>
                <div className="flex justify-between items-center text-[9px] font-medium text-slate-400 mt-1 px-1">
                  <span>سبتمبر</span>
                  <span>أكتوبر</span>
                  <span>نوفمبر</span>
                  <span>ديسمبر</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2">
                <Monitor className="text-slate-400 w-5 h-5" strokeWidth={1.5} />
                <span className="font-bold text-slate-700">التفاعل الرقمي</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mt-3 mb-1">72%</div>
              <div className="text-sm text-slate-500">الطلاب النشطين</div>
              <div className="mt-auto pt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-slate-700">تفعيل المدارس</span>
                  <span className="text-xs text-emerald-600 bg-emerald-50 rounded px-2 py-0.5 font-bold">85% من المدارس مفعلة للنظام</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-500 h-1.5 rounded-full w-[85%]"></div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2">
                <Users className="text-slate-400 w-5 h-5" strokeWidth={1.5} />
                <span className="font-bold text-slate-700">متوسط كثافة الفصول</span>
              </div>
              <div className="text-3xl font-bold text-slate-800 mt-3">28:1</div>
              <div className="text-sm text-slate-500 mt-2 mb-4">طالب لكل معلم (معدل وطني مستقر)</div>
              {/* Density Distribution Mini-Chart */}
              <div className="flex flex-col gap-3 mt-auto pt-2">
                <div className="flex items-center w-full">
                  <span className="text-[10px] text-slate-600 font-semibold w-12 text-right">مثالي</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full mx-2 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-[65%] rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 w-8 text-left">65%</span>
                </div>
                <div className="flex items-center w-full">
                  <span className="text-[10px] text-slate-600 font-semibold w-12 text-right">متوسط</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full mx-2 overflow-hidden flex">
                    <div className="bg-amber-400 h-full w-[25%] rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 w-8 text-left">25%</span>
                </div>
                <div className="flex items-center w-full">
                  <span className="text-[10px] text-slate-600 font-semibold w-12 text-right">مزدحم</span>
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full mx-2 overflow-hidden flex">
                    <div className="bg-red-400 h-full w-[10%] rounded-full"></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-700 w-8 text-left">10%</span>
                </div>
              </div>
            </div>
          </div>

          {/* The Analytics Engine (CHARTS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Chart 1: Doughnut Mock */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-sm text-slate-900">
                  الحالة التشغيلية للمدارس
                </h3>
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                {/* CSS Conic Gradient Doughnut */}
                <div
                  className="w-32 h-32 rounded-full flex items-center justify-center shrink-0"
                  style={{
                    background:
                      "conic-gradient(#10b981 0% 88%, #f59e0b 88% 97%, #ef4444 97% 100%)",
                  }}
                >
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-xl font-bold text-emerald-600">
                      88%
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 text-xs font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span className="text-slate-600">نشط (88%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span className="text-slate-600">صيانة (9%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  <span className="text-slate-600">مغلق (3%)</span>
                </div>
              </div>
            </div>

            {/* Chart 2: Bar Mock */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Wallet className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-sm text-slate-900">
                  هيكل الإنفاق المالي
                </h3>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>المرتبات (92%)</span>
                    <span className="text-slate-900">12.5B ج.م</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-sky-500 h-2 rounded-full"
                      style={{ width: "92%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>البنية التحتية (5%)</span>
                    <span className="text-slate-900">850M ج.م</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-400 h-2 rounded-full"
                      style={{ width: "5%" }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>التحول الرقمي (3%)</span>
                    <span className="text-slate-900">510M ج.م</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className="bg-indigo-300 h-2 rounded-full"
                      style={{ width: "3%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 3: Area/Line Mock */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <Activity className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-sm text-slate-900">
                  اتجاه الحضور
                </h3>
              </div>
              <div className="flex-1 flex flex-col relative mt-2 w-full">
                <div className="absolute top-0 right-0 w-full text-right pb-2 z-10 flex justify-between items-start">
                  <p className="text-3xl font-bold text-slate-900">94.2%</p>
                  <span className="text-xs font-medium text-slate-500">الهدف: 95%</span>
                </div>
                
                <InteractiveAttendanceChart />
              </div>
              <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] text-slate-400 font-medium">أسبوع 1</span>
                <span className="text-[10px] text-slate-400 font-medium">أسبوع 4</span>
                <span className="text-[10px] text-slate-400 font-medium">أسبوع 8</span>
                <span className="text-[10px] text-slate-500 font-bold">أسبوع 12</span>
              </div>
            </div>
          </div>

          {/* Core App / Live Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* The Geographic Command Center */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative min-h-[480px] flex flex-col overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10 w-full">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-slate-400" />
                  <h3 className="font-bold text-xl text-slate-900">
                    الخريطة التعليمية الوطنية
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm border border-amber-600"></span>
                    <span className="text-slate-600">تنبيه</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm border border-rose-600"></span>
                    <span className="text-slate-600">حرج</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full relative bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                {/* Visual grid background */}
                <div
                  className="absolute inset-0 opacity-[0.15] pointer-events-none"
                  style={{
                    backgroundImage:
                      "radial-gradient(#64748b 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                ></div>

                {/* Map Layout Abstraction Wrapper */}
                <div className="relative w-full h-full max-w-[500px] max-h-[350px]">
                  {/* Cyrenaica (برقة / الشرقية) */}
                  <div className="absolute top-[40%] right-[10%] group z-10">
                    <div className="w-6 h-6 bg-amber-500 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center relative shadow-md border-2 border-white">
                      <span className="absolute w-full h-full bg-amber-400 rounded-full animate-ping opacity-75"></span>
                      <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                    </div>
                    <div className="absolute top-10 right-1/2 translate-x-1/2 w-72 bg-white rounded-2xl p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-100 pointer-events-none">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-bold text-base text-slate-900">
                          المنطقة الشرقية
                        </p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                          تنبيه
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-600">
                          <span className="font-medium">المدارس</span>
                          <span className="font-bold text-slate-900">
                            1,400
                          </span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span className="font-medium">الحضور</span>
                          <span className="font-bold text-amber-600">88%</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span className="font-medium">عجز معلمين</span>
                          <span className="font-bold text-amber-600">-150</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Fezzan (فزان / الجنوبية) */}
                  <div className="absolute top-[65%] right-[60%] group z-10">
                    <div className="w-6 h-6 bg-rose-500 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center relative shadow-md border-2 border-white">
                      <span className="absolute w-full h-full bg-rose-400 rounded-full animate-ping opacity-75"></span>
                      <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                    </div>
                    <div className="absolute top-10 right-1/2 translate-x-1/2 w-72 bg-white rounded-2xl p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-100 pointer-events-none">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-bold text-base text-slate-900">
                          المنطقة الجنوبية
                        </p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          تدخل حرج
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-600">
                          <span className="font-medium">المدارس</span>
                          <span className="font-bold text-slate-900">450</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span className="font-medium">الحضور</span>
                          <span className="font-bold text-rose-600">62%</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-600">
                          <span className="font-medium">خطر تسرب</span>
                          <span className="font-bold text-rose-600">عالي</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Early Warning System */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
                <AlertTriangle className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-lg text-slate-900">
                  نظام الإنذار المبكر
                </h3>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {/* Alert 1 */}
                <div className="flex flex-col p-3 border-r-4 border-red-500 rounded-l-lg bg-red-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> تدخل حرج
                    </span>
                    <span className="text-[10px] text-red-500 font-medium">الجنوب</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    خطر تسرب مرتفع (معدلات الغياب تتجاوز 15 يوماً متواصلة)
                  </p>
                </div>

                {/* Alert 2 */}
                <div className="flex flex-col p-3 border-r-4 border-amber-400 rounded-l-lg bg-amber-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> تنبيه
                    </span>
                    <span className="text-[10px] text-amber-500 font-medium">الشرق</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    عجز حرج في توافر معلمي الرياضيات للتعليم الأساسي
                  </p>
                </div>

                {/* Alert 3 */}
                <div className="flex flex-col p-3 border-r-4 border-red-500 rounded-l-lg bg-red-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-red-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span> تدخل حرج
                    </span>
                    <span className="text-[10px] text-red-500 font-medium">الجنوب</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    عجز مفاجئ في البنية التحتية (انهيار جزئي لسور مدرسة)
                  </p>
                </div>

                {/* Alert 4 */}
                <div className="flex flex-col p-3 border-r-4 border-amber-400 rounded-l-lg bg-amber-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-700 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span> تنبيه
                    </span>
                    <span className="text-[10px] text-amber-500 font-medium">الغرب</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    تأخر في استلام الدفعة الثانية من الكتب المدرسية
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Operations Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-2">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-lg text-slate-900">
                  العمليات المباشرة للوزارة
                </h3>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-full">
                <button
                  onClick={() => setOpsTab('مباشرة')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                    opsTab === 'مباشرة'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${opsTab === 'مباشرة' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}
                  ></span>
                  مباشرة
                </button>
                <button
                  onClick={() => setOpsTab('حديثاً')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                    opsTab === 'حديثاً'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${opsTab === 'حديثاً' ? 'bg-slate-500' : 'bg-slate-300'}`}
                  ></span>
                  حديثاً
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
              {opsTab === 'مباشرة' ? (
                <>
                  {[
                    {
                      title: 'تحديث المنظومة الامتحانية',
                      desc: 'بدء رفع واعتماد نتائج الامتحانات النصفية في المراكز الامتحانية للتعليم الأساسي والثانوي.',
                      time: 'منذ 5 د',
                      icon: ClipboardCheck,
                      isLive: true
                    },
                    {
                      title: 'سلاسل الإمداد',
                      desc: 'اكتمال توزيع الدفعة الثالثة من الكتاب المدرسي بنجاح في عموم مدارس المنطقة الغربية.',
                      time: 'منذ 18 د',
                      icon: BookOpen,
                      isLive: true
                    },
                    {
                      title: 'تزامن بيانات الموارد البشرية',
                      desc: 'تم بنجاح استيراد وربط بيانات أكثر من 50 مدرس جديد في المنظومة التابعة لبلديات الجنوب.',
                      time: 'منذ 1 س',
                      icon: Users,
                      isLive: true
                    },
                    {
                      title: 'الأنظمة والبنية التحتية',
                      desc: 'تحديث وترقية خوادم المنصة الموحدة لإصدار الشهادات الإلكترونية لتتحمل الضغط العالي أثناء ذروة الاستخدام.',
                      time: 'منذ 3 س',
                      icon: Monitor,
                      isLive: true
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-slate-400"> <item.icon size={20} strokeWidth={1.5} /> </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{item.time}</span>
                          {item.isLive ? (
                            <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-red-100 tracking-wider">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> LIVE
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">RECENT</span>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors">عرض التفاصيل</button>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    {
                      title: 'تفعيل حسابات الدفعة الجديدة للمعلمين',
                      desc: 'تم تفعيل حسابات الاستخدام لـ 150 معلم في بوابة خدمات الموظفين الإلكترونية.',
                      time: 'منذ 5 س',
                      icon: UserPlus,
                      isLive: false
                    },
                    {
                      title: 'ترقية خوادم السحابة التعليمية',
                      desc: 'استكمال عمليات النقل وتوسعة السعة التخزينية المخصصة لمكتبة المناهج الرقمية.',
                      time: 'منذ 8 س',
                      icon: Server,
                      isLive: false
                    },
                    {
                      title: 'اعتماد نتائج التقييم الشهري للمدارس',
                      desc: 'نشر تقييمات المدارس المتميزة والمتدنية للأداء المدرسي لشهر أكتوبر المنصرم وتوزيع الإشعارات.',
                      time: 'منذ 12 س',
                      icon: CheckCircle,
                      isLive: false
                    },
                    {
                      title: 'أرشفة سجلات الحضور للترم الأول',
                      desc: 'بدء جدولة أرشفة وتجميد سجلات الحضور والغياب للترم الأول مع اقتراب نهايته لجميع المراحل.',
                      time: 'منذ 24 س',
                      icon: Archive,
                      isLive: false
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-slate-400"> <item.icon size={20} strokeWidth={1.5} /> </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{item.time}</span>
                          {item.isLive ? (
                            <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-red-100 tracking-wider">
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> LIVE
                            </span>
                          ) : (
                            <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">RECENT</span>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors">عرض التفاصيل</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
      {activeTab === "academics" && (
        <>
          {/* Top KPIs (8-Card Grid with Visual Hierarchy) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
            {/* Card 1: إجمالي المقيدين */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  إجمالي المقيدين
                </span>
                <div className="bg-blue-50 text-blue-600 p-2.5 rounded-xl">
                  <Users size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  1.45M
                </p>
                <p className="text-sm mt-2 font-medium text-slate-500">
                  بنين: 52% | بنات: 48%
                </p>
              </div>
            </div>

            {/* Card 2: متوسط التقييم الوطني (Hero Card) */}
            <div className="bg-gradient-to-tr from-violet-900 to-fuchsia-600 text-white rounded-2xl p-6 shadow-md border-0 h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-white">
                  متوسط التقييم الوطني
                </span>
                <div className="bg-white/20 text-white p-2.5 rounded-xl backdrop-blur-sm">
                  <LineChart size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-white shadow-sm">
                  78.4%
                </p>
                <div className="text-sm mt-2 font-medium text-violet-100 flex items-center gap-1">
                  <TrendingUp size={16} />
                  <span>+2.1% من الربع الأول</span>
                </div>
              </div>
            </div>

            {/* Card 3: معدل إنجاز المنهج */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  معدل إنجاز المنهج
                </span>
                <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl">
                  <BookOpen size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  85%
                </p>
                <p className="text-sm mt-2 font-medium text-slate-500">
                  متوافق مع الخطة الزمنية للمقرر
                </p>
              </div>
            </div>

            {/* Card 4: خطر التسرب (Alert Card) */}
            <div className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-bold text-rose-700">
                  خطر التسرب
                </span>
                <div className="bg-rose-100 text-rose-600 p-2.5 rounded-xl">
                  <AlertTriangle size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  1,240
                </p>
                <p className="text-xs mt-2 font-medium text-rose-600/80">
                  السبب الجذري: 65% غياب | 35% رسوب
                </p>
                <div className="text-rose-700 hover:text-rose-800 text-sm font-medium flex items-center gap-1 cursor-pointer mt-3 w-fit transition-colors group">
                  عرض قائمة المعرضين للخطر
                  <ArrowLeft
                    size={16}
                    className="transform transition-transform group-hover:-translate-x-1"
                  />
                </div>
              </div>
            </div>

            {/* Card 5 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  تفاعل التعليم عن بُعد
                </span>
                <div className="bg-cyan-50 text-cyan-600 p-2.5 rounded-xl">
                  <Globe size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  82%
                </p>
                <p className="text-sm mt-2 font-medium text-slate-500">
                  1.2M طالب نشط أسبوعياً عبر منصة LMS
                </p>
              </div>
            </div>

            {/* Card 6 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  الحصص الافتراضية المباشرة
                </span>
                <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl">
                  <Monitor size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  15,400
                </p>
                <p className="text-sm mt-2 font-medium text-slate-500">
                  حصة أونلاين تم بثها
                </p>
              </div>
            </div>

            {/* Card 7 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  إنجاز الواجبات والمهمات
                </span>
                <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
                  <ClipboardCheck size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  4.2M
                </p>
                <p className="text-sm mt-2 font-medium text-slate-500">
                  مهمة تم تسليمها وتصحيحها رقمياً
                </p>
              </div>
            </div>

            {/* Card 8 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  المشاركة في الأنشطة
                </span>
                <div className="bg-orange-50 text-orange-600 p-2.5 rounded-xl">
                  <Star size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  64%
                </p>
                <p className="text-sm mt-2 font-medium text-slate-500">
                  أنشطة رياضية، علمية، ولاصفية
                </p>
              </div>
            </div>
          </div>

          {/* Deep Analytics Grid */}

          {/* ROW 1: Trends & Subjects */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            {/* Left Block: Academic Progress Trend */}
            <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-[420px] flex flex-col">
              <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-900">
                    اتجاه التقدم الأكاديمي ({getGranularityLabel(granularity)})
                  </h3>
                  <div className="text-xs text-slate-500 mt-1">
                    بناءً على متوسط درجات التقييمات والامتحانات المركزية
                  </div>
                  <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-3">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>{" "}
                      المتوسط القومي
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>{" "}
                      أعلى منطقة
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>{" "}
                      أقل منطقة
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
                  <div className="flex bg-slate-100/80 p-1 rounded-lg w-full sm:w-auto justify-between sm:justify-start">
                    {[
                      { id: "monthly", label: "شهري" },
                      { id: "term", label: "ترم" },
                      { id: "yearly", label: "سنوي" },
                    ].map((g) => (
                      <button
                        key={g.id}
                        onClick={() => setGranularity(g.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                          granularity === g.id
                            ? "bg-white text-slate-800 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex-1 w-full relative min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsLineChart
                    data={rechartsData}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorNational"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#6366f1"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#6366f1"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#E2E8F0"
                    />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                      domain={["dataMin - 5", "dataMax + 5"]}
                    />
                    <RechartsTooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="national"
                      name="المتوسط القومي"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: "#6366f1" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="topScore"
                      name="أعلى منطقة"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="bottomScore"
                      name="أقل منطقة"
                      stroke="#f43f5e"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                  </RechartsLineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Right Block: {t.subjectVulnerabilityList} */}
            <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm h-[380px] flex flex-col">
              <div className="mb-6">
                <h3 className="font-bold text-lg text-slate-900 leading-tight">
                  {t.subjectVulnerabilityList}
                </h3>
                <span className="text-[10px] text-slate-400">
                  {t.basedOnStateExams}
                </span>
              </div>

              <div className="flex-1 flex flex-col gap-6 justify-center">
                {/* Subject: Math */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-sm text-slate-800">
                      الرياضيات - ٢ إعدادي
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      65%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-1">
                    <div
                      className="bg-rose-500 h-2.5 rounded-full"
                      style={{ width: "65%" }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-sm text-red-600">
                      {t.criticalZoneAlWakrah}
                    </span>
                  </div>
                </div>

                {/* Subject: Science */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-sm text-slate-800">
                      العلوم - ١ ثانوي
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      72%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-1">
                    <div
                      className="bg-blue-500 h-2.5 rounded-full"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-sm text-orange-600 font-medium">
                      {t.lowestSuez}
                    </span>
                  </div>
                </div>

                {/* Subject: Arabic */}
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="font-bold text-sm text-slate-800">
                      اللغة العربية - ٤ ابتدائي
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      88%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mb-1">
                    <div
                      className="bg-emerald-500 h-2.5 rounded-full"
                      style={{ width: "88%" }}
                    ></div>
                  </div>
                  <div className="flex justify-end">
                    <span className="text-sm text-slate-500 font-medium">
                      {t.lowestAlRayyan}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 2: Regional Extremes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
            <div className="lg:col-span-12 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-end border-b border-slate-200 mb-6">
                <div className="pb-3">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-indigo-600"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    <h3 className="text-lg font-bold text-slate-800">
                      {t.nationalExtremes}
                    </h3>
                  </div>
                  <p className="text-sm text-slate-500 font-normal mt-1 pe-7">
                    نظرة مقارنة لأعلى وأدنى المناطق أداءً على مستوى الدولة
                  </p>
                </div>
                <div className="flex gap-6">
                  <button
                    onClick={() => setExtremeMode("passRates")}
                    className={`flex items-center gap-2 pb-3 border-b-2 font-medium text-sm transition-colors ${extremeMode === "passRates" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      ></path>
                    </svg>
                    {t.passRates}
                  </button>
                  <button
                    onClick={() => setExtremeMode("attendance")}
                    className={`flex items-center gap-2 pb-3 border-b-2 font-medium text-sm transition-colors ${extremeMode === "attendance" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      ></path>
                    </svg>
                    {t.attendance}
                  </button>
                </div>
              </div>

              {/* SECTION: Selected Data View */}
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                  {/* {t.top3Regions} */}
                  <div className="pe-0 md:pe-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {t.top3Regions}
                      </span>
                    </div>

                    {(extremeMode === "passRates"
                      ? [
                          {
                            name: t.tripoli,
                            score: 94,
                            insight: t.topSchoolAlFarouk,
                          },
                          {
                            name: t.misrata,
                            score: 88,
                            insight: t.topSchoolAlKhor,
                          },
                          {
                            name: t.zawiya,
                            score: 85,
                            insight: t.topSchoolUmmSalal,
                          },
                        ]
                      : [
                          {
                            name: t.benghazi,
                            score: 96,
                            insight: t.topSchoolAlRayyan,
                          },
                          {
                            name: t.tripoli,
                            score: 95,
                            insight: t.topSchoolCairo,
                          },
                          {
                            name: t.zliten,
                            score: 92,
                            insight: t.topSchoolMadinatAshShamal,
                          },
                        ]
                    ).map((region, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                          <span className="w-16 text-sm font-bold text-slate-800">
                            {region.name}
                          </span>
                          <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-emerald-500 h-3 rounded-full"
                              style={{ width: `${region.score}%` }}
                            ></div>
                          </div>
                          <span className="w-10 text-end text-sm font-bold text-slate-700">
                            {region.score}%
                          </span>
                        </div>
                        <div className="ms-20 text-[10px] text-slate-500">
                          {region.insight}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* {t.bottom3Regions} */}
                  <div className="pt-4 md:pt-0 ps-0 md:ps-4 flex flex-col gap-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                        {t.bottom3Regions}
                      </span>
                    </div>

                    {(extremeMode === "passRates"
                      ? [
                          {
                            name: t.sabha,
                            score: 42,
                            insight: t.lowestSouthDesert,
                          },
                          {
                            name: t.murzuq,
                            score: 48,
                            insight: t.lowestIsmailiaRural,
                          },
                          {
                            name: t.kufra,
                            score: 55,
                            insight: t.lowestSuezOasis,
                          },
                        ]
                      : [
                          {
                            name: t.ghat,
                            score: 65,
                            insight: t.lowestNewCairoAttendance,
                          },
                          { name: t.ubari, score: 68, insight: t.lowestAlRuwais },
                          { name: t.sabha, score: 71, insight: t.lowestAlWakrah },
                        ]
                    ).map((region, i) => (
                      <div key={i} className="flex flex-col gap-1">
                        <div className="flex items-center gap-4">
                          <span className="w-16 text-sm font-bold text-slate-800">
                            {region.name}
                          </span>
                          <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-rose-500 h-3 rounded-full"
                              style={{ width: `${region.score}%` }}
                            ></div>
                          </div>
                          <span className="w-10 text-end text-sm font-bold text-slate-700">
                            {region.score}%
                          </span>
                        </div>
                        <div className="ms-20 text-[10px] text-red-500/80">
                          {region.insight}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: {t.comprehensiveAssessmentEngine} */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col mt-6">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 text-slate-800">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold">
                    {t.comprehensiveAssessmentEngine}
                  </h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {t.drillDownPerformance}
                </p>
              </div>

              {/* Engine Controls */}
              <div className="flex flex-col gap-4">
                {/* Top Row: Underline Tabs */}
                <div className="flex border-b border-slate-200 mb-6 gap-8">
                  <button
                    onClick={() => setAssessmentMode("exams")}
                    className={`flex items-center gap-2 pb-3 border-b-2 text-sm transition-colors focus:outline-none ${assessmentMode === "exams" ? "border-indigo-600 text-indigo-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700 font-medium"}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      ></path>
                    </svg>
                    {t.stateExams}
                  </button>
                  <button
                    onClick={() => setAssessmentMode("lms")}
                    className={`flex items-center gap-2 pb-3 border-b-2 text-sm transition-colors focus:outline-none ${assessmentMode === "lms" ? "border-indigo-600 text-indigo-600 font-medium" : "border-transparent text-slate-500 hover:text-slate-700 font-medium"}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                    {t.lmsHomework}
                  </button>
                </div>

                {/* Bottom Row: Cascading Filters */}
                <div className="flex flex-wrap items-center gap-3">
                  <CustomDropdown
                    value={assessmentFilters.stage}
                    onChange={(val) =>
                      setAssessmentFilters({ ...assessmentFilters, stage: val })
                    }
                    options={[
                      { value: "all", label: t.selectStageEg },
                      { value: "elementary", label: t.elementary },
                      { value: "middle", label: t.middle },
                      { value: "high", label: t.highSchool },
                    ]}
                    placeholder={t.selectStageEg}
                  />
                  <CustomDropdown
                    value={assessmentFilters.grade}
                    onChange={(val) =>
                      setAssessmentFilters({ ...assessmentFilters, grade: val })
                    }
                    options={[
                      { value: "all", label: t.selectGradeEg },
                      { value: "7", label: t.grade7 },
                      { value: "8", label: t.grade8 },
                      { value: "9", label: t.grade9 },
                    ]}
                    placeholder={t.selectGradeEg}
                  />
                  <CustomDropdown
                    value={assessmentFilters.subject}
                    onChange={(val) =>
                      setAssessmentFilters({
                        ...assessmentFilters,
                        subject: val,
                      })
                    }
                    options={[
                      { value: "all", label: t.selectSubjectEg },
                      { value: "math", label: t.mathematics },
                      { value: "science", label: t.science },
                      { value: "arabic", label: t.arabicLanguage },
                      { value: "english", label: t.english },
                    ]}
                    placeholder={t.selectSubjectEg}
                  />
                  <CustomDropdown
                    value={assessmentFilters.status}
                    onChange={(val) =>
                      setAssessmentFilters({
                        ...assessmentFilters,
                        status: val,
                      })
                    }
                    options={[
                      { value: "all", label: t.statusAll },
                      { value: "excellent", label: t.statusExcellent },
                      {
                        value: "needs_attention",
                        label: t.statusNeedsAttention,
                      },
                      { value: "critical", label: t.statusCritical },
                    ]}
                    placeholder={t.statusAll}
                  />
                </div>
              </div>
            </div>

            {/* Drill-Down Data Matrix */}
            <div className="overflow-x-auto p-2">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold">
                      {t.colEntity}
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-end">
                      {t.totalEnrolled}
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      {t.submissionRate}
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      {t.passRate}
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      {t.failRate}
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold">
                      {t.status}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {qatariData.map((region, idx) => {
                    const isExpanded = expandedRegions.includes(region.id);
                    const regionData =
                      assessmentMode === "exams" ? region.exams : region.lms;
                    return (
                      <React.Fragment key={region.id}>
                        {/* Parent Region */}
                        <tr
                          onClick={() => toggleRegion(region.id)}
                          className={`cursor-pointer transition-colors ${isExpanded ? "bg-indigo-50/30" : "bg-slate-50 hover:bg-slate-100"}`}
                        >
                          <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500 flex items-center gap-2">
                            <ChevronDown
                              size={18}
                              className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "transform rotate-180" : ""}`}
                            />
                            {mapPinIcon}
                            {region.name}
                          </td>
                          <td className="py-4 px-4 font-mono font-medium text-slate-700 text-end">
                            {regionData.enrolled}
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-slate-700">
                            {regionData.submission}
                          </td>
                          <td className="py-4 px-4 text-center font-bold relative">
                            <span
                              className={getBadgeClasses(regionData.passColor)}
                            >
                              {regionData.pass}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-bold relative">
                            <span
                              className={getBadgeClasses(regionData.failColor)}
                            >
                              {regionData.fail}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide flex items-center w-fit ${regionData.statusColor}`}
                            >
                              {regionData.status}
                            </span>
                          </td>
                        </tr>

                        {/* Child Schools */}
                        {isExpanded &&
                          region.schools.map((school, sIdx) => {
                            const schoolData =
                              assessmentMode === "exams"
                                ? school.exams
                                : school.lms;
                            return (
                              <tr
                                key={school.id}
                                className="hover:bg-slate-50 transition-colors bg-white"
                              >
                                <td className="py-4 px-4 text-slate-700 ps-12 font-medium flex items-center gap-2">
                                  <span className="text-slate-300">↳</span>{" "}
                                  {school.name}
                                </td>
                                <td className="py-4 px-4 font-mono text-slate-600 text-end">
                                  {schoolData.enrolled}
                                </td>
                                <td className="py-4 px-4 text-center font-semibold text-slate-600">
                                  {schoolData.submission}
                                </td>
                                <td className="py-4 px-4 text-center font-semibold relative flex items-center justify-center gap-1">
                                  <span
                                    className={getBadgeClasses(
                                      schoolData.passColor,
                                    )}
                                  >
                                    {schoolData.pass}
                                  </span>
                                </td>
                                <td className="py-4 px-4 text-center font-semibold relative">
                                  <span
                                    className={getBadgeClasses(
                                      schoolData.failColor,
                                    )}
                                  >
                                    {schoolData.fail}
                                  </span>
                                </td>
                                <td className="py-4 px-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide flex items-center w-fit ${schoolData.statusColor}`}
                                  >
                                    {schoolData.status}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* New Section: {t.studentDemographicsTracking} */}
          <div className="mt-12 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-2 text-slate-800">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold">
                    {t.studentDemographicsTracking}
                  </h2>
                </div>
                <p className="text-sm text-slate-500 mt-1">
                  {t.distributionDesc}
                </p>
              </div>

              {/* Engine Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <button className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm flex items-center gap-2 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  <Calendar size={16} className="text-slate-500" />
                  {t.thisMonth}
                </button>
                <CustomDropdown
                  value={demoFilters.stage}
                  onChange={(val) =>
                    setDemoFilters({ ...demoFilters, stage: val })
                  }
                  options={[
                    { value: "all", label: t.selectStageEg },
                    { value: "elementary", label: t.elementary },
                    { value: "middle", label: t.middle },
                    { value: "high", label: t.highSchool },
                  ]}
                  placeholder={t.selectStageEg}
                />
                <CustomDropdown
                  value={demoFilters.grade}
                  onChange={(val) =>
                    setDemoFilters({ ...demoFilters, grade: val })
                  }
                  options={[
                    { value: "all", label: t.selectGradeEg },
                    { value: "7", label: t.grade7 },
                    { value: "8", label: t.grade8 },
                    { value: "9", label: t.grade9 },
                  ]}
                  placeholder={t.selectGradeEg}
                />
                <CustomDropdown
                  value={demoFilters.status}
                  onChange={(val) =>
                    setDemoFilters({ ...demoFilters, status: val })
                  }
                  options={[
                    { value: "all", label: t.statusAll },
                    { value: "critical", label: `${t.statusCritical} Absence` },
                    { value: "healthy", label: t.statusHealthy },
                  ]}
                  placeholder={t.statusAll}
                />
              </div>
            </div>

            {/* Drill-Down Demographics Matrix */}
            <div className="overflow-x-auto p-2">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold">
                      {t.colEntity}
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-end">
                      {t.totalEnrolled}
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold">
                      {t.genderDistribution}
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      {t.avgAttendanceRate}
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      {t.chronicAbsenteeism}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {demographicData.map((region) => {
                    const isExpanded = expandedDemoRegions.includes(region.id);
                    return (
                      <React.Fragment key={region.id}>
                        {/* Parent Region */}
                        <tr
                          onClick={() => toggleDemoRegion(region.id)}
                          className={`cursor-pointer transition-colors ${isExpanded ? "bg-indigo-50/30" : "bg-slate-50 hover:bg-slate-100"}`}
                        >
                          <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500 flex items-center gap-2">
                            <ChevronDown
                              size={18}
                              className={`text-slate-400 transition-transform duration-200 ${isExpanded ? "transform rotate-180" : ""}`}
                            />
                            {mapPinIcon}
                            {region.name}
                          </td>
                          <td className="py-4 px-4 font-mono font-medium text-slate-700 text-end">
                            {region.enrolled}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex w-32 h-2 rounded-full overflow-hidden bg-slate-100">
                              <div
                                className="bg-blue-500"
                                style={{ width: `${region.gender.boys}%` }}
                              ></div>
                              <div
                                className="bg-pink-500"
                                style={{ width: `${region.gender.girls}%` }}
                              ></div>
                            </div>
                            <div className="text-[11px] text-slate-500 mt-1 font-medium">
                              {region.gender.label}
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center font-bold">
                            <span
                              className={getBadgeClasses(
                                region.attendanceColor,
                              )}
                            >
                              {region.attendance}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-center font-bold">
                            <span
                              className={getBadgeClasses(region.chronicColor)}
                            >
                              {region.chronic}
                            </span>
                          </td>
                        </tr>

                        {/* Child Schools */}
                        {isExpanded &&
                          region.schools.map((school) => (
                            <tr
                              key={school.id}
                              className="hover:bg-slate-50 transition-colors bg-white"
                            >
                              <td className="py-4 px-4 text-slate-700 ps-12 font-medium flex items-center gap-2">
                                <span className="text-slate-300">↳</span>{" "}
                                {school.name}
                              </td>
                              <td className="py-4 px-4 font-mono text-slate-600 text-end">
                                {school.enrolled}
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex w-32 h-2 rounded-full overflow-hidden bg-slate-100">
                                  <div
                                    className="bg-blue-500"
                                    style={{ width: `${school.gender.boys}%` }}
                                  ></div>
                                  <div
                                    className="bg-pink-500"
                                    style={{ width: `${school.gender.girls}%` }}
                                  ></div>
                                </div>
                                <div className="text-[11px] text-slate-500 mt-1 font-medium">
                                  {school.gender.label}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center font-semibold">
                                <span
                                  className={getBadgeClasses(
                                    school.attendanceColor,
                                  )}
                                >
                                  {school.attendance}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-center font-semibold">
                                <span
                                  className={getBadgeClasses(
                                    school.chronicColor,
                                  )}
                                >
                                  {school.chronic}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Micro Data Grid 3: Extracurricular Engagement */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-slate-800">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold">
                    المشاركة في الأنشطة اللاصفية
                  </h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>{" "}
                  من: 1 مايو - إلى: 30 مايو
                </button>
                <CustomDropdown
                  value={activityFilters.stage}
                  onChange={(v) =>
                    setActivityFilters({ ...activityFilters, stage: v })
                  }
                  options={[{ value: "all", label: "كل المراحل" }]}
                  placeholder="المرحلة"
                />
                <CustomDropdown
                  value={activityFilters.type}
                  onChange={(v) =>
                    setActivityFilters({ ...activityFilters, type: v })
                  }
                  options={[
                    { value: "all", label: "كل الأنشطة" },
                    { value: "sports", label: "رياضة" },
                    { value: "tech", label: "تكنولوجيا" },
                  ]}
                  placeholder="نوع النشاط"
                />
              </div>
            </div>

            <div className="p-6 border-b border-slate-50">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                توزيع الأنشطة وطنياً
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-blue-200 transition-colors">
                  <span className="text-sm font-semibold text-blue-700 mb-2">
                    الرياضة
                  </span>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold text-blue-900">
                      40%
                    </span>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-blue-500 h-1.5 rounded-full"
                      style={{ width: "40%" }}
                    ></div>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-amber-200 transition-colors">
                  <span className="text-sm font-semibold text-amber-700 mb-2">
                    التكنولوجيا والبرمجة
                  </span>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold text-amber-900">
                      30%
                    </span>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full"
                      style={{ width: "30%" }}
                    ></div>
                  </div>
                </div>
                <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-purple-200 transition-colors">
                  <span className="text-sm font-semibold text-purple-700 mb-2">
                    الفنون
                  </span>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold text-purple-900">
                      20%
                    </span>
                  </div>
                  <div className="w-full bg-purple-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 shadow-sm flex flex-col justify-between hover:border-emerald-200 transition-colors">
                  <span className="text-sm font-semibold text-emerald-700 mb-2">
                    خدمة المجتمع
                  </span>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold text-emerald-900">
                      10%
                    </span>
                  </div>
                  <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-500 h-1.5 rounded-full"
                      style={{ width: "10%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Table */}
            <div className="overflow-x-auto p-2">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-xs tracking-wider text-slate-500 uppercase font-semibold">
                      الجهة
                    </th>
                    <th className="py-3 px-6 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      إجمالي المشاركين
                    </th>
                    <th className="py-3 px-6 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      النشاط الطاغي
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {extracurricularData.map((reg) => {
                    const isExpanded = expandedActivity.includes(reg.id);
                    return (
                      <React.Fragment key={reg.id}>
                        <tr
                          onClick={() => toggleActivity(reg.id)}
                          className={`cursor-pointer transition-colors ${isExpanded ? "bg-indigo-50/30" : "bg-slate-50 hover:bg-slate-100"}`}
                        >
                          <td className="py-4 px-6 font-bold text-slate-900 border-s-4 border-indigo-500 flex items-center gap-2">
                            <ChevronDown
                              size={18}
                              className={`text-slate-400 transition-transform ${isExpanded ? "transform rotate-180" : ""}`}
                            />
                            {mapPinIcon} {reg.name}
                          </td>
                          <td className="py-4 px-6 font-mono font-medium text-slate-600 text-center">
                            {reg.totalParticipants.toLocaleString()}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <span
                              className={`px-3 py-1.5 rounded-full text-xs font-bold border ${reg.dominantColor}`}
                            >
                              {reg.dominantActivity}
                            </span>
                          </td>
                        </tr>
                        {isExpanded &&
                          reg.schools.map((sch) => (
                            <tr
                              key={sch.id}
                              className="hover:bg-slate-50 transition-colors bg-white"
                            >
                              <td className="py-3 px-6 text-slate-700 ps-14 font-medium flex items-center gap-2">
                                <span className="text-slate-300">↳</span>{" "}
                                {sch.name}
                              </td>
                              <td className="py-3 px-6 font-mono text-slate-500 text-center">
                                {sch.totalParticipants.toLocaleString()}
                              </td>
                              <td className="py-3 px-6 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${sch.dominantColor}`}
                                >
                                  {sch.dominantActivity}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          {/* Micro Data Grid 1: Curriculum Progress Tracker */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-slate-800">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <h2 className="text-xl font-bold">متابعة إنجاز المنهج</h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>{" "}
                  من: 1 مايو - إلى: 30 مايو
                </button>
                <CustomDropdown
                  value={curriculumFilters.stage}
                  onChange={(v) =>
                    setCurriculumFilters({ ...curriculumFilters, stage: v })
                  }
                  options={[
                    { value: "all", label: "كل المراحل" },
                    { value: "elementary", label: "الابتدائي" },
                    { value: "middle", label: "الإعدادي" },
                    { value: "high", label: "الثانوي" },
                  ]}
                  placeholder="المرحلة"
                />
                <CustomDropdown
                  value={curriculumFilters.grade}
                  onChange={(v) =>
                    setCurriculumFilters({ ...curriculumFilters, grade: v })
                  }
                  options={[{ value: "all", label: "كل الصفوف" }]}
                  placeholder="الصف"
                />
                <CustomDropdown
                  value={curriculumFilters.subject}
                  onChange={(v) =>
                    setCurriculumFilters({ ...curriculumFilters, subject: v })
                  }
                  options={[
                    { value: "all", label: "كل المواد" },
                    { value: "math", label: "رياضيات" },
                    { value: "science", label: "علوم" },
                  ]}
                  placeholder="المادة"
                />
              </div>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold">
                      الجهة
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      المستهدف الزمني
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      الإنجاز الفعلي
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      حالة الإنجاز
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {curriculumData.map((reg) => {
                    const isExpanded = expandedCurriculum.includes(reg.id);
                    return (
                      <React.Fragment key={reg.id}>
                        <tr
                          onClick={() => toggleCurriculum(reg.id)}
                          className={`cursor-pointer transition-colors ${isExpanded ? "bg-indigo-50/30" : "bg-slate-50 hover:bg-slate-100"}`}
                        >
                          <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500 flex items-center gap-2">
                            <ChevronDown
                              size={18}
                              className={`text-slate-400 transition-transform ${isExpanded ? "transform rotate-180" : ""}`}
                            />
                            {mapPinIcon} {reg.name}
                          </td>
                          <td className="py-4 px-4 text-center font-medium text-slate-600">
                            {reg.target}
                          </td>
                          <td className="py-4 px-4 text-center font-bold text-slate-800">
                            {reg.actual}
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-bold ${reg.statusColor}`}
                            >
                              {reg.status}
                            </span>
                          </td>
                        </tr>
                        {isExpanded &&
                          reg.schools.map((sch) => (
                            <tr
                              key={sch.id}
                              className="hover:bg-slate-50 transition-colors bg-white"
                            >
                              <td className="py-3 px-4 text-slate-700 ps-12 font-medium flex items-center gap-2">
                                <span className="text-slate-300">↳</span>{" "}
                                {sch.name}
                              </td>
                              <td className="py-3 px-4 text-center text-slate-500">
                                {sch.target}
                              </td>
                              <td className="py-3 px-4 text-center font-semibold text-slate-700">
                                {sch.actual}
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${sch.statusColor}`}
                                >
                                  {sch.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Micro Data Grid 2: Virtual Classes Operations */}
          <div className="mt-16 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <div>
                <div className="flex items-center gap-2 text-slate-800">
                  <svg
                    className="w-6 h-6 text-indigo-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <h2 className="text-xl font-bold">عمليات الحصص الافتراضية</h2>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-lg px-3 py-1.5 text-sm text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
                  <svg
                    className="w-4 h-4 text-slate-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    ></path>
                  </svg>{" "}
                  من: 1 مايو - إلى: 30 مايو
                </button>
                <CustomDropdown
                  value={virtualFilters.stage}
                  onChange={(v) =>
                    setVirtualFilters({ ...virtualFilters, stage: v })
                  }
                  options={[
                    { value: "all", label: "كل المراحل" },
                    { value: "high", label: "الثانوي" },
                  ]}
                  placeholder="المرحلة"
                />
                <CustomDropdown
                  value={virtualFilters.grade}
                  onChange={(v) =>
                    setVirtualFilters({ ...virtualFilters, grade: v })
                  }
                  options={[{ value: "all", label: "كل الصفوف" }]}
                  placeholder="الصف"
                />
              </div>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-start border-collapse">
                <thead className="bg-slate-50/70 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold">
                      الجهة
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-end">
                      الحصص المجدولة
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-end">
                      الحصص المنفذة
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold">
                      متوسط الحضور
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      تقييم التفاعل
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {virtualClassesData.map((reg) => {
                    const isExpanded = expandedVirtual.includes(reg.id);
                    return (
                      <React.Fragment key={reg.id}>
                        <tr
                          onClick={() => toggleVirtual(reg.id)}
                          className={`cursor-pointer transition-colors ${isExpanded ? "bg-indigo-50/30" : "bg-slate-50 hover:bg-slate-100"}`}
                        >
                          <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500 flex items-center gap-2">
                            <ChevronDown
                              size={18}
                              className={`text-slate-400 transition-transform ${isExpanded ? "transform rotate-180" : ""}`}
                            />
                            {mapPinIcon} {reg.name}
                          </td>
                          <td className="py-4 px-4 font-mono font-medium text-slate-600 text-end">
                            {reg.scheduled}
                          </td>
                          <td className="py-4 px-4 font-mono font-bold text-indigo-700 text-end">
                            {reg.executed}
                          </td>
                          <td className="py-4 px-4 relative">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${reg.attendance}%` }}
                                ></div>
                              </div>
                              <span className="text-xs font-bold w-8">
                                {reg.attendance}%
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-center">
                            <span className="text-slate-500 font-medium">
                              {reg.interaction}%
                            </span>
                          </td>
                        </tr>
                        {isExpanded &&
                          reg.schools.map((sch) => (
                            <tr
                              key={sch.id}
                              className="hover:bg-slate-50 transition-colors bg-white"
                            >
                              <td className="py-3 px-4 text-slate-700 ps-12 font-medium flex items-center gap-2">
                                <span className="text-slate-300">↳</span>{" "}
                                {sch.name}
                              </td>
                              <td className="py-3 px-4 font-mono text-slate-500 text-end">
                                {sch.scheduled}
                              </td>
                              <td className="py-3 px-4 font-mono font-semibold text-slate-700 text-end">
                                {sch.executed}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-blue-400 h-1.5 rounded-full"
                                      style={{ width: `${sch.attendance}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-xs font-semibold text-slate-600 w-8">
                                    {sch.attendance}%
                                  </span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center text-slate-400 text-sm">
                                {sch.interaction}%
                              </td>
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === "hr" && (
        <>
          {/* Top Level: Executive KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  إجمالي القوة العاملة
                </span>
                <div className="p-2.5 bg-indigo-50 rounded-xl">
                  <Briefcase size={20} className="text-indigo-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  185,400
                </p>
                <div className="flex w-full h-1.5 rounded-full overflow-hidden mt-3 mb-1">
                  <div className="bg-indigo-500 w-[80%]"></div>
                  <div className="bg-slate-300 w-[20%]"></div>
                </div>
                <div className="flex justify-between text-[10px] font-semibold">
                  <span className="text-indigo-600">80% معلمون</span>
                  <span className="text-slate-500">20% إداريون</span>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  نسبة الطلاب للمعلمين
                </span>
                <div className="p-2.5 bg-rose-50 rounded-xl">
                  <Users size={20} className="text-rose-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  28:1
                </p>
                <div className="mt-3 relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 right-0 h-full bg-rose-500 w-[90%] rounded-full"></div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] font-bold">
                  <span className="text-rose-600">المتوسط الحالي</span>
                  <span className="text-emerald-600">الهدف 25:1</span>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  نسبة الحضور اليومي للموظفين
                </span>
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <Activity size={20} className="text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  96.5%
                </p>
                <div className="mt-3 relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 right-0 h-full bg-emerald-500 w-[96.5%] rounded-full"></div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] font-bold">
                  <span className="text-emerald-600">نسبة حضور المعلمين: 96.5%</span>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  خطر تقاعد الكوادر
                </span>
                <div className="p-2.5 bg-amber-50 rounded-xl">
                  <AlertTriangle size={20} className="text-amber-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  18%
                </p>
                <div className="mt-3 relative w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="absolute top-0 right-0 h-full bg-amber-500 w-[18%] rounded-full"></div>
                </div>
                <div className="flex justify-between mt-1 text-[10px] font-bold">
                  <span className="text-amber-600 font-medium">كوادر تتجاوز 55 عاماً تتقاعد خلال 5 سنوات</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mid Level: Strategic Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Left Chart: Age Demographics */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
              <h3 className="font-bold text-lg text-slate-900 mb-6">
                التركيبة العمرية للكوادر
              </h3>
              <div className="flex-1 flex flex-col justify-center gap-5">
                {[
                  { label: "20-30 سنة", percent: "15%", bg: "bg-indigo-400", width: "15%" },
                  { label: "31-45 سنة", percent: "45%", bg: "bg-indigo-500", width: "45%" },
                  { label: "46-55 سنة", percent: "22%", bg: "bg-indigo-400", width: "22%" },
                  { label: "تجاوز 55 سنة", percent: "18%", bg: "bg-rose-500", width: "18%" }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center w-full">
                    <span className="text-[12px] text-slate-600 font-semibold w-24 text-right">{item.label}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full mx-3 overflow-hidden flex">
                      <div className={`${item.bg} h-full rounded-full`} style={{ width: item.width }}></div>
                    </div>
                    <span className="text-[12px] font-bold text-slate-700 w-10 text-left">{item.percent}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Chart: Subject Deficit vs Surplus */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
              <h3 className="font-bold text-lg text-slate-900 mb-6">
                العجز والفائض حسب المادة
              </h3>
              <div className="flex-1 flex flex-col justify-center gap-6">
                {/* Math Deficit */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-800">
                      الرياضيات
                    </span>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <span dir="ltr">-1,200</span>
                      <span>معلم</span>
                    </span>
                  </div>
                  <div className="w-full flex h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
                    {/* Center line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 z-10"></div>
                    {/* Deficit bar (goes left from center) */}
                    <div className="w-1/2 flex justify-end h-full">
                      <div className="bg-rose-500 h-full w-[80%]"></div>
                    </div>
                    {/* Surplus side empty */}
                    <div className="w-1/2 h-full"></div>
                  </div>
                </div>

                {/* Science Deficit */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-800">
                      العلوم
                    </span>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <span dir="ltr">-450</span>
                      <span>معلم</span>
                    </span>
                  </div>
                  <div className="w-full flex h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 z-10"></div>
                    <div className="w-1/2 flex justify-end h-full">
                      <div className="bg-amber-400 h-full w-[30%]"></div>
                    </div>
                    <div className="w-1/2 h-full"></div>
                  </div>
                </div>

                {/* Arabic Language Surplus */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-slate-800">
                      اللغة العربية
                    </span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                      <span dir="ltr">+800</span>
                      <span>معلم (فائض)</span>
                    </span>
                  </div>
                  <div className="w-full flex h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100 relative">
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 z-10"></div>
                    <div className="w-1/2 h-full"></div>
                    {/* Surplus bar (goes right from center) */}
                    <div className="w-1/2 flex justify-start h-full">
                      <div className="bg-emerald-500 h-full w-[60%]"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Level: HR Drill-Down Engine */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col gap-6">
              <div>
                <h3 className="font-bold text-xl text-slate-800">
                  مصفوفة توزيع الكوادر البشرية
                </h3>
              </div>

              {/* Engine Filters */}
              <div className="flex flex-wrap items-center gap-3">
                <button className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm flex items-center gap-2 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors shadow-sm">
                  <Calendar size={16} className="text-slate-500" />
                  هذا الشهر
                </button>
                <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium">
                  <option>المنطقة</option>
                  <option>القاهرة</option>
                  <option>الإسكندرية</option>
                </select>
                <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium">
                  <option>اختر المدرسة</option>
                  <option>جميع المدارس</option>
                </select>
                <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium">
                  <option>اختر المادة</option>
                  <option>الرياضيات</option>
                  <option>العلوم</option>
                  <option>اللغة العربية</option>
                </select>
                <select className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700 font-medium">
                  <option>جميع الأدوار</option>
                  <option>معلم</option>
                  <option>إداري</option>
                </select>
              </div>
            </div>

            {/* Matrix Table */}
            <div className="overflow-x-auto p-2">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">
                      الكيان
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-end">
                      إجمالي الكادر
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">
                      التصنيف
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      نسبة الطلاب للمعلمين
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-center">
                      الحضور
                    </th>
                    <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">
                      الحالة
                    </th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  <tr className="bg-slate-50 hover:bg-slate-100 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500">
                      القاهرة
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-700 text-end">
                      15,200
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex w-32 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 w-[80%]"></div>
                        <div className="bg-slate-400 w-[20%]"></div>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-medium">
                        80% معلمون، 20% إداريون
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-emerald-600">
                      1:22
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700">
                      97%
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                        متوازن
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-slate-50 hover:bg-slate-100 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500">
                      الإسكندرية
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-700 text-end">
                      12,450
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex w-32 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 w-[82%]"></div>
                        <div className="bg-slate-400 w-[18%]"></div>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-medium">
                        82% معلمون، 18% إداريون
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-emerald-600">
                      1:24
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700">
                      95%
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-emerald-100 text-emerald-700">
                        مثالي
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-slate-50 hover:bg-slate-100 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500">
                      المنصورة
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-700 text-end">
                      8,300
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex w-32 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 w-[78%]"></div>
                        <div className="bg-slate-400 w-[22%]"></div>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-medium">
                        78% معلمون، 22% إداريون
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-800">
                      1:28
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700">
                      93%
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-blue-50 text-blue-600">
                        مستقر
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-slate-50 hover:bg-slate-100 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500">
                      الجبل الأخضر
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-700 text-end">
                      5,200
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex w-32 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-500 w-[70%]"></div>
                        <div className="bg-slate-400 w-[30%]"></div>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-medium">
                        70% معلمون، 30% إداريون
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-amber-500">
                      1:35
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700">
                      90%
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-amber-50 text-amber-600">
                        تنبيه
                      </span>
                    </td>
                  </tr>

                  <tr className="bg-slate-50 hover:bg-slate-100 transition-colors">
                    <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500">
                      الإسكندرية
                    </td>
                    <td className="py-4 px-4 font-mono font-medium text-slate-700 text-end">
                      4,100
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex w-32 h-2 rounded-full overflow-hidden">
                        <div className="bg-rose-500 w-[60%]"></div>
                        <div className="bg-slate-400 w-[40%]"></div>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 font-medium">
                        60% معلمون، 40% إداريون
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-red-600">
                      1:45
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-slate-700">
                      88%
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wide bg-red-50 text-red-600">
                        عجز حرج
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom section: Live Operations */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-2">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-lg text-slate-900">العمليات والإجراءات الحية</h3>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-full">
                <button
                  onClick={() => setHrOpsTab('مباشرة')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                    hrOpsTab === 'مباشرة'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${hrOpsTab === 'مباشرة' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}
                  ></span>
                  مباشرة
                </button>
                <button
                  onClick={() => setHrOpsTab('حديثاً')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                    hrOpsTab === 'حديثاً'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${hrOpsTab === 'حديثاً' ? 'bg-slate-500' : 'bg-slate-300'}`}
                  ></span>
                  حديثاً
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
              {hrOpsTab === 'مباشرة' ? (
                <>
                  {[
                    {
                      title: 'إعتماد حركة الترقيات السنوية',
                      desc: 'جاري مراجعة واعتماد كشوفات المستحقين للترقية لعام 2026.',
                      time: 'مباشرة',
                      icon: Award,
                      isLive: true
                    },
                    {
                      title: 'توزيع التعيينات الجديدة',
                      desc: 'بدء توجيه وتسكين الملاكات الوظيفية الجديدة في مراكز العمل.',
                      time: 'مباشرة',
                      icon: UserPlus,
                      isLive: true
                    },
                    {
                      title: 'ندب عاجل لمعلمي الرياضيات',
                      desc: 'تفعيل أوامر نقل مؤقتة وتغطية عجز طارئ لمادتي العلوم والرياضيات.',
                      time: 'مباشرة',
                      icon: Users,
                      isLive: true
                    },
                    {
                      title: 'تحديث بيانات الملاك الوظيفي',
                      desc: 'تحديث بيانات وسجلات العاملين بالكامل في قاعدة البيانات المركزية.',
                      time: 'مباشرة',
                      icon: RefreshCw,
                      isLive: true
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-slate-400"> <item.icon size={20} strokeWidth={1.5} /> </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{item.time}</span>
                          <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-red-100 tracking-wider">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> LIVE
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors">عرض التفاصيل</button>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    {
                      title: 'أرشفة ملفات التقاعد للربع الحالي',
                      desc: 'اكتملت أرشفة وتسوية المعاملات المالية والعوائد للمتقاعدين.',
                      time: 'منذ 3 ساعات',
                      icon: Archive,
                      isLive: false
                    },
                    {
                      title: 'صرف حوافز المناطق النائية',
                      desc: 'تم صرف العلاوات المالية وتوزيعها لمستحقيها عبر الحسابات البنكية.',
                      time: 'منذ 4 ساعات',
                      icon: Banknote,
                      isLive: false
                    },
                    {
                      title: 'اعتماد الإجازات الطارئة',
                      desc: 'معالجة كافة طلبات الإجازات وتسوية الحصص وساعات العمل.',
                      time: 'منذ 8 ساعات',
                      icon: CheckCircle,
                      isLive: false
                    },
                    {
                      title: 'دورة تدريبية للإداريين',
                      desc: 'تخريج واعتماد مشاركي برنامج التأهيل الإداري للوكلاء.',
                      time: 'منذ 24 ساعة',
                      icon: BookOpen,
                      isLive: false
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-slate-400"> <item.icon size={20} strokeWidth={1.5} /> </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{item.time}</span>
                          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">RECENT</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors">عرض التفاصيل</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "infrastructure" && (
        <>
          {/* Top Row: Infrastructure & Assets KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Card 1 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  المدارس والفصول
                </span>
                <div className="p-2.5 bg-indigo-50 rounded-xl">
                  <Building size={20} className="text-indigo-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  4,120 <span className="text-lg text-slate-500 font-medium">مدرسة</span>
                </p>
                <p className="text-xs mt-3 font-semibold text-slate-500">
                  إجمالي السعة: 115 ألف فصل دراسي
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  البنية التحتية الرقمية
                </span>
                <div className="p-2.5 bg-blue-50 rounded-xl">
                  <Monitor size={20} className="text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  820K
                </p>
                <p className="text-xs mt-3 font-semibold text-slate-500">
                  إجمالي الأجهزة التعليمية الموزعة
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  الفصول الذكية
                </span>
                <div className="p-2.5 bg-fuchsia-50 rounded-xl">
                  <Presentation size={20} className="text-fuchsia-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  45%
                </p>
                <p className="text-xs mt-3 font-semibold text-slate-500">
                  نسبة التغطية الوطنية للسبورات الذكية
                </p>
              </div>
            </div>

            {/* Card 4: Structural Condition */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  السلامة الإنشائية
                </span>
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <ShieldCheck size={20} className="text-emerald-600" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight">
                  82%
                </p>
                <p className="text-xs mt-3 font-semibold text-slate-500">
                  نسبة المباني الآمنة ولا تحتاج صيانة عاجلة
                </p>
              </div>
            </div>
          </div>

          {/* Expanded Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Chart 1: Device Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
              <h3 className="font-bold text-lg text-slate-900 mb-6">
                توزيع الأجهزة
              </h3>
              <div className="flex-1 flex flex-col justify-center gap-7">
                {[
                  { label: "أجهزة لوحية (Tablets)", percent: "55%", width: "55%", bg: "bg-indigo-600" },
                  { label: "حواسيب (PCs)", percent: "30%", width: "30%", bg: "bg-slate-500" },
                  { label: "سبورات تفاعلية (Whiteboards)", percent: "15%", width: "15%", bg: "bg-blue-400" }
                ].map((item, idx) => (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[13px] text-slate-700 font-bold">{item.label}</span>
                       <span className="text-[12px] font-bold text-slate-500">{item.percent}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className={`${item.bg} h-full rounded-full`} style={{ width: item.width }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chart 2: Structural Condition */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
              <h3 className="font-bold text-lg text-slate-900 mb-6">
                الحالة الإنشائية
              </h3>
              <div className="flex-1 flex flex-col justify-center gap-7">
                {[
                  { label: "ممتاز (حديث/مجدد)", percent: "45%", width: "45%", bg: "bg-emerald-500" },
                  { label: "جيد (صيانة دورية)", percent: "37%", width: "37%", bg: "bg-emerald-400" },
                  { label: "يحتاج صيانة شاملة", percent: "18%", width: "18%", bg: "bg-amber-400" }
                ].map((item, idx) => (
                  <div key={idx} className="w-full">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[13px] text-slate-700 font-bold">{item.label}</span>
                       <span className="text-[12px] font-bold text-slate-500">{item.percent}</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden flex">
                      <div className={`${item.bg} h-full rounded-full`} style={{ width: item.width }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="health-sports-section bg-white rounded-xl p-6 border border-slate-200 mt-6 w-full" dir="rtl">
            <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
              <h3 className="text-xl font-bold text-slate-900">مؤشر جاهزية مرافق الصحة والرياضة</h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                  <span className="text-sm font-semibold text-slate-700">جاهزة تماماً</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-sm font-semibold text-slate-700">تحتاج صيانة</span>
                 </div>
                 <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <span className="text-sm font-semibold text-slate-700">عجز حرج</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { 
                  title: "المدارس الابتدائية", 
                  percent: "85%", 
                  readyDash: "213.6 251.3", readyOffset: "0",
                  maintDash: "25.1 251.3", maintOffset: "-213.6",
                  defDash: "12.6 251.3", defOffset: "-238.7",
                  statusBadge: <div className="bg-emerald-100 text-emerald-800 font-bold p-2 rounded-lg mt-4 w-full max-w-[280px] text-center">وضع مستقر</div>,
                  dist: "التوزيع: 60% ملاعب | 40% عيادات"
                },
                { 
                  title: "المدارس الإعدادية", 
                  percent: "65%", 
                  readyDash: "163.3 251.3", readyOffset: "0",
                  maintDash: "62.8 251.3", maintOffset: "-163.3",
                  defDash: "25.1 251.3", defOffset: "-226.2",
                  statusBadge: <div className="bg-amber-100 text-amber-800 font-bold p-2 rounded-lg mt-4 w-full max-w-[280px] text-center">يتطلب متابعة</div>,
                  dist: "التوزيع: 60% ملاعب | 40% عيادات"
                },
                { 
                  title: "المدارس الثانوية", 
                  percent: "45%", 
                  readyDash: "113.1 251.3", readyOffset: "0",
                  maintDash: "75.4 251.3", maintOffset: "-113.1",
                  defDash: "62.8 251.3", defOffset: "-188.5",
                  statusBadge: <div className="bg-rose-100 text-rose-800 font-bold p-2 rounded-lg mt-4 w-full max-w-[280px] text-center">تدخل عاجل</div>,
                  dist: "التوزيع: 60% ملاعب | 40% عيادات"
                }
              ].map((stage, idx) => (
                <div key={idx} className="flex flex-col items-center">
                  <div className="relative w-40 h-40 mx-auto mb-6">
                    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                      {/* Background Track */}
                      <circle cx="50" cy="50" r="40" fill="transparent" className="stroke-slate-100" strokeWidth="12" />
                      {/* Ready (جاهزة) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" className="stroke-emerald-400" strokeWidth="12" strokeDasharray={stage.readyDash} strokeDashoffset={stage.readyOffset} strokeLinecap="round" />
                      {/* Maintenance (تحتاج صيانة) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" className="stroke-amber-400" strokeWidth="12" strokeDasharray={stage.maintDash} strokeDashoffset={stage.maintOffset} strokeLinecap="round" />
                      {/* Deficit (عجز حرج) */}
                      <circle cx="50" cy="50" r="40" fill="transparent" className="stroke-rose-400" strokeWidth="12" strokeDasharray={stage.defDash} strokeDashoffset={stage.defOffset} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800 font-sans">{stage.percent}</span>
                      <span className="text-sm text-slate-500 font-semibold mt-0.5">جاهزية</span>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-center text-slate-800">{stage.title}</h4>
                  
                  {stage.statusBadge}
                  
                  <p className="text-xs text-slate-500 font-medium mt-3 bg-slate-50 px-3 py-1.5 rounded-md border border-slate-100">{stage.dist}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Classroom Distribution & Capacity Section */}
          <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm mt-6 w-full" dir="rtl">
            {/* Header & Identity Bar */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between md:items-end mb-4 gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">توزيع الفصول والكثافة الاستيعابية</h3>
                  <p className="text-sm font-medium text-slate-500 mt-1">نظرة شاملة لواقع الفصول الدراسية وتوزيعها بين القطاعين</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <Building className="w-5 h-5 text-indigo-600" />
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500">حكومي</span>
                        <span className="text-sm font-bold text-slate-800">98K فصل (85%)</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Building className="w-5 h-5 text-slate-400" />
                     <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-500">خاص</span>
                        <span className="text-sm font-bold text-slate-800">17K فصل (15%)</span>
                     </div>
                  </div>
                </div>
              </div>
              {/* Identity Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                <div className="bg-indigo-600 h-full" style={{ width: '85%' }}></div>
                <div className="bg-slate-300 h-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            {/* Grid of 3 Stage Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="font-bold text-lg text-slate-800">المرحلة الابتدائية</h4>
                    <div className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">يحتاج تدخل عاجل</div>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-3xl font-bold text-slate-900">65K <span className="text-sm text-slate-500 font-medium">فصل</span></span>
                      <span className="font-bold text-rose-600 text-sm">15% عجز/ازدحام حرج</span>
                    </div>
                    <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                       <div className="bg-rose-500 h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between mt-auto">
                   <span className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Users className="w-4 h-4" /> مؤشر الاستقرار</span>
                   <span className="text-sm font-bold text-rose-600">الوضع: عجز وفجوة</span>
                </div>
              </div>

              {/* Middle */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="font-bold text-lg text-slate-800">المرحلة الإعدادية</h4>
                    <div className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">يتطلب متابعة</div>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-3xl font-bold text-slate-900">30K <span className="text-sm text-slate-500 font-medium">فصل</span></span>
                      <span className="font-bold text-amber-600 text-sm">25% متوسط الازدحام</span>
                    </div>
                    <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                       <div className="bg-amber-500 h-full rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between mt-auto">
                   <span className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Users className="w-4 h-4" /> مؤشر الاستقرار</span>
                   <span className="text-sm font-bold text-amber-600">الوضع: ضغط جزئي</span>
                </div>
              </div>

              {/* High */}
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="font-bold text-lg text-slate-800">المرحلة الثانوية</h4>
                    <div className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">مثالي</div>
                  </div>
                  <div className="mb-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-3xl font-bold text-slate-900">20K <span className="text-sm text-slate-500 font-medium">فصل</span></span>
                      <span className="font-bold text-emerald-600 text-sm">60% مثالي</span>
                    </div>
                    <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                       <div className="bg-emerald-500 h-full rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between mt-auto">
                   <span className="text-sm font-semibold text-slate-600 flex items-center gap-2"><Users className="w-4 h-4" /> مؤشر الاستقرار</span>
                   <span className="text-sm font-bold text-emerald-600">الوضع: مستقر</span>
                </div>
              </div>
            </div>
          </div>

          {/* Matrix Section: Regional Infrastructure Table */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col gap-6">
              <div className="flex flex-col gap-6">
                <h3 className="font-bold text-xl text-slate-800">
                  تفاصيل البنية التحتية والموارد
                </h3>
                <div className="flex gap-8 border-b border-slate-200">
                  {[
                    { id: 'technology', label: 'التكنولوجيا والإنترنت' },
                    { id: 'buildings', label: 'الحالة الإنشائية والمباني' },
                    { id: 'teachers', label: 'تغطية الفصول والمعلمين' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setTableTab(tab.id as any)}
                      className={`pb-3 text-sm transition-all relative ${
                        tableTab === tab.id
                          ? 'font-bold text-indigo-600 border-b-2 border-indigo-600'
                          : 'font-medium text-slate-500 hover:text-slate-700 hover:border-b-2 hover:border-slate-300'
                      } -mb-[1px]`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-x-auto p-2">
              <table className="w-full text-start border-collapse text-right">
                <thead>
                  {tableTab === 'technology' && (
                    <tr>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">الكيان</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">تغطية الإنترنت (%)</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">الأجهزة الموزعة</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">السبورات الذكية</th>
                    </tr>
                  )}
                  {tableTab === 'buildings' && (
                    <tr>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">الكيان</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">إجمالي المدارس</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">حالة آمنة</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">صيانة دورية</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">تدخل حرج</th>
                    </tr>
                  )}
                  {tableTab === 'teachers' && (
                    <tr>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">الكيان</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">كثافة الفصول</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">نسبة طالب/معلم</th>
                      <th className="py-3 px-4 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">حالة التغطية</th>
                    </tr>
                  )}
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {[
                    { region: "القاهرة", tech: { net: "92%", dev: "280K", smart: "75%" }, bldg: { total: "1,240", safe: "800", maint: "390", crit: "50" }, teach: { density: "32 طالب/فصل", ratio: "1:15", status: "مكتفي", statusBg: "bg-emerald-100 text-emerald-700" } },
                    { region: "الإسكندرية", tech: { net: "85%", dev: "190K", smart: "60%" }, bldg: { total: "980", safe: "600", maint: "320", crit: "60" }, teach: { density: "35 طالب/فصل", ratio: "1:18", status: "مكتفي", statusBg: "bg-emerald-100 text-emerald-700" } },
                    { region: "المنصورة", tech: { net: "88%", dev: "120K", smart: "65%" }, bldg: { total: "720", safe: "450", maint: "230", crit: "40" }, teach: { density: "30 طالب/فصل", ratio: "1:14", status: "جيد", statusBg: "bg-blue-100 text-blue-700" } },
                    { region: "الجبل الأخضر", tech: { net: "54%", dev: "90K", smart: "25%" }, bldg: { total: "650", safe: "300", maint: "250", crit: "100" }, teach: { density: "40 طالب/فصل", ratio: "1:25", status: "عجز متوسط", statusBg: "bg-amber-100 text-amber-700" } },
                    { region: "الإسكندرية", tech: { net: "40%", dev: "60K", smart: "15%" }, bldg: { total: "530", safe: "200", maint: "200", crit: "130" }, teach: { density: "45 طالب/فصل", ratio: "1:30", status: "عجز حاد", statusBg: "bg-rose-100 text-rose-700" } }
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="py-4 px-4 font-bold text-slate-900 border-s-4 border-indigo-500">
                        {row.region}
                      </td>
                      
                      {tableTab === 'technology' && (() => {
                        const netVal = parseInt(row.tech.net);
                        let netColorClass = 'bg-emerald-500';
                        let netTextClass = 'text-emerald-700';
                        if (netVal < 50) {
                          netColorClass = 'bg-rose-500';
                          netTextClass = 'text-rose-700';
                        } else if (netVal <= 80) {
                          netColorClass = 'bg-amber-500';
                          netTextClass = 'text-amber-700';
                        }
                        
                        const smartVal = parseInt(row.tech.smart);
                        let smartBadgeText = 'تغطية ممتازة';
                        let smartBadgeClass = 'bg-emerald-50 text-emerald-700';
                        if (smartVal <= 25) {
                          smartBadgeText = 'تغطية ضعيفة';
                          smartBadgeClass = 'bg-amber-50 text-amber-700';
                        }
                        if (smartVal <= 15) {
                          smartBadgeText = 'عجز تقني';
                          smartBadgeClass = 'bg-rose-50 text-rose-700';
                        }
                        
                        const devVal = parseInt(row.tech.dev);
                        let devPillClass = 'text-emerald-700 bg-emerald-50';
                        if (devVal < 90) {
                          devPillClass = 'text-rose-700 bg-rose-50';
                        } else if (devVal < 120) {
                          devPillClass = 'text-amber-700 bg-amber-50';
                        }

                        return (
                          <>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div className={`h-full ${netColorClass}`} style={{ width: row.tech.net }}></div>
                                </div>
                                <span className={`font-bold ${netTextClass}`}>{row.tech.net}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-baseline gap-1">
                                <span className={`font-bold px-2 py-0.5 rounded-md ${devPillClass}`}>{row.tech.dev}</span>
                                <span className="text-xs text-slate-400">جهاز</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <span className="font-bold text-slate-700 w-10">{row.tech.smart}</span>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${smartBadgeClass}`}>{smartBadgeText}</span>
                              </div>
                            </td>
                          </>
                        );
                      })()}

                      {tableTab === 'buildings' && (
                        <>
                          <td className="py-4 px-4 font-medium text-slate-700 font-mono">{row.bldg.total}</td>
                          <td className="py-4 px-4 font-semibold text-emerald-600">{row.bldg.safe}</td>
                          <td className="py-4 px-4 font-semibold text-amber-500">{row.bldg.maint}</td>
                          <td className="py-4 px-4">
                             <span className="bg-rose-100 text-rose-700 px-2 py-1 rounded font-bold text-xs">{row.bldg.crit} مدرسة</span>
                          </td>
                        </>
                      )}

                      {tableTab === 'teachers' && (
                        <>
                          <td className="py-4 px-4 font-semibold text-slate-700">{row.teach.density}</td>
                          <td className="py-4 px-4 font-semibold text-slate-700 font-mono">{row.teach.ratio}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${row.teach.statusBg}`}>
                              {row.teach.status}
                            </span>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom Section: Construction & Maintenance Operations */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-2">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-lg text-slate-900">عمليات التجهيز والصيانة الحية</h3>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-full">
                <button
                  onClick={() => setMaintenanceOpsTab('مباشرة')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                    maintenanceOpsTab === 'مباشرة'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${maintenanceOpsTab === 'مباشرة' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}
                  ></span>
                  مباشرة
                </button>
                <button
                  onClick={() => setMaintenanceOpsTab('حديثاً')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                    maintenanceOpsTab === 'حديثاً'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${maintenanceOpsTab === 'حديثاً' ? 'bg-slate-500' : 'bg-slate-300'}`}
                  ></span>
                  حديثاً
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
              {maintenanceOpsTab === 'مباشرة' ? (
                <>
                  {[
                    {
                      title: 'توريد أجهزة لوحية (الدفعة 5)',
                      desc: 'استلام وتوزيع 20,000 جهاز لوحي للمدارس المستهدفة بمنطقة الغرب.',
                      time: 'الآن',
                      icon: Monitor,
                      isLive: true
                    },
                    {
                      title: 'صيانة وتجهيز عيادات مدرسية',
                      desc: 'توريد أجهزة طبية عاجلة ومعدات إسعاف لـ 45 مدرسة للتعليم الأساسي.',
                      time: 'الآن',
                      icon: Activity,
                      isLive: true
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-slate-400"> <item.icon size={20} strokeWidth={1.5} /> </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{item.time}</span>
                          <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-red-100 tracking-wider">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> LIVE
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors">عرض التفاصيل</button>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    {
                      title: 'تركيب سبورات ذكية - منطقة الشرق',
                      desc: 'تجهيز 300 فصل دراسي في الإسكندرية والجيزة بسبورات العرض الذكية.',
                      time: 'منذ يومين',
                      icon: MonitorUp,
                      isLive: false
                    },
                    {
                      title: 'ترميم المرافق الرياضية',
                      desc: 'الانتهاء من تجديد الملاعب السداسية في 8 مدارس وتجهيزها بالكامل.',
                      time: 'منذ أسبوع',
                      icon: Trophy,
                      isLive: false
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-slate-400"> <item.icon size={20} strokeWidth={1.5} /> </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{item.time}</span>
                          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">RECENT</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors">عرض التفاصيل</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === "financials" && (
        <>
          {/* Top Row: 4 KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Card 1 */}
            <div className="bg-gradient-to-tr from-violet-900 to-fuchsia-600 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[160px] group">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-white">
                  إجمالي الميزانية المعتمدة
                </span>
                <div className="bg-white/20 text-white p-2.5 rounded-xl">
                  <Wallet size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-white mb-1">
                  7.2B ج.م
                </p>
                <p className="text-xs text-violet-100 mt-1">الميزانية الكلية لقطاع التعليم</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  الميزانية المتبقية
                </span>
                <div className="bg-violet-50 text-violet-600 p-2.5 rounded-xl">
                  <Banknote size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
                  2.5B ج.م
                </p>
                <p className="text-xs text-slate-500 mt-1">35% من إجمالي الميزانية</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  إجمالي الإنفاق حتى الآن
                </span>
                <div className="bg-violet-50 text-violet-600 p-2.5 rounded-xl">
                  <TrendingUp size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
                  4.6B ج.م
                </p>
                <p className="text-xs text-slate-500 mt-1">65% من إجمالي الميزانية</p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-500">
                  عجز التمويل المتوقع
                </span>
                <div className="bg-violet-50 text-violet-600 p-2.5 rounded-xl">
                  <AlertCircle size={20} strokeWidth={2} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold tracking-tight text-slate-900 mb-1">
                  -750K ج.م
                </p>
                <p className="text-xs text-slate-500 mt-1">عجز ميزانية الصيانة في الإسكندرية</p>
              </div>
            </div>
          </div>

          {/* Middle Row: Visual Data Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Left Column: Burn Rate */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-slate-800">معدل الإنفاق الشهري</h3>
                  <p className="text-xs text-slate-500 mt-1">تطور الإنفاق خلال الـ 6 أشهر الماضية</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-slate-400 border border-slate-100">
                  <LineChart size={18} />
                </div>
              </div>
              <div className="h-48 flex items-end justify-between gap-2 px-4">
                {[
                  { month: 'يناير', height: '40%' },
                  { month: 'فبراير', height: '55%' },
                  { month: 'مارس', height: '70%' },
                  { month: 'أبريل', height: '65%' },
                  { month: 'مايو', height: '85%' },
                  { month: 'يونيو', height: '90%' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center w-full gap-2 h-full justify-end">
                    <div className="w-full bg-slate-100 rounded-t-lg relative group flex-1">
                      <div 
                        className="absolute bottom-0 left-0 right-0 bg-violet-400 rounded-lg group-hover:bg-violet-500 transition-colors"
                        style={{ height: item.height }}
                      ></div>
                    </div>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Budget Distribution */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-slate-800">توزيع الميزانية</h3>
                  <p className="text-xs text-slate-500 mt-1">تقسيم المخصصات المالية حسب الابواب</p>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-slate-400 border border-slate-100">
                  <PieChart size={18} />
                </div>
              </div>
              
              <div className="flex flex-col justify-center h-48 space-y-6">
                <div className="flex w-full h-4 rounded-full overflow-hidden">
                  <div className="bg-violet-500 w-[70%]" title="رواتب 70%"></div>
                  <div className="bg-amber-400 w-[15%]" title="بنية تحتية 15%"></div>
                  <div className="bg-sky-400 w-[10%]" title="تكنولوجيا 10%"></div>
                  <div className="bg-slate-300 w-[5%]" title="أخرى 5%"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                      <span className="text-sm font-semibold text-slate-700">رواتب</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">70%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <span className="text-sm font-semibold text-slate-700">بنية تحتية</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">15%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-sky-400"></div>
                      <span className="text-sm font-semibold text-slate-700">تكنولوجيا</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">10%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-3 h-3 rounded-full bg-slate-300"></div>
                      <span className="text-sm font-semibold text-slate-700">أخرى</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Row: Interactive Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-slate-100 mb-0 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800">الاعتمادات والمشاريع النشطة</h3>
                <p className="text-xs text-slate-500 mt-1">تتبع التدفقات المالية للمشاريع الجارية</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse text-right">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="py-3 px-5 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">اسم المشروع</th>
                    <th className="py-3 px-5 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">الكيان</th>
                    <th className="py-3 px-5 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">الميزانية المخصصة</th>
                    <th className="py-3 px-5 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start w-1/4">نسبة الإنجاز المالي</th>
                    <th className="py-3 px-5 text-xs tracking-wider text-slate-500 uppercase font-semibold text-start">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-800">تجهيز 50 معمل حاسب آلي</td>
                    <td className="py-4 px-5 font-medium text-slate-600">الإسكندرية</td>
                    <td className="py-4 px-5 font-mono font-medium text-slate-700 mt-1 tracking-tight">1,500,000 ج.م</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                           <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '80%' }}></div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600">80%</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wide bg-emerald-50 text-emerald-700 border border-emerald-100">معتمد</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-800">صيانة المرافق الصحية</td>
                    <td className="py-4 px-5 font-medium text-slate-600">الإسكندرية</td>
                    <td className="py-4 px-5 font-mono font-medium text-slate-700 mt-1 tracking-tight">750,000 ج.م</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                           <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <span className="text-xs font-bold text-rose-600">15%</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wide bg-rose-50 text-rose-700 border border-rose-100">متأخر</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-5 font-bold text-slate-800">تطوير البنية التحتية للشبكات</td>
                    <td className="py-4 px-5 font-medium text-slate-600">القاهرة</td>
                    <td className="py-4 px-5 font-mono font-medium text-slate-700 mt-1 tracking-tight">3,600,000 ج.م</td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                           <div className="bg-violet-500 h-1.5 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <span className="text-xs font-bold text-violet-600">45%</span>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold tracking-wide bg-violet-50 text-violet-700 border border-violet-100">جاري التنفيذ</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Bottom section: Live Operations (Financial) */}
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-2">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-slate-400" />
                <h3 className="font-bold text-lg text-slate-900">العمليات والإجراءات الحية</h3>
              </div>
              <div className="flex p-1 bg-slate-100 rounded-full">
                <button
                  onClick={() => setFinanceOpsTab('مباشرة')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                    financeOpsTab === 'مباشرة'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${financeOpsTab === 'مباشرة' ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}
                  ></span>
                  مباشرة
                </button>
                <button
                  onClick={() => setFinanceOpsTab('حديثاً')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-full flex items-center gap-1.5 transition-all ${
                    financeOpsTab === 'حديثاً'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${financeOpsTab === 'حديثاً' ? 'bg-slate-500' : 'bg-slate-300'}`}
                  ></span>
                  حديثاً
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-4">
              {financeOpsTab === 'مباشرة' ? (
                <>
                  {[
                    {
                      title: 'اعتماد ميزانية الصيانة',
                      desc: 'جاري تحويل الدفعة الأولى من المخصصات لمدارس الإسكندرية.',
                      time: 'مباشرة',
                      icon: Wallet,
                      isLive: true
                    },
                    {
                      title: 'صرف رواتب المعلمين',
                      desc: 'بدء توجيه الحوالات المالية لشهر مايو لجميع الأقاليم التعليمية.',
                      time: 'مباشرة',
                      icon: Banknote,
                      isLive: true
                    },
                    {
                      title: 'تسوية العهد المالية',
                      desc: 'تحديث الأرصدة وإغلاق العهد المالية للمكاتب الفرعية بالوزارة.',
                      time: 'مباشرة',
                      icon: RefreshCw,
                      isLive: true
                    },
                    {
                      title: 'تمويل طارئ للبنية التحتية',
                      desc: 'تفعيل بند الطوارئ لتغطية تكاليف إصلاح شبكات الإنترنت في الإسكندرية.',
                      time: 'مباشرة',
                      icon: AlertTriangle,
                      isLive: true
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-slate-400"> <item.icon size={20} strokeWidth={1.5} /> </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{item.time}</span>
                          <span className="bg-red-50 text-red-500 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border border-red-100 tracking-wider">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span> LIVE
                          </span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-bold text-slate-800 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                      </div>
                      <button className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors">عرض التفاصيل</button>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {[
                    {
                      title: 'إغلاق حسابات الربع الأول',
                      desc: 'اكتملت المراجعة الدورية وتم إقرار الميزانيات الربعية.',
                      time: 'منذ ساعتين',
                      icon: Archive,
                      isLive: false
                    },
                    {
                      title: 'صرف مستحقات الموردين',
                      desc: 'تم اعتماد دفعات جديدة لموردي الكتب المدرسية والمستلزمات.',
                      time: 'منذ 5 ساعات',
                      icon: Banknote,
                      isLive: false
                    },
                    {
                      title: 'تسوية ميزانية التنقلات',
                      desc: 'تمت مراجعة وتسوية مبالغ التنقل المحالة للمكاتب الفرعية.',
                      time: 'أمس',
                      icon: Wallet,
                      isLive: false
                    },
                    {
                      title: 'تخصيص مكافآت التميز',
                      desc: 'انتهت إجراءات اعتماد وصرف مكافآت التميز للمدارس المتميزة.',
                      time: 'أمس',
                      icon: Award,
                      isLive: false
                    }
                  ].map((item, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-md transition-shadow opacity-75">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-slate-400"> <item.icon size={20} strokeWidth={1.5} /> </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">{item.time}</span>
                        </div>
                      </div>
                      <div className="mb-4">
                        <h4 className="font-bold text-slate-600 text-sm mb-1">{item.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                      </div>
                      <button className="w-full py-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-500 text-xs font-bold hover:bg-slate-100/80 transition-colors">عرض السجل</button>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

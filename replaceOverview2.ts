import * as fs from 'fs';

const filePath = 'views/MOEDashboardView.tsx';
let content = fs.readFileSync(filePath, 'utf-8');

const startTag = '{activeTab === "overview" && (';
const endTag = '{activeTab === "academics" && (';

const startIndex = content.indexOf(startTag);
const endIndex = content.indexOf(endTag);

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not find start or end tags');
  process.exit(1);
}

const replacement = `{activeTab === "overview" && (
        <>
          {/* Top KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Card 1: Academics (Hero) */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 border-0 shadow-md flex flex-col justify-between text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl flex-shrink-0 -mr-10 -mt-10"></div>
              <div className="flex items-center justify-between mb-4 relative z-10">
                <span className="text-sm font-semibold text-indigo-100">
                  إجمالي المقيدين
                </span>
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Users size={20} className="text-white" />
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-3xl font-bold tracking-tight text-white mb-1">1.45M</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-indigo-100">بنين: 52%</span>
                  <span className="w-1 h-1 rounded-full bg-indigo-300"></span>
                  <span className="text-sm font-medium text-indigo-100">بنات: 48%</span>
                </div>
              </div>
            </div>

            {/* Card 2: Infrastructure */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600">
                  المدارس العاملة
                </span>
                <div className="bg-emerald-50 text-emerald-600 p-2.5 rounded-xl border border-emerald-100">
                  <Building size={20} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">4,120</p>
                <p className="text-sm font-medium text-slate-500">
                  تعمل بكامل طاقتها
                </p>
              </div>
            </div>

            {/* Card 3: Human Resources */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600">
                  القوى العاملة
                </span>
                <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl border border-amber-100">
                  <Briefcase size={20} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">85,400</p>
                <p className="text-sm font-medium text-amber-600">
                  عجز حرج: 450 معلم
                </p>
              </div>
            </div>

            {/* Card 4: Finance */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600">
                  الميزانية المستهلكة
                </span>
                <div className="bg-purple-50 text-purple-600 p-2.5 rounded-xl border border-purple-100">
                  <Activity size={20} />
                </div>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900 tracking-tight mb-1">76.4%</p>
                <p className="text-sm font-medium text-slate-500">
                  من إجمالي المخصصات
                </p>
              </div>
            </div>
          </div>

          {/* The Analytics Engine (CHARTS) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Chart 1: Doughnut Mock */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <h3 className="font-bold text-sm text-slate-900 mb-6">الحالة التشغيلية للمدارس</h3>
              <div className="flex-1 flex items-center justify-center relative">
                {/* CSS Conic Gradient Doughnut */}
                <div className="w-32 h-32 rounded-full flex items-center justify-center shrink-0"
                     style={{ background: 'conic-gradient(#10b981 0% 88%, #f59e0b 88% 97%, #ef4444 97% 100%)' }}>
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-xl font-bold text-emerald-600">88%</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 text-xs font-semibold">
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span className="text-slate-600">نشط (88%)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span className="text-slate-600">صيانة (9%)</span></div>
                <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span className="text-slate-600">مغلق (3%)</span></div>
              </div>
            </div>

            {/* Chart 2: Bar Mock */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <h3 className="font-bold text-sm text-slate-900 mb-6">هيكل الإنفاق المالي</h3>
              <div className="flex-1 flex flex-col justify-center gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>المرتبات (92%)</span>
                    <span className="text-slate-900">4.2B د.ل</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-sky-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>البنية التحتية (5%)</span>
                    <span className="text-slate-900">230M د.ل</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-400 h-2 rounded-full" style={{ width: '5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                    <span>التحول الرقمي (3%)</span>
                    <span className="text-slate-900">138M د.ل</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-indigo-300 h-2 rounded-full" style={{ width: '3%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 3: Area/Line Mock */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <h3 className="font-bold text-sm text-slate-900 mb-6">اتجاه الحضور الوطني</h3>
              <div className="flex-1 flex flex-col items-center justify-end relative h-32 px-2 pb-2 mt-4">
                <div className="w-full h-full flex items-end justify-between gap-1.5 border-b border-slate-100 pb-2 relative">
                   <div className="absolute top-0 right-0 w-full text-center pb-2">
                     <p className="text-3xl font-bold text-slate-900">94.2%</p>
                   </div>
                   <div className="w-full bg-indigo-100 rounded-t" style={{height: '40%'}}></div>
                   <div className="w-full bg-indigo-100 rounded-t" style={{height: '45%'}}></div>
                   <div className="w-full bg-indigo-200 rounded-t" style={{height: '52%'}}></div>
                   <div className="w-full bg-indigo-300 rounded-t" style={{height: '60%'}}></div>
                   <div className="w-full bg-indigo-400 rounded-t" style={{height: '75%'}}></div>
                   <div className="w-full bg-indigo-500 rounded-t" style={{height: '84%'}}></div>
                   <div className="w-full bg-indigo-600 rounded-t" style={{height: '92%'}}></div>
                </div>
              </div>
               <div className="flex justify-between items-center mt-2 pt-2">
                 <span className="text-xs text-slate-500 font-medium">السبت</span>
                 <span className="text-xs text-slate-500 font-medium">اليوم</span>
               </div>
            </div>
          </div>

          {/* Core App / Live Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* The Geographic Command Center */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative min-h-[480px] flex flex-col overflow-hidden">
              <div className="flex justify-between items-start mb-6 relative z-10 w-full">
                <div className="flex items-center gap-3">
                  <div className="p-2 border border-slate-200 rounded-lg shadow-sm bg-slate-50">
                    <MapPin size={20} className="text-slate-700" />
                  </div>
                  <h3 className="font-bold text-xl text-slate-900">الخريطة التعليمية الوطنية</h3>
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm border border-emerald-600"></span><span className="text-slate-600">مستقر</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm border border-amber-600"></span><span className="text-slate-600">تنبيه</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500 shadow-sm border border-rose-600"></span><span className="text-slate-600">حرج</span></div>
                </div>
              </div>
              
              <div className="flex-1 w-full relative bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                {/* Visual grid background */}
                <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: "radial-gradient(#64748b 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
                
                {/* Map Layout Abstraction Wrapper */}
                <div className="relative w-full h-full max-w-[500px] max-h-[350px]">
                  {/* Tripolitania (طرابلس / الغربية) */}
                  <div className="absolute top-[20%] right-[30%] group z-10">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center relative shadow-md border-2 border-white">
                      <span className="absolute w-full h-full bg-emerald-400 rounded-full animate-ping opacity-75"></span>
                      <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                    </div>
                    <div className="absolute top-10 right-1/2 translate-x-1/2 w-72 bg-white rounded-2xl p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-100 pointer-events-none">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-bold text-base text-slate-900">المنطقة الغربية</p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">مستقر</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-600"><span className="font-medium">المدارس</span><span className="font-bold text-slate-900">2,100</span></div>
                        <div className="flex justify-between text-xs text-slate-600"><span className="font-medium">الحضور</span><span className="font-bold text-emerald-600">95%</span></div>
                        <div className="flex justify-between text-xs text-slate-600"><span className="font-medium">القوى العاملة</span><span className="font-bold text-slate-900">42,000</span></div>
                      </div>
                    </div>
                  </div>

                  {/* Cyrenaica (برقة / الشرقية) */}
                  <div className="absolute top-[40%] right-[10%] group z-10">
                    <div className="w-6 h-6 bg-amber-500 rounded-full cursor-pointer transition-transform hover:scale-110 flex items-center justify-center relative shadow-md border-2 border-white">
                      <span className="absolute w-full h-full bg-amber-400 rounded-full animate-ping opacity-75"></span>
                      <span className="w-2.5 h-2.5 bg-white rounded-full"></span>
                    </div>
                    <div className="absolute top-10 right-1/2 translate-x-1/2 w-72 bg-white rounded-2xl p-4 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-100 pointer-events-none">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-bold text-base text-slate-900">المنطقة الشرقية</p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">تنبيه</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-600"><span className="font-medium">المدارس</span><span className="font-bold text-slate-900">1,400</span></div>
                        <div className="flex justify-between text-xs text-slate-600"><span className="font-medium">الحضور</span><span className="font-bold text-amber-600">88%</span></div>
                        <div className="flex justify-between text-xs text-slate-600"><span className="font-medium">عجز معلمين</span><span className="font-bold text-amber-600">-150</span></div>
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
                        <p className="font-bold text-base text-slate-900">المنطقة الجنوبية</p>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">تدخل حرج</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-600"><span className="font-medium">المدارس</span><span className="font-bold text-slate-900">450</span></div>
                        <div className="flex justify-between text-xs text-slate-600"><span className="font-medium">الحضور</span><span className="font-bold text-rose-600">62%</span></div>
                        <div className="flex justify-between text-xs text-slate-600"><span className="font-medium">خطر تسرب</span><span className="font-bold text-rose-600">عالي</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Early Warning System */}
            <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                <div className="p-2 border border-slate-200 rounded-lg shadow-sm bg-slate-50">
                   <AlertTriangle size={20} className="text-slate-700" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">نظام الإنذار المبكر</h3>
              </div>

              <div className="flex flex-col gap-4 flex-1">
                {/* Alert 1 */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                     <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-700">تدخل حرج</span>
                     <span className="text-[11px] font-medium text-slate-400">الجنوب</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                     خطر تسرب مرتفع (معدلات الغياب تتجاوز 15 يوماً متواصلة)
                  </p>
                </div>

                {/* Alert 2 */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                     <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">تنبيه</span>
                     <span className="text-[11px] font-medium text-slate-400">الشرق</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    عجز حرج في توافر معلمي الرياضيات للتعليم الأساسي
                  </p>
                </div>

                {/* Alert 3 */}
                <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow">
                 <div className="flex items-center justify-between mb-2">
                     <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">مستقر</span>
                     <span className="text-[11px] font-medium text-slate-400">الغرب</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">
                    مؤشرات شبكة الاتصال للمدارس الرقمية ضمن النطاق الآمن
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Live Operations Feed */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-2">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 border border-slate-200 rounded-lg shadow-sm bg-slate-50">
                  <Activity size={20} className="text-slate-700" />
                </div>
                <h3 className="font-bold text-lg text-slate-900">العمليات المباشرة للوزارة</h3>
              </div>
              <span className="flex items-center gap-2 text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                بث مباشر
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3 p-4 group">
                <div className="p-2 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg shrink-0 group-hover:bg-white group-hover:border-slate-200 group-hover:text-slate-600 transition-colors">
                  <Clock size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 mb-1">منذ 5 دقائق</h4>
                  <p className="text-sm text-slate-800 leading-snug font-medium">
                    بدء رفع نتائج الامتحانات النصفية في المراكز الامتحانية.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 group">
                 <div className="p-2 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg shrink-0 group-hover:bg-white group-hover:border-slate-200 group-hover:text-slate-600 transition-colors">
                  <ClipboardCheck size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 mb-1">منذ 18 دقيقة</h4>
                  <p className="text-sm text-slate-800 leading-snug font-medium">
                    اكتمال توزيع الدفعة الثالثة من الكتاب المدرسي بنجاح.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 group">
                <div className="p-2 bg-slate-50 border border-slate-100 text-slate-400 rounded-lg shrink-0 group-hover:bg-white group-hover:border-slate-200 group-hover:text-slate-600 transition-colors">
                  <Monitor size={16} strokeWidth={2.5} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 mb-1">منذ ساعتين</h4>
                  <p className="text-sm text-slate-800 leading-snug font-medium">
                    تحديث خوادم المنصة המوحدة لإصدار الشهادات الإلكترونية.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
`;

content = content.substring(0, startIndex) + replacement + content.substring(endIndex);

fs.writeFileSync(filePath, content);

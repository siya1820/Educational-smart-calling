import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, 
  Lock, 
  Settings, 
  Bell, 
  CheckCircle2, 
  ArrowLeft, 
  User, 
  UserCheck, 
  UserX, 
  Smartphone, 
  LogOut,
  Sparkles,
  Volume2,
  Plus,
  Trash2
} from 'lucide-react';
import { Teacher, CallRequest } from '../types';
import { mockFirestore } from '../utils/mockFirestore';

export default function PhoneSimulator() {
  // Current screen inside the phone: 'student' | 'admin' | 'settings'
  const [currentScreen, setCurrentScreen] = useState<'student' | 'admin' | 'settings'>('student');
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [calls, setCalls] = useState<CallRequest[]>([]);
  const [settings, setSettings] = useState(mockFirestore.getSettings());

  // Input states for Student View
  const [selectedGrade, setSelectedGrade] = useState<number | null>(null);
  const [selectedClass, setSelectedClass] = useState<number | null>(null);
  const [studentName, setStudentName] = useState<string>('');
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<string | null>(null);

  // Modal / UI States
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [enteredPassword, setEnteredPassword] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showCallSuccessBanner, setShowCallSuccessBanner] = useState(false);
  const [successInfo, setSuccessInfo] = useState({ student: '', teacher: '', purpose: '' });

  // Settings Edit States
  const [editPassword, setEditPassword] = useState('');
  const [editTeachers, setEditTeachers] = useState<Teacher[]>([]);
  const [editPurposes, setEditPurposes] = useState<string[]>([]);
  const [showSettingsSuccess, setShowSettingsSuccess] = useState(false);

  // Dynamic state for call purposes
  const [purposes, setPurposes] = useState<string[]>(mockFirestore.getPurposes());

  // Real-time synchronization
  useEffect(() => {
    setTeachers(mockFirestore.getTeachers());
    setCalls(mockFirestore.getCalls());
    setSettings(mockFirestore.getSettings());
    setPurposes(mockFirestore.getPurposes());

    const unsubscribeTeachers = mockFirestore.subscribeTeachers(() => {
      setTeachers(mockFirestore.getTeachers());
    });
    const unsubscribeCalls = mockFirestore.subscribeCalls(() => {
      setCalls(mockFirestore.getCalls());
    });
    const unsubscribeSettings = mockFirestore.subscribeSettings(() => {
      const s = mockFirestore.getSettings();
      setSettings(s);
    });
    const unsubscribePurposes = mockFirestore.subscribePurposes(() => {
      setPurposes(mockFirestore.getPurposes());
    });

    return () => {
      unsubscribeTeachers();
      unsubscribeCalls();
      unsubscribeSettings();
      unsubscribePurposes();
    };
  }, []);

  // Update settings fields when settings, teachers, or purposes change
  useEffect(() => {
    setEditPassword(settings.adminPassword);
    setEditTeachers(teachers);
    setEditPurposes(purposes);
  }, [settings, teachers, purposes]);

  // Form Validity
  const isFormValid = 
    selectedGrade !== null && 
    selectedClass !== null && 
    studentName.trim().length > 0 && 
    selectedTeacherId !== null && 
    selectedPurpose !== null;

  // Handle Call Submission
  const handleCall = () => {
    if (!isFormValid) return;

    const teacher = teachers.find(t => t.id === selectedTeacherId);
    if (!teacher || !teacher.isAvailable) return;

    const callData = {
      grade: selectedGrade!,
      className: selectedClass!,
      studentName: studentName.trim(),
      teacherId: selectedTeacherId!,
      teacherName: teacher.name,
      purpose: selectedPurpose!,
    };

    mockFirestore.addCall(callData);

    // Show visual confirmation on student screen
    setSuccessInfo({
      student: `${selectedGrade}학년 ${selectedClass}반 ${studentName.trim()}`,
      teacher: teacher.name,
      purpose: selectedPurpose!,
    });
    setShowCallSuccessBanner(true);

    // Reset inputs
    setSelectedGrade(null);
    setSelectedClass(null);
    setStudentName('');
    setSelectedTeacherId(null);
    setSelectedPurpose(null);

    // Hide banner after 4 seconds
    setTimeout(() => {
      setShowCallSuccessBanner(false);
    }, 4000);
  };

  // Handle Admin Access Dialog
  const handleAdminAccess = () => {
    if (enteredPassword === settings.adminPassword) {
      setShowPasswordModal(false);
      setEnteredPassword('');
      setPasswordError(false);
      setCurrentScreen('admin');
    } else {
      setPasswordError(true);
      // Shake effect or quick timeout
      setTimeout(() => setPasswordError(false), 800);
    }
  };

  // Handle Call Completion (Delete)
  const handleCompleteCall = (id: string) => {
    mockFirestore.deleteCall(id);
  };

  // Save Settings
  const handleSaveSettings = () => {
    // Save password
    if (editPassword.trim()) {
      mockFirestore.updatePassword(editPassword.trim());
    }
    // Save each teacher details
    editTeachers.forEach((t) => {
      mockFirestore.updateTeacher(t);
    });

    // Save purposes
    const sanitizedPurposes = editPurposes
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    mockFirestore.updatePurposes(sanitizedPurposes);

    setShowSettingsSuccess(true);
    setTimeout(() => {
      setShowSettingsSuccess(false);
      setCurrentScreen('admin');
    }, 1500);
  };

  // Toggle teacher presence in settings
  const toggleTeacherPresence = (index: number) => {
    const updated = [...editTeachers];
    updated[index] = {
      ...updated[index],
      isAvailable: !updated[index].isAvailable
    };
    setEditTeachers(updated);
  };

  // Modify teacher name in settings
  const handleTeacherNameChange = (index: number, newName: string) => {
    const updated = [...editTeachers];
    updated[index] = {
      ...updated[index],
      name: newName
    };
    setEditTeachers(updated);
  };

  // Modify teacher role in settings
  const handleTeacherRoleChange = (index: number, newRole: string) => {
    const updated = [...editTeachers];
    updated[index] = {
      ...updated[index],
      role: newRole
    };
    setEditTeachers(updated);
  };

  // Add a new purpose in settings
  const handleAddPurposeSetting = () => {
    setEditPurposes([...editPurposes, '']);
  };

  // Change a purpose value in settings
  const handlePurposeChangeSetting = (index: number, value: string) => {
    const updated = [...editPurposes];
    updated[index] = value;
    setEditPurposes(updated);
  };

  // Delete a purpose in settings
  const handleRemovePurposeSetting = (index: number) => {
    const updated = editPurposes.filter((_, i) => i !== index);
    setEditPurposes(updated);
  };

  return (
    <div id="phone-simulator-container" className="flex flex-col items-center">
      {/* Phone Body */}
      <div className="relative w-full max-w-[370px] h-[780px] bg-slate-900 rounded-[48px] shadow-2xl border-4 border-slate-800 p-3 overflow-hidden flex flex-col">
        
        {/* Dynamic Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full mb-1"></div>
          <div className="w-2.5 h-2.5 bg-slate-800 rounded-full ml-2 mb-1"></div>
        </div>

        {/* Status Bar */}
        <div className="flex justify-between items-center px-6 pt-2 pb-1 text-[11px] font-medium text-slate-400 z-40 select-none">
          <span>09:40</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-md font-mono">LIVE SYNC</span>
            <div className="w-4 h-2.5 border border-slate-400 rounded-sm p-0.5 flex">
              <div className="w-full h-full bg-slate-400 rounded-2xs"></div>
            </div>
          </div>
        </div>

        {/* Screen Content Container */}
        <div className="flex-1 bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative text-slate-800">
          
          {/* Header/AppBar */}
          <div className="bg-[#002D5B] text-white pt-5 pb-4 px-4 shadow-md flex items-center justify-between select-none">
            {currentScreen !== 'student' ? (
              <button 
                id="btn-appbar-back"
                onClick={() => {
                  if (currentScreen === 'settings') {
                    setCurrentScreen('admin');
                  } else {
                    setCurrentScreen('student');
                  }
                }}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
            ) : (
              <div className="w-6"></div> // spacer
            )}

            <div className="text-center flex-1">
              <h1 className="text-[14px] font-semibold tracking-wide">구미여자고등학교</h1>
              <p className="text-[10px] text-blue-200 font-medium">스마트 교사 호출 시스템</p>
            </div>

            {currentScreen === 'admin' ? (
              <button 
                id="btn-appbar-settings"
                onClick={() => setCurrentScreen('settings')}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-blue-100"
                title="설정"
              >
                <Settings size={18} />
              </button>
            ) : currentScreen === 'settings' ? (
              <button 
                id="btn-appbar-logout"
                onClick={() => setCurrentScreen('student')}
                className="p-1.5 rounded-full hover:bg-white/10 transition-colors text-red-200"
                title="학생화면으로 이동"
              >
                <LogOut size={18} />
              </button>
            ) : (
              <div className="w-6"></div> // spacer
            )}
          </div>

          {/* Screen Switcher */}
          <div className="flex-1 overflow-y-auto scrollbar-thin flex flex-col">
            <AnimatePresence mode="wait">
              
              {/* STUDENT SCREEN */}
              {currentScreen === 'student' && (
                <motion.div
                  key="student"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 flex flex-col gap-4 flex-1 pb-16 relative"
                >
                  {/* Call Success Toast Overlay */}
                  <AnimatePresence>
                    {showCallSuccessBanner && (
                      <motion.div 
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        className="absolute top-2 left-2 right-2 bg-emerald-600 text-white rounded-2xl p-3.5 shadow-xl z-50 flex items-start gap-2.5 border border-emerald-500"
                      >
                        <CheckCircle2 className="text-emerald-200 mt-0.5 shrink-0" size={20} />
                        <div>
                          <h4 className="text-[12px] font-bold">호출 요청 완료!</h4>
                          <p className="text-[10px] text-emerald-100 leading-normal mt-0.5">
                            {successInfo.student} 학생이 {successInfo.purpose} 용무로 <strong>{successInfo.teacher}</strong> 선생님을 호출했습니다.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* 1. Grade Selection (SegmentedButton) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#002D5B] flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="w-1.5 h-3 bg-[#002D5B] rounded-none inline-block"></span>
                      01. 학년 선택
                    </label>
                    <div id="grade-segmented-button" className="flex bg-slate-200/80 p-0.5 rounded-xl border border-slate-300">
                      {[1, 2, 3].map((g) => (
                        <button
                          key={`grade-${g}`}
                          onClick={() => setSelectedGrade(g)}
                          className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-lg transition-all ${
                            selectedGrade === g 
                              ? 'bg-[#002D5B] text-white shadow-sm' 
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          {g}학년
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Class Selection (Wrap / ChoiceChip Grid) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#002D5B] flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="w-1.5 h-3 bg-[#002D5B] rounded-none inline-block"></span>
                      02. 반 선택
                    </label>
                    <div id="class-chips-grid" className="grid grid-cols-5 gap-1.5">
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((c) => (
                        <button
                          key={`class-${c}`}
                          onClick={() => setSelectedClass(c)}
                          className={`py-1 text-center text-xs font-semibold rounded-lg border transition-all ${
                            selectedClass === c
                              ? 'bg-blue-50 border-[#002D5B] text-[#002D5B] font-bold ring-1 ring-[#002D5B]'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {c}반
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 3. Name Input (TextField with Empty Space validation) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#002D5B] flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="w-1.5 h-3 bg-[#002D5B] rounded-none inline-block"></span>
                      03. 성명 입력
                    </label>
                    <div className="relative">
                      <input
                        id="student-name-input"
                        type="text"
                        placeholder="이름을 입력하세요 (예: 홍길동)"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#002D5B] focus:ring-1 focus:ring-[#002D5B] transition-all"
                      />
                      {studentName.trim().length > 0 && (
                        <Check className="absolute right-3 top-2.5 text-emerald-500" size={14} />
                      )}
                    </div>
                  </div>

                  {/* 4. Teacher Selection Cards (Absence = disabled) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#002D5B] flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="w-1.5 h-3 bg-[#002D5B] rounded-none inline-block"></span>
                      04. 선생님 선택 (부재 시 호출 불가)
                    </label>
                    <div id="teacher-selection-grid" className="grid grid-cols-2 gap-2">
                      {teachers.map((teacher) => {
                        const isSelected = selectedTeacherId === teacher.id;
                        return (
                          <div
                            key={teacher.id}
                            onClick={() => {
                              if (teacher.isAvailable) {
                                setSelectedTeacherId(teacher.id);
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-left transition-all relative overflow-hidden select-none cursor-pointer ${
                              !teacher.isAvailable
                                ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60 pointer-events-none'
                                : isSelected
                                ? 'bg-blue-50/80 border-[#002D5B] text-[#002D5B] ring-1 ring-[#002D5B]'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                                teacher.isAvailable 
                                  ? 'bg-blue-100 text-blue-800' 
                                  : 'bg-slate-200 text-slate-500'
                              }`}>
                                {teacher.isAvailable ? '재실' : '부재'}
                              </span>
                              {isSelected && teacher.isAvailable && (
                                <Check size={14} className="text-[#002D5B]" />
                              )}
                            </div>
                            <h3 className={`text-xs font-bold mt-1.5 ${!teacher.isAvailable ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                              {teacher.name} 선생님
                            </h3>
                            <p className="text-[9px] text-slate-500 mt-0.5">{teacher.role}</p>

                            {/* Diagonal "부재" overlay effect similar to IgnorePointer fallback */}
                            {!teacher.isAvailable && (
                              <div className="absolute inset-0 bg-slate-100/40 flex items-center justify-center">
                                <span className="text-[10px] font-bold text-slate-400 rotate-12 border border-slate-300 px-1 py-0.5 rounded">호출 불가</span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 5. Purpose Choice Chips (One-touch select) */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[11px] font-bold text-[#002D5B] flex items-center gap-1.5 uppercase tracking-wide">
                      <span className="w-1.5 h-3 bg-[#002D5B] rounded-none inline-block"></span>
                      05. 호출 용무 선택
                    </label>
                    <div id="purpose-chips-wrap" className="flex flex-wrap gap-1.5">
                      {purposes.map((purpose) => {
                        const isSelected = selectedPurpose === purpose;
                        return (
                          <button
                            key={purpose}
                            onClick={() => setSelectedPurpose(purpose)}
                            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                              isSelected
                                ? 'bg-[#002D5B] border-[#002D5B] text-white'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            {purpose}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6. High-Contrast Big Bottom Call Button */}
                  <div className="mt-2 pt-1">
                    <button
                      id="btn-student-call-submit"
                      disabled={!isFormValid}
                      onClick={handleCall}
                      className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
                        isFormValid
                          ? 'bg-[#002D5B] hover:bg-[#001D3D] text-white active:scale-[0.98]'
                          : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                      }`}
                    >
                      <Bell size={14} />
                      선생님 호출하기
                    </button>
                  </div>

                  {/* Hidden Admin Entry (0.05 Opacity) */}
                  <div className="mt-auto pt-6 flex justify-center">
                    <button
                      id="btn-admin-secret-access"
                      onClick={() => setShowPasswordModal(true)}
                      className="text-[10px] text-slate-500 font-medium tracking-tight select-none px-3 py-1.5 rounded transition-all hover:bg-slate-200 hover:opacity-100 opacity-[0.05]"
                    >
                      🛡️ 관리자 및 교사 전용 모드 진입
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ADMIN/TEACHER CALLS LIST SCREEN */}
              {currentScreen === 'admin' && (
                <motion.div
                  key="admin"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 flex flex-col gap-3 flex-1 pb-12"
                >
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <h2 className="text-xs font-extrabold text-[#002D5B] flex items-center gap-1.5">
                      <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                      실시간 대기 리스트 ({calls.length}건)
                    </h2>
                    <span className="text-[10px] text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full font-mono">
                      StreamBuilder
                    </span>
                  </div>

                  {/* 교사 재실 상태 실시간 제어판 (Quick Toggle Panel) */}
                  <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-[10px] font-extrabold text-[#002D5B] flex items-center gap-1">
                        <span className="w-1 h-2.5 bg-[#002D5B] rounded-none inline-block"></span>
                        교사 재실 상태 설정 (원클릭 토글)
                      </h3>
                      <span className="text-[9px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.2 rounded-full">
                        학생용 실시간 연동
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      {teachers.map((teacher) => (
                        <button
                          key={teacher.id}
                          onClick={() => {
                            mockFirestore.updateTeacher({
                              ...teacher,
                              isAvailable: !teacher.isAvailable
                            });
                          }}
                          className={`flex items-center justify-between p-1.5 rounded-lg border text-left transition-all active:scale-[0.98] ${
                            teacher.isAvailable
                              ? 'bg-emerald-50/70 border-emerald-200/80 hover:bg-emerald-100/70'
                              : 'bg-rose-50/50 border-rose-100 hover:bg-rose-100/50'
                          }`}
                        >
                          <div className="min-w-0 pr-1">
                            <p className="text-[10px] font-bold text-slate-800 truncate">{teacher.name}</p>
                            <p className="text-[8px] text-slate-400 truncate leading-tight mt-0.5">{teacher.role || '교사'}</p>
                          </div>
                          <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded shrink-0 select-none ${
                            teacher.isAvailable
                              ? 'bg-emerald-500 text-white shadow-sm'
                              : 'bg-rose-500 text-white shadow-sm'
                          }`}>
                            {teacher.isAvailable ? '재실' : '부재'}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {calls.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 mt-12 select-none">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-[#002D5B] mb-2">
                        <CheckCircle2 size={24} />
                      </div>
                      <h3 className="text-xs font-bold text-slate-700">현재 대기 중인 호출이 없습니다.</h3>
                      <p className="text-[10px] text-slate-400 mt-1">학생들이 호출을 요청하면 여기에 실시간으로 표시됩니다.</p>
                    </div>
                  ) : (
                    <div id="admin-calls-stream-list" className="flex flex-col gap-2 max-h-[360px] overflow-y-auto pr-0.5">
                      {calls.map((call, idx) => {
                        const formattedTime = new Date(call.timestamp).toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit'
                        });

                        return (
                          <motion.div
                            key={call.id}
                            initial={idx === 0 ? { scale: 0.93, opacity: 0 } : false}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow transition-all flex justify-between items-center gap-2"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-[10px] font-bold text-white bg-blue-600 px-1.5 py-0.5 rounded">
                                  {call.grade}학년 {call.className}반
                                </span>
                                <span className="text-[9px] font-semibold text-[#002D5B] bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded">
                                  {call.purpose}
                                </span>
                                <span className="text-[9px] text-slate-400 font-mono ml-auto">
                                  {formattedTime}
                                </span>
                              </div>
                              <div className="mt-2 flex items-baseline gap-1.5">
                                <span className="text-xs font-bold text-slate-800 shrink-0">{call.studentName}</span>
                                <span className="text-[9px] text-slate-400">학생 →</span>
                                <span className="text-xs font-extrabold text-[#002D5B]">{call.teacherName} 선생님</span>
                              </div>
                            </div>
                            
                            <button
                              id={`btn-complete-call-${call.id}`}
                              onClick={() => handleCompleteCall(call.id)}
                              className="shrink-0 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] px-3 py-2 rounded-lg border border-emerald-200 active:scale-95 transition-all"
                            >
                              완료
                            </button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* ADMIN SETTINGS SCREEN */}
              {currentScreen === 'settings' && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto pb-12 scrollbar-none"
                >
                  <div className="border-b border-slate-200 pb-2 flex justify-between items-center">
                    <h2 className="text-xs font-bold text-[#002D5B] flex items-center gap-1.5">
                      <Settings size={14} />
                      관리자 및 선생님 환경설정
                    </h2>
                    {showSettingsSuccess && (
                      <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded animate-pulse">
                        저장 완료!
                      </span>
                    )}
                  </div>

                  {/* Password Change */}
                  <div className="flex flex-col gap-1.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <label className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
                      <Lock size={12} className="text-[#002D5B]" />
                      1. 접속 비밀번호 변경
                    </label>
                    <input
                      id="settings-password-input"
                      type="text"
                      value={editPassword}
                      onChange={(e) => setEditPassword(e.target.value)}
                      placeholder="변경할 비밀번호 입력"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:border-[#002D5B]"
                    />
                  </div>

                  {/* Teacher Management List */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
                      <Sparkles size={12} className="text-[#002D5B]" />
                      2. 호출 대상 교사 관리 (이름 & 실시간 부재 토글)
                    </label>

                    <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto pr-0.5">
                      {editTeachers.map((teacher, index) => (
                        <div
                          key={teacher.id}
                          className="bg-white border border-slate-200 rounded-xl p-2.5 flex items-center justify-between gap-2.5 shadow-2xs"
                        >
                          <div className="flex-1 min-w-0">
                            <input
                              id={`settings-teacher-name-input-${teacher.id}`}
                              type="text"
                              value={teacher.name}
                              onChange={(e) => handleTeacherNameChange(index, e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-800 focus:outline-none focus:border-blue-500"
                              placeholder="선생님 이름"
                            />
                            <input
                              id={`settings-teacher-role-input-${teacher.id}`}
                              type="text"
                              value={teacher.role}
                              onChange={(e) => handleTeacherRoleChange(index, e.target.value)}
                              className="w-full bg-slate-50/50 border border-slate-200/80 rounded-lg px-2 py-0.5 text-[10px] text-slate-500 mt-1 focus:outline-none focus:border-blue-400 font-medium"
                              placeholder="직책 (예: 에듀테크 부장)"
                            />
                          </div>

                          <button
                            id={`settings-teacher-status-toggle-${teacher.id}`}
                            onClick={() => toggleTeacherPresence(index)}
                            className={`shrink-0 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                              teacher.isAvailable
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}
                          >
                            {teacher.isAvailable ? '🟢 재실' : '🔴 부재'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Call Purposes Management */}
                  <div className="flex flex-col gap-1.5 border-t border-slate-200/60 pt-3">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold text-slate-700 flex items-center gap-1.5">
                        <Sparkles size={12} className="text-[#002D5B]" />
                        3. 호출 용무 선택 항목 관리
                      </label>
                      <button
                        type="button"
                        onClick={handleAddPurposeSetting}
                        className="flex items-center gap-1 text-[9px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded-lg transition-all active:scale-95"
                      >
                        <Plus size={10} />
                        용무 추가
                      </button>
                    </div>

                    <div className="flex flex-col gap-1.5 max-h-[160px] overflow-y-auto pr-0.5">
                      {editPurposes.map((purpose, index) => (
                        <div
                          key={index}
                          className="bg-white border border-slate-200 rounded-xl p-2 flex items-center gap-2 shadow-2xs"
                        >
                          <input
                            type="text"
                            value={purpose}
                            onChange={(e) => handlePurposeChangeSetting(index, e.target.value)}
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-blue-500"
                            placeholder="용무 입력 (예: 질문있어요)"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemovePurposeSetting(index)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition-all border border-rose-100"
                            title="삭제"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                      {editPurposes.length === 0 && (
                        <p className="text-[10px] text-slate-400 text-center py-4">등록된 호출 용무가 없습니다. 추가해주세요.</p>
                      )}
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2">
                    <button
                      id="btn-settings-save"
                      onClick={handleSaveSettings}
                      className="w-full py-3 bg-[#002D5B] hover:bg-[#001D3D] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-95"
                    >
                      설정 저장 및 뒤로가기
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="flex justify-center items-center py-2 shrink-0 select-none z-40">
          <button 
            id="btn-phone-home"
            onClick={() => {
              if (currentScreen !== 'student') {
                setCurrentScreen('student');
              }
            }}
            className="w-28 h-1 bg-slate-500 rounded-full transition-all hover:bg-slate-400"
            title="학생 메인으로"
          ></button>
        </div>
      </div>

      {/* PASSWORD DIALOG MODAL */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-xs"
          >
            <motion.div
              initial={{ scale: 0.9, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 10 }}
              className={`bg-white rounded-2xl w-full max-w-[300px] p-5 shadow-2xl border text-center ${
                passwordError ? 'border-rose-400 animate-bounce' : 'border-slate-200'
              }`}
            >
              <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-[#002D5B] mx-auto mb-2">
                <Lock size={18} />
              </div>
              <h3 className="text-xs font-bold text-slate-800">교사 전용 비밀번호 인증</h3>
              <p className="text-[10px] text-slate-400 mt-1 mb-3">
                초기 비밀번호는 <strong className="text-blue-600 font-mono">1234</strong> 입니다.
              </p>

              <input
                id="admin-auth-password-input"
                type="password"
                placeholder="비밀번호 입력"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminAccess()}
                className="w-full text-center bg-slate-50 border border-slate-200 rounded-xl py-2 text-xs focus:outline-none focus:border-[#002D5B] mb-2.5 font-mono"
                autoFocus
              />

              {passwordError && (
                <p className="text-[9px] text-rose-500 font-medium mb-2 animate-pulse">
                  비밀번호가 일치하지 않습니다!
                </p>
              )}

              <div className="flex gap-1.5">
                <button
                  id="btn-admin-auth-cancel"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setEnteredPassword('');
                    setPasswordError(false);
                  }}
                  className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-bold"
                >
                  취소
                </button>
                <button
                  id="btn-admin-auth-confirm"
                  onClick={handleAdminAccess}
                  className="flex-1 py-2 bg-[#002D5B] hover:bg-[#001D3D] text-white rounded-lg text-[10px] font-bold"
                >
                  인증하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

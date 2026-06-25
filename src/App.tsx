import React from 'react';
import PhoneSimulator from './components/PhoneSimulator';
import DeveloperStudio from './components/DeveloperStudio';
import { 
  Sparkles, 
  HelpCircle, 
  Layers, 
  Smartphone, 
  Terminal, 
  UserCheck, 
  Info,
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Decorative top bar with school branding (Geometric Balance Style) */}
      <header className="bg-[#002D5B] text-white px-6 py-5 shadow-lg select-none flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">구미여자고등학교 스마트 교사 호출 앱</h1>
          <p className="text-blue-200 text-xs md:text-sm">Smart Teacher Calling System</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-blue-800 text-blue-100 px-3.5 py-1 rounded-full text-xs font-semibold border border-blue-400/30 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
            실시간 동기화 활성
          </span>
          <span className="text-[11px] text-blue-100 flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
            <UserCheck size={11} className="text-blue-300" />
            수석 아키텍트 가이드 연동
          </span>
        </div>
      </header>

      {/* Main Grid Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Phone Simulator (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Card: Interactive Simulator */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h2 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Smartphone size={15} className="text-[#002D5B]" />
                스마트폰 모형 (실시간 구동 테스트)
              </h2>
              <span className="text-[10px] bg-[#002D5B]/10 text-[#002D5B] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#002D5B] rounded-full animate-ping"></span>
                실시간 동작 중
              </span>
            </div>

            <PhoneSimulator />
          </div>

          {/* Card: Live Simulator Testing Guide */}
          <div className="bg-[#002D5B] text-white rounded-3xl p-5 shadow-md">
            <h3 className="text-xs font-bold flex items-center gap-1.5 border-b border-white/10 pb-2 mb-3">
              <HelpCircle size={15} className="text-blue-300" />
              스마트폰 모형 테스트 가이드
            </h3>
            
            <ul className="text-[11px] space-y-2.5 text-blue-100 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="bg-white/15 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] mt-0.5 shrink-0">1</span>
                <div>
                  <strong>학생용 메인 화면:</strong> 학년(Segmented) 및 반(Wrap Chips)을 정하고, 이름을 입력해 선생님과 용무를 선택하고 호출해 보세요.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/15 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] mt-0.5 shrink-0">2</span>
                <div>
                  <strong>실시간 음성 및 사운드:</strong> 호출 시 <strong>"띵동" 벨소리</strong>와 함께 한국어 <strong>TTS AI 음성 브리핑</strong>이 스피커를 통해 송출됩니다.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/15 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] mt-0.5 shrink-0">3</span>
                <div>
                  <strong>교사용 대기실(Admin):</strong> 학생용 화면 최하단에 <em className="underline not-italic text-white">보일 듯 말 듯 숨겨진 '관리자 모드'</em>(투명도 0.05)를 터치하고 초기 비밀번호 <strong className="text-white font-mono bg-white/20 px-1 py-0.5 rounded">1234</strong>를 입력해 실시간 호출 스트림을 확인하십시오.
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-white/15 text-white w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] mt-0.5 shrink-0">4</span>
                <div>
                  <strong>환경설정 (Settings):</strong> 대기실 우측 상단 톱니바퀴에서 <strong className="text-white">선생님의 실시간 재실/부재 상태</strong>를 토글하여, 학생 화면의 교사 카드가 물리적으로 비활성화(회색) 되는 Ignoring 메커니즘을 테스트하십시오.
                </div>
              </li>
            </ul>
          </div>

        </div>

        {/* Right Column: Developer Code & Document center (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Card: Developer Studio Panel */}
          <div className="flex-1 h-full min-h-[680px]">
            <DeveloperStudio />
          </div>

          {/* Card: Architectural Spec Checklist */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-xs">
            <h3 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2 mb-3">
              <Layers size={15} className="text-[#002D5B]" />
              수석 아키텍트의 설계 핵심 명세 만족도 검토
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] leading-relaxed text-slate-600">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <div>
                  <strong>Segmented & Wrap Layout</strong>
                  <p className="text-[10px] text-slate-400 mt-0.5">Flutter SegmentedButton 및 Wrap-ChoiceChip 그리드 구조 완벽 설계.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <div>
                  <strong>IgnorePointer 부재 가드</strong>
                  <p className="text-[10px] text-slate-400 mt-0.5">Firestore presence와 연계하여 부재중 교사는 클릭 차단 및 그레이아웃 필터.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <div>
                  <strong>실시간 띵동 벨소리 및 TTS</strong>
                  <p className="text-[10px] text-slate-400 mt-0.5">audioplayers 벨소리 재생 및 flutter_tts 한국어 교사 호출 알림 문장 구동.</p>
                </div>
              </div>

              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-start gap-2">
                <span className="text-emerald-500 font-bold shrink-0">✓</span>
                <div>
                  <strong>완료 삭제 & 실시간 스트림</strong>
                  <p className="text-[10px] text-slate-400 mt-0.5">StreamBuilder 연동으로 Firestore의 calls 컬렉션 데이터 실시간 삭제 동기화.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-center py-4 border-t border-slate-800 text-[11px] select-none">
        <p>© 2026 Gumi Girls' High School Smart Teacher Calling System. Designed with Senior Craftsmanship.</p>
      </footer>
    </div>
  );
}

export interface Teacher {
  id: string;
  name: string;
  role: string;
  isAvailable: boolean; // true = 재실 (Active), false = 부재 (Absent)
}

export interface CallRequest {
  id: string;
  grade: number; // 1, 2, 3학년
  className: number; // 1 ~ 10반
  studentName: string;
  teacherId: string;
  teacherName: string;
  purpose: string; // 에듀테크, 방송, 출결, 교과상담, 기숙사, 기타
  timestamp: string; // ISO string
}

export interface AppSettings {
  adminPassword: string;
}

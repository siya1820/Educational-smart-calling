import { Teacher, CallRequest, AppSettings } from '../types';

const TEACHERS_KEY = 'gumi_smart_call_teachers';
const CALLS_KEY = 'gumi_smart_call_calls';
const SETTINGS_KEY = 'gumi_smart_call_settings';
const PURPOSES_KEY = 'gumi_smart_call_purposes';
const CHANNEL_NAME = 'gumi_smart_call_sync_channel';

// Default mock data matching Gumi Girls' HS setup
const DEFAULT_TEACHERS: Teacher[] = [
  { id: 't1', name: '김정보', role: '에듀테크 부장', isAvailable: true },
  { id: 't2', name: '이수학', role: '3학년 학년부장', isAvailable: true },
  { id: 't3', name: '박영어', role: '교무부장교사', isAvailable: false }, // Initially Absent (부재) to show disabled card UI
  { id: 't4', name: '최과학', role: '정숙관 기숙사 사감', isAvailable: true },
];

const DEFAULT_PURPOSES = ['에듀테크', '방송', '출결', '교과상담', '기숙사', '기타'];

const DEFAULT_SETTINGS: AppSettings = {
  adminPassword: '1234',
};

// Setup initial state if empty
if (!localStorage.getItem(TEACHERS_KEY)) {
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(DEFAULT_TEACHERS));
}
if (!localStorage.getItem(CALLS_KEY)) {
  localStorage.setItem(CALLS_KEY, JSON.stringify([]));
}
if (!localStorage.getItem(SETTINGS_KEY)) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
}
if (!localStorage.getItem(PURPOSES_KEY)) {
  localStorage.setItem(PURPOSES_KEY, JSON.stringify(DEFAULT_PURPOSES));
}

// Global broadcast channel for multi-tab / iframe real-time sync
let broadcastChannel: BroadcastChannel | null = null;
try {
  broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
} catch (e) {
  console.warn("BroadcastChannel not supported in this environment:", e);
}

// Local registry of listeners for real-time reactivity inside the same page context
type Listener = () => void;
const listeners: { [key: string]: Set<Listener> } = {
  teachers: new Set(),
  calls: new Set(),
  settings: new Set(),
  purposes: new Set(),
};

if (broadcastChannel) {
  broadcastChannel.onmessage = (event) => {
    const { collection } = event.data;
    if (listeners[collection]) {
      listeners[collection].forEach((cb) => cb());
    }
  };
}

function notifyListeners(collection: 'teachers' | 'calls' | 'settings' | 'purposes') {
  // Notify local listeners
  if (listeners[collection]) {
    listeners[collection].forEach((cb) => cb());
  }
  // Broadcast to other tabs/frames
  if (broadcastChannel) {
    broadcastChannel.postMessage({ collection });
  }
}

export const mockFirestore = {
  // --- Teachers ---
  getTeachers(): Teacher[] {
    try {
      return JSON.parse(localStorage.getItem(TEACHERS_KEY) || '[]');
    } catch {
      return DEFAULT_TEACHERS;
    }
  },

  updateTeacher(updatedTeacher: Teacher): void {
    const teachers = this.getTeachers();
    const index = teachers.findIndex(t => t.id === updatedTeacher.id);
    if (index !== -1) {
      teachers[index] = updatedTeacher;
      localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
      notifyListeners('teachers');
    }
  },

  updateTeacherNameAndStatus(id: string, name: string, isAvailable: boolean): void {
    const teachers = this.getTeachers();
    const index = teachers.findIndex(t => t.id === id);
    if (index !== -1) {
      teachers[index].name = name;
      teachers[index].isAvailable = isAvailable;
      localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
      notifyListeners('teachers');
    }
  },

  subscribeTeachers(callback: Listener): () => void {
    listeners.teachers.add(callback);
    return () => {
      listeners.teachers.delete(callback);
    };
  },

  // --- Calls ---
  getCalls(): CallRequest[] {
    try {
      return JSON.parse(localStorage.getItem(CALLS_KEY) || '[]');
    } catch {
      return [];
    }
  },

  addCall(call: Omit<CallRequest, 'id' | 'timestamp'>): CallRequest {
    const calls = this.getCalls();
    const newCall: CallRequest = {
      ...call,
      id: 'call_' + Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    
    // Unshift to put latest call on top, matching Firestore ordering
    calls.unshift(newCall);
    localStorage.setItem(CALLS_KEY, JSON.stringify(calls));
    notifyListeners('calls');
    
    // Play sound and speak if in browser
    import('./audio').then(({ playChime, speakCallRequest }) => {
      playChime();
      speakCallRequest(
        newCall.grade,
        newCall.className,
        newCall.studentName,
        newCall.purpose,
        newCall.teacherName
      );
    });

    return newCall;
  },

  deleteCall(id: string): void {
    let calls = this.getCalls();
    calls = calls.filter(c => c.id !== id);
    localStorage.setItem(CALLS_KEY, JSON.stringify(calls));
    notifyListeners('calls');
  },

  subscribeCalls(callback: Listener): () => void {
    listeners.calls.add(callback);
    return () => {
      listeners.calls.delete(callback);
    };
  },

  // --- Settings ---
  getSettings(): AppSettings {
    try {
      return JSON.parse(localStorage.getItem(SETTINGS_KEY) || JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updatePassword(newPassword: string): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify({ adminPassword: newPassword }));
    notifyListeners('settings');
  },

  subscribeSettings(callback: Listener): () => void {
    listeners.settings.add(callback);
    return () => {
      listeners.settings.delete(callback);
    };
  },

  // --- Purposes ---
  getPurposes(): string[] {
    try {
      return JSON.parse(localStorage.getItem(PURPOSES_KEY) || JSON.stringify(DEFAULT_PURPOSES));
    } catch {
      return DEFAULT_PURPOSES;
    }
  },

  updatePurposes(purposes: string[]): void {
    localStorage.setItem(PURPOSES_KEY, JSON.stringify(purposes));
    notifyListeners('purposes');
  },

  subscribePurposes(callback: Listener): () => void {
    listeners.purposes.add(callback);
    return () => {
      listeners.purposes.delete(callback);
    };
  },
};

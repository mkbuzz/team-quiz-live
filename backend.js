const STORAGE_PREFIX = 'team_vocab_live_session_';
const CHANNEL_NAME = 'team_vocab_live_updates';
const FIREBASE_VERSION = '12.16.0';

export async function createBackend() {
  const config = window.FIREBASE_CONFIG;
  if (config && config.apiKey && config.databaseURL) {
    try {
      return await FirebaseBackend.create(config);
    } catch (error) {
      console.error('Firebase initialization failed; using demo mode.', error);
    }
  }
  return new DemoBackend();
}

class DemoBackend {
  constructor() {
    this.mode = 'demo';
    this.channel = 'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_NAME) : null;
  }

  async ready() { return true; }

  key(code) { return `${STORAGE_PREFIX}${code}`; }

  async createSession(session) {
    localStorage.setItem(this.key(session.code), JSON.stringify(session));
    this.notify(session.code);
    return session;
  }

  async getSession(code) {
    const raw = localStorage.getItem(this.key(code));
    return raw ? JSON.parse(raw) : null;
  }

  async mutateSession(code, updater) {
    const current = await this.getSession(code);
    if (!current) throw new Error('Game not found.');
    const next = updater(structuredClone(current));
    if (next === undefined || next === null) return current;
    next.updatedAt = Date.now();
    next.revision = (current.revision || 0) + 1;
    localStorage.setItem(this.key(code), JSON.stringify(next));
    this.notify(code);
    return next;
  }

  subscribeSession(code, callback) {
    let active = true;
    const emit = async () => {
      const session = await this.getSession(code);
      if (active) callback(session);
    };
    const onStorage = event => {
      if (event.key === this.key(code)) emit();
    };
    const onMessage = event => {
      if (event.data?.code === code) emit();
    };
    const onLocalUpdate = event => {
      if (event.detail?.code === code) emit();
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('team-vocab-demo-update', onLocalUpdate);
    this.channel?.addEventListener('message', onMessage);
    emit();
    return () => {
      active = false;
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('team-vocab-demo-update', onLocalUpdate);
      this.channel?.removeEventListener('message', onMessage);
    };
  }

  notify(code) {
    this.channel?.postMessage({ code, at: Date.now() });
    window.dispatchEvent(new CustomEvent('team-vocab-demo-update', { detail: { code } }));
  }
}

class FirebaseBackend {
  static async create(config) {
    const [{ initializeApp }, authModule, dbModule] = await Promise.all([
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-app.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-auth.js`),
      import(`https://www.gstatic.com/firebasejs/${FIREBASE_VERSION}/firebase-database.js`)
    ]);

    const app = initializeApp(config);
    const auth = authModule.getAuth(app);
    await authModule.signInAnonymously(auth);
    const db = dbModule.getDatabase(app);
    return new FirebaseBackend(db, dbModule);
  }

  constructor(db, api) {
    this.mode = 'firebase';
    this.db = db;
    this.api = api;
  }

  async ready() { return true; }

  sessionRef(code) { return this.api.ref(this.db, `sessions/${code}`); }

  async createSession(session) {
    await this.api.set(this.sessionRef(session.code), session);
    return session;
  }

  async getSession(code) {
    const snapshot = await this.api.get(this.sessionRef(code));
    return snapshot.exists() ? snapshot.val() : null;
  }

  async mutateSession(code, updater) {
    const result = await this.api.runTransaction(this.sessionRef(code), current => {
      if (!current) return current;
      const next = updater(structuredClone(current));
      if (next === undefined || next === null) return current;
      next.updatedAt = Date.now();
      next.revision = (current.revision || 0) + 1;
      return next;
    });
    return result.snapshot.val();
  }

  subscribeSession(code, callback) {
    return this.api.onValue(this.sessionRef(code), snapshot => {
      callback(snapshot.exists() ? snapshot.val() : null);
    });
  }
}

// Auth stub to prevent network calls during staged migration
window.sb = {
  auth: {
    signUp: async () => { console.warn('Auth disabled in sandbox'); return { error: null }; },
    signInWithPassword: async () => { console.warn('Auth disabled in sandbox'); return { error: null }; },
    signOut: async () => { console.warn('Auth disabled in sandbox'); return { error: null }; },
    getUser: async () => ({ data: { user: null } }),
    onAuthStateChange: (cb) => { console.warn('Auth onAuthStateChange stubbed'); return { data: null }; }
  },
  from: () => ({ upsert: async () => ({}), select: async () => ({ data: [] }) })
};

window.sbSignUp = async (email, password) => sb.auth.signUp({email, password});
window.sbSignIn = async (email, password) => sb.auth.signInWithPassword({email, password});
window.sbSignOut = async () => sb.auth.signOut();
window.sbUser = async () => (await sb.auth.getUser()).data.user;

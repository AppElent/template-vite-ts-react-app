// @ts-nocheck
// TODO: Check ts errors

import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import IAuthProvider from './IAuthProvider';

class FirebaseAuthProvider extends IAuthProvider {
  constructor(options?, providerOptions?) {
    super(options, providerOptions);

    this.provider = 'FIREBASE';
    this.auth = getAuth();
  }

  getDemoUser(): { username: string; password: string } {
    return { username: 'demo@demo.com', password: 'demo123' };
  }

  getSignInPath() {
    return this.options.login;
  }

  getSignOutPath() {
    return this.options.logout;
  }

  async signUp(email, password) {
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    return userCredential.user;
  }

  async signIn(email, password) {
    const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
    return userCredential.user;
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();

    await signInWithPopup(getAuth(), provider);
  }

  async signOut() {
    return signOut(getAuth());
  }

  onAuthStateChanged(callback) {
    return () => onAuthStateChanged(getAuth(), callback);
  }

  getCurrentUser() {
    const user = getAuth().currentUser;
    if (user) {
      return {
        id: user.uid,
        avatar: user.photoURL || undefined,
        email: user.email || 'user@demo.com',
        name: user.displayName || 'Unknown user',
        plan: 'Premium',
        raw: user,
      };
    }
    return null;
  }

  //   async resetPassword(email) {
  //     return sendPasswordResetEmail(this.auth, email);
  //   }
}

export default FirebaseAuthProvider;

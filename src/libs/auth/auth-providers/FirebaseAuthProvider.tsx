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
import { User } from '..';
import IAuthProvider, { IAuthProviderOptions } from './IAuthProvider';

class FirebaseAuthProvider extends IAuthProvider {
  constructor(options: IAuthProviderOptions, providerOptions?: any) {
    super(options, providerOptions);

    this.provider = 'FIREBASE';
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

  async signUp(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(getAuth(), email, password);
    return userCredential.user;
  }

  async signIn(email: string, password: string) {
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

  onAuthStateChanged(callback: () => any) {
    return () => onAuthStateChanged(getAuth(), callback);
  }

  getCurrentUser(): User | null {
    const user = getAuth().currentUser;
    if (user) {
      return {
        id: user.uid,
        avatar: user.photoURL || undefined,
        email: user.email || 'user@demo.com',
        name: user.displayName || 'Unknown user',
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

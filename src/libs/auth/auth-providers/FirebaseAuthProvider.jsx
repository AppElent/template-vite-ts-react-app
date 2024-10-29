import IAuthProvider from './IAuthProvider';
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

class FirebaseAuthProvider extends IAuthProvider {
  constructor(paths, providerOptions) {
    super();
    this.paths = paths;
    this.providerOptions = providerOptions;
    this.provider = 'FIREBASE';
    this.auth = getAuth();
  }

  getSignInPath() {
    return this.paths.login;
  }

  getSignOutPath() {
    return this.paths.logout;
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

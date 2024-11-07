// @ts-nocheck
// TODO: Check ts errors

class IAuthProvider {
  constructor(options?, providerOptions?) {
    this.options = options;
    this.providerOptions = providerOptions;
  }

  getDemoUser(): { username: string; password: string } {
    throw new Error('Method not implemented.');
  }

  getSignInPath() {
    throw new Error('Method not implemented.');
  }

  getSignOutPath() {
    throw new Error('Method not implemented.');
  }

  signUp(email, password) {
    throw new Error('Method not implemented.');
  }

  signIn(email, password) {
    throw new Error('Method not implemented.');
  }

  signInWithGoogle() {
    throw new Error('Method not implemented.');
  }

  signOut() {
    throw new Error('Method not implemented.');
  }

  onAuthStateChanged(user) {
    throw new Error('Method not implemented.');
  }

  getCurrentUser() {
    throw new Error('Method not implemented.');
  }

  resetPassword(email) {
    throw new Error('Method not implemented.');
  }
}

export default IAuthProvider;


const config = {
  meta: {
    title: 'Recipe tool',
  },
  paths: {
    auth: {
      login: '/login',
      logout: '/logout',
      loginRedirect: '/app',
      redirectAfterLogin: '/',
      redirectAfterLogout: '/',
    },
    index: '/app',
    httpsRedirect: !import.meta.env.DEV && window.location.hostname !== 'localhost',
    rootRedirect: '/app', //false, //or location, e.g. /app
  },
  // data: {
  //   title: 'Satisfactory Build Tool',
  //   subtitle: 'Making Satisfactory easy again',
  //   plan: 'PRO',
  //   version: 'v0.0.1',
  //   copyright: 'AppElent',
  //   url: 'satisfactory.appelent.com',
  //   stagingUrl: 'satisfactory-stg.appelent.com',
  //   loginRedirect: '/',
  //   backend: 'https://api.appelent.com',
  //   logo: {
  //     big: '/assets/satisfactory/icon.png',
  //     icon: '/location',
  //   },
  //   index: '/satisfactory',
  // },
  settings: {
    //httpsRedirect: !import.meta.env.DEV && window.location.hostname !== 'localhost',
    //redirectFromRoot: '/satisfactory', //false, //or location, e.g. /app
    logLevel: 'info',
    // confirmationDialogOptions: {
    //   confirmationButtonProps: { variant: 'contained', autoFocus: true },
    //   cancellationButtonProps: { variant: 'outlined', color: 'error' },
    // },
  },
  issueDialog: {
    // The issue dialog needs functions to open and close it
  },
  custom: {
    // All custom elements are optional
  },
};

export default config;

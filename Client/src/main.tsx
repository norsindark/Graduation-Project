// import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client';
import App from './App';
import 'normalize.css';
import { Provider } from 'react-redux';
import './assets/styles/index.css';
import './assets/styles/main.css';
import './assets/styles/responsive.css';
import { store, persistor } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
  /*</StrictMode>,*/
);

// import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'normalize.css';
import { Provider } from 'react-redux';
import './assets/styles/index.css';
import "./assets/styles/main.css";
import "./assets/styles/responsive.css";
import { store } from "./redux/store";

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
    /*</StrictMode>,*/
)

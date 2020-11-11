import React from 'react';
import reportWebVitals from './reportWebVitals'
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import './CSS/StyleSheet1.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router } from "react-router-dom";
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <Router>
      <RecoilRoot>
        <App />
      </RecoilRoot>
  </Router>,
  document.getElementById("root")
);

if (module.hot) {
    module.hot.accept();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

reportWebVitals();

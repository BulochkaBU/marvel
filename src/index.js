import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app/App';
import './style/style.scss';
import MarvelService from './services/MarvelService';

const marvelService = new MarvelService();

marvelService.getCharacter(1017100).then(res => res.data.results.forEach(element => {console.log(element.name)}))


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);


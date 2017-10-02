import React from "react";
import {Router, Route, browserHistory, IndexRoute} from "react-router";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import AutorBox from "./Autor";
import LivroBox from "./Livro";
import Home from './Home';
import registerServiceWorker from "./registerServiceWorker";

ReactDOM.render(

    (<Router history={browserHistory}> 
        <Route path="/" component={App}>    
            <IndexRoute component={Home}/>
            <Route path="/autores" component={AutorBox}/>    
            <Route path="/livros" component={LivroBox}/>    
        </Route>
    </Router>), 

    document.getElementById("root"));

registerServiceWorker();

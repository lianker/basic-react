import React, { Component } from "react";
import { Link } from "react-router";
import "./css/side-menu.css";
import "./css/pure-min.css";

import AutorBox from "./Autor";

class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div id="layout">
        <a href="#menu" id="menuLink" className="menu-link">
          <span />
        </a>

        <div id="menu">
          <div className="pure-menu">
            <a className="pure-menu-heading" href="#">
              Company
            </a>

            <ul className="pure-menu-list">
              <li className="pure-menu-item">
                <Link to="/" className="pure-menu-link">
                  Home
                </Link>
              </li>
              <li className="pure-menu-item">
                <Link to="/autores" className="pure-menu-link">
                  Autor
                </Link>
              </li>
              <li className="pure-menu-item">
                <Link href="/livros" className="pure-menu-link">
                  Livro
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div id="main">
          
            {this.props.children}
          
        </div>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import PageTitle from './components/PageTitle'

export default class Home extends Component {
  render() {
    return (
      <div>
        <PageTitle text="Bem Vindo!"/>
        <div className="content" id="content">
          <img
            src="http://noticias.universia.com.br/net/images/educacion/l/li/liv/livros-gratis-download.jpg"
            alt="livros"
          />
        </div>
      </div>
    );
  }
}

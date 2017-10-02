import React, { Component } from "react";
import PubSub from "pubsub-js";
import InputCustomizado from "./components/InputCustomizado";
import BotaoSubmitCustomizado from "./components/BotaoSubmitCustomizado";
import TratadorErros from "./TratadorErros";
import PageTitle from './components/PageTitle'

class FormularioAutor extends Component {
  constructor() {
    super();
    this.state = {
      nome: "",
      email: "",
      senha: ""
    };

    this.enviaForm = this.enviaForm.bind(this);
  }

  salvaAlteracao(nomeInput,evento){
    const campo = {};
    campo[nomeInput] = evento.target.value;
    this.setState(campo);
  }

  enviaForm(event) {
    event.preventDefault();

    let dados = {
      nome: this.state.nome,
      email: this.state.email,
      senha: this.state.senha
    };

    PubSub.publish("limpa-erros", {});
    fetch("http://localhost:8080/api/autores", {
      headers: { "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify(dados)
    })
      .then(res => res.json())
      .then(res => {
        if (res.status) {
          TratadorErros.publicaErros(res);
        } else {
          PubSub.publish("atualiza-lista-autores", res);
          this.setState({ nome: "", email: "", senha: "" });
        }
      });
  }

  render() {
    return (
      <div
        className="pure-form pure-form-aligned"
        onSubmit={this.enviaForm}
        method="post"
      >
        <form className="pure-form pure-form-aligned">
          <div className="pure-control-group">
            <InputCustomizado
              id="nome"
              type="text"
              name="nome"
              value={this.state.nome}
              onChange={this.salvaAlteracao.bind(this, 'nome')}
              label="Nome"
            />
            <InputCustomizado
              id="email"
              type="email"
              name="email"
              value={this.state.email}
              onChange={this.salvaAlteracao.bind(this, 'email')}
              label="Email"
            />
            <InputCustomizado
              id="senha"
              type="password"
              name="senha"
              value={this.state.senha}
              onChange={this.salvaAlteracao.bind(this, 'senha')}
              label="Senha"
            />
          </div>

          <BotaoSubmitCustomizado text="Gravar" />
        </form>
      </div>
    );
  }
}

class TabelaAutores extends Component {
  constructor() {
    super();
    this.state = {
      lista: []
    };
  }

  render() {
    return (
      <div>
        <table className="pure-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {this.props.lista.map(autor => {
              return (
                <tr key={autor.id}>
                  <td>{autor.nome}</td>
                  <td>{autor.email}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default class AutorBox extends Component {
  constructor() {
    super();
    this.state = { lista: [] };
  }

  componentDidMount() {
    fetch("http://localhost:8080/api/autores")
      .then(res => res.json())
      .then(autores => this.setState({ lista: autores }));

    PubSub.subscribe("atualiza-lista-autores", (topico, novaLista) =>
      this.setState({ lista: novaLista })
    );
  }

  render() {
    return (
      <div>
        <PageTitle text="Cadastrar Autor"/>
        <div className="content" id="content">
          <FormularioAutor />
          <TabelaAutores lista={this.state.lista} />
        </div>
      </div>
    );
  }
}

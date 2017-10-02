import React, { Component } from "react";
import PubSub from "pubsub-js";
import InputCustomizado from "./components/InputCustomizado";
import BotaoSubmitCustomizado from "./components/BotaoSubmitCustomizado";
import TratadorErros from "./TratadorErros";
import PageTitle from "./components/PageTitle";

export default class LivroBox extends Component {
    constructor() {
        super();
        this.state = { lista: [], autores:[] };
      }
    
      componentDidMount() {
        fetch("http://localhost:8080/api/livros")
          .then(res => res.json())
          .then(livros => this.setState({ lista: livros }));
    
        PubSub.subscribe("atualiza-lista-livros", (topico, novaLista) =>
          this.setState({ lista: novaLista })
        );

        fetch("http://localhost:8080/api/autores")
        .then(res => res.json())
        .then(autores => this.setState({ autores: autores }));
      }

  render() {
    return (
      <div>
        <PageTitle text="Cadastro de Livros" />
        <div className="content" id="content">
          <FormLivros autores={this.state.autores}/>
          <TabelaLivros lista={this.state.lista}/>
        </div>
      </div>
    );
  }
}

class FormLivros extends Component {
  constructor() {
    super();
    this.state = { titulo: "", preco: "",autorId:''};

    this.setTitulo = this.setTitulo.bind(this);
    this.setPreco = this.setPreco.bind(this);
    this.setAutorId = this.setAutorId.bind(this);
    this.enviaForm = this.enviaForm.bind(this);
  }

  setTitulo(evento) {
    this.setState({ titulo: evento.target.value });
  }
  
  setAutorId(evento) {
    this.setState({autorId:evento.target.value});
  }

  setPreco(evento) {
    this.setState({ preco: evento.target.value });
  }

  enviaForm(event) {
    event.preventDefault();

    let dados = {
      titulo: this.state.titulo,
      preco: this.state.preco,
      autorId: this.state.autorId
    };

    PubSub.publish("limpa-erros", {});
    fetch("http://localhost:8080/api/livros", {
      headers: { "Content-Type": "application/json" },
      method: "post",
      body: JSON.stringify(dados)
    })
      .then(res => res.json())
      .then(res => {
        if (res.status) {
          TratadorErros.publicaErros(res);
        } else {
          PubSub.publish("atualiza-lista-livros", res);
          this.setState({ titulo: "", preco: "", autorId:'' });
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
              id="titulo"
              type="text"
              name="titulo"
              value={this.state.titulo}
              onChange={this.setTitulo}
              label="Titulo"
            />
            <InputCustomizado
              id="preco"
              type="number"
              name="preco"
              value={this.state.preco}
              onChange={this.setPreco}
              label="Preço"
            />

            <div className="pure-control-group">
              <label htmlFor="autorId">Autor</label>
              <select id="autorID" name="autorId" onChange={this.setAutorId}>
                  <option value="">Selecione um Autor...</option>
                {this.props.autores.map(autor => {
                  return (
                    <option key={autor.id} value={autor.id}>
                      {autor.nome}
                    </option>
                  );
                })}
              </select>
            </div>

          </div>

          <BotaoSubmitCustomizado text="Gravar" />
        </form>
      </div>
    );
  }
}

class TabelaLivros extends Component {
  render() {
    return (<div>
    <table className="pure-table">
      <thead>
        <tr>
          <th>Titulo</th>
          <th>Preco</th>
          <th>Autor</th>
        </tr>
      </thead>
      <tbody>
        {this.props.lista.map(livro => {
          return (
            <tr key={livro.id}>
              <td>{livro.titulo}</td>
              <td>{livro.preco}</td>
              <td>{livro.autor.nome}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>)
  }
}

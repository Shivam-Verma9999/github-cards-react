import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./styles.css";

class Form extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: ""
    };
    console.log("Form re-rendered");
  }

  handleChange = event => {
    this.setState({ searchQuery: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();
    let sq = this.state.searchQuery.trim();
    console.log(sq);
    axios.get(`https://api.github.com/users/${sq}`).then(
      response => {
        this.props.addCard(response.data);
        console.log('response.data',response.data);
        console.log('response.data.login',response.data.login);
        this.setState({ searchQuery: '' });
      }
    ).catch(reason => {
      console.log(reason);
    }).finally(() => {
      this.setState({ searchQuery: '' });
    });
  };

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          onChange={this.handleChange}
          type="text"
          name="search-query"
          value={this.state.searchQuery}
          required
          placeholder="Enter Github Username"
        />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

class Card extends React.Component {
  render() {
    return (
      <div className="github-card">
        <img
          className="user-image"
          src={this.props.avatar_url}
          alt="user  avatar"
        />
        <div className="card-info">
          <div className="username">{this.props.name || "name : n/a"}</div>
          <div className="company">{this.props.company || "company: n/a"}</div>
          <button className="profileBtn" onClick={() => { window.open(this.props.html_url, '_blank') }}>Goto profile</button>
        </div>
      </div>
    );
  }
}

class CardList extends React.Component {
  render() {
    return (
      <div className="card-list">
        {this.props.cardDetails &&
          this.props.cardDetails.map(card => <Card key={card.id} {...card} />)}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardDetails: []
    };
  }

  addCard = cardData => {
    for (let card of this.state.cardDetails) {
      console.log(card.id, cardData.id);
      if (card.id === cardData.id) {
        alert(`${cardData.login} already in list `);
        return;
      }
    }
    this.setState((prevState, props) => {
      return { cardDetails: [...prevState.cardDetails, cardData] };
    });
    console.log(this.state.cardDetails);
  };

  render() {
    return (
      <div>
        <div className="header">{this.props.title}</div>
        <Form addCard={this.addCard} />
        <CardList cardDetails={this.state.cardDetails} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App title="The Github Cards App" />, rootElement);

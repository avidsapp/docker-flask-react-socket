import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';

class App extends Component {
  state = {
    postId: "0",
    postData: "1",
    postValue: "10",
    postStatus:"On",
    postBoard: []
  }

  componentWillUnmount() {
    this.socket.close()
    console.log("Component unmounted")
  }
  componentDidMount() {
    var socketEndpoint = "https://your.socketdomain.com"
        this.socket = io.connect(socketEndpoint, {
        reconnection: true,
        // transports: ['websocket']
    });
    console.log("component mounted")
    this.socket.on("connect", message => {
        console.log("Client response - Client connected")
    })

    this.socket.on("serverMsg", message => {
      console.log(message)
    })

    this.socket.on("appendBoard", message => {
      this.setState({
        postBoard: this.state.postBoard.concat({
          message
        })
      })
      console.log(this.state.postBoard)
    })
  }

  handleEmit = () => {
    if(this.state.postStatus==="On"){
        this.socket.emit("clientMsg", {
          'data': this.state.postData,
          'value': this.state.postValue,
          'status': this.state.postStatus
        })

        this.setState({'postData':"0"})
        this.setState({'postValue':this.state.postValue})
        this.setState({'postStatus':"Off"})
    }
    else{
        this.socket.emit("clientMsg", {
          'data': this.state.postData,
          'value': this.state.postValue,
          'status': this.state.postStatus
        })

        this.setState({'postData':"1"})
        this.setState({'postValue':this.state.postValue})
        this.setState({'postStatus':"On"})
    }
    console.log("Emit Clicked")
  }
  handleChange(e) {
    this.setState({ postValue: e.target.value });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div>Data: {this.state.postData}</div>
          <div>Status: {this.state.postStatus}</div>

          <ul className="list-group list-group-flush" id="messages">
            {this.state.postBoard.map((post, idx) => (
              <li key={post.id}> {post.message} </li>
            ))}
          </ul>

          <input
            type="text"
            className="form-control"
            id="myMessage"
            value={this.state.postValue}
            onChange={ this.handleChange.bind(this) }
            placeholder={this.state.postValue}
          ></input>

          <button
            type="button"
            className="btn btn-success btn-block"
            id="sendbutton"
            onClick={this.handleEmit}
          >
            Send
          </button>
        </header>
      </div>
    );
  }
}

export default App;

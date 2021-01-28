import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';



class App extends Component {

  state = {
    isConnected: false,
    id: null,
    peeps: [],
    name: 0,
    msg: "",
    arr: {},
    messages: [],
  }
  socket = null

  // add =()=> {
  //   // var n1= prompt("enter the n1")*1;
  //   // var n2= prompt("enter the n2")*1;
  //   // var n3= prompt("enter the n3")*1;
  //   // var add = n1+n2+n3;
  //   // this.socket.emit("answer", add);

  // }


  handleTextChange = (event) => {
    let name = document.getElementById("name");
    this.setState({
      arr: {
        ...this.state.arr,
        name: name.value,
        id: this.state.id,
        text: event.target.value
      },
    });

  };


  componentWillMount() {

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on("connect_error", (data) => {
      console.log("error");
    });

    this.socket.on('connect', () => {
      this.setState({ isConnected: true })
    })

    this.socket.on('pong!', () => {
      console.log('the server answered!')
    })

    this.socket.on('pong!', (additionalStuff) => {
      console.log('server answered!', additionalStuff)
    })

    this.socket.on('youare', (answer) => {
      this.setState({ id: answer.id })
    })

    this.socket.on('disconnect', () => {
      this.setState({ isConnected: false })
    })

    this.socket.on("peeps", (socket) => {
      console.log(socket);
      this.setState({ peeps: socket });
    });

    this.socket.on("new disconnection", (disc) => {
      var filteredItems = this.state.peeps.filter(function (item) {
        return item != disc;
      });
      this.setState({ peeps: filteredItems });
    });

    this.socket.on("new connection", (connection) => {
      this.setState({ peeps: [...this.state.peeps, connection] });
    });


    this.socket.on("room", (old_messages) => {
      this.setState({ messages: old_messages });
    });



    this.socket.on('next', (message_from_server) => {
      console.log(message_from_server);
    })

    this.socket.emit("whoami");


  }

  componentWillUnmount() {
    this.socket.close()
    this.socket = null
  }



  // {/* <div> id: {this.state.id}</div> */}
  // {/* <button onClick={()=>this.socket.emit('ping!')}>ping</button> */}

  // {/* <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button> */}

  // {/* <button onClick={() => this.socket.emit("give me next")}>Next</button> */}

  // {/* <button onClick={() => this.socket.emit("addition")}> add </button> */}

  // {/* <button onClick={this.add}> num</button> */}


  render() {
    return (
      <div className="App">

        <div className="title"> Chatting Room </div>


        <input
          className="hide"
          id="name"
          type="text"
          name="name"
          value="Farah Haddar"
          disabled
        />

        <div className=" containor"  >
          
          <div className="head">
            Messages
           </div>

          <div className="scroll" >
                    <div className="status"> {this.state.isConnected ? 'connected' : 'disconnected'}</div>

            {this.state.messages.map((msg) => (

              <div className="msg"  >

               <div className="name"> {msg.name}</div>
               <div className="body"  >
               <div className="text"> {typeof msg.text === "string" ? msg.text : ""}</div>
               <div className="date">{msg.date}</div>
              </div>
              </div>

            ))}

          </div>

        <div className="inpt">
            <input
              className="inp"
              type="text"
              name="msg"
              placeholder="Send A Message"
              onChange={this.handleTextChange}
            />
            <button className="butt" onClick={() => this.socket.emit("message", this.state.arr)}> Send </button>

          </div> 









        </div>













      </div>


    );

  }
}

export default App;
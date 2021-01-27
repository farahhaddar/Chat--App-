import React, { Component } from 'react';
import io from 'socket.io-client';
import './App.css';



class App extends Component {
  
  state = {
    isConnected:false,
    id:null,
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
        text: event.target.value,
      },
    });
  };



  componentWillMount(){

    this.socket = io('https://codi-server.herokuapp.com');

    this.socket.on("connect_error", (data) => {
      console.log("error");
    }); 

    this.socket.on('connect', () => {
      this.setState({isConnected:true})
    })
     
    this.socket.on('pong!',()=>{
      console.log('the server answered!')
    })
    this.socket.emit("whoami");

    this.socket.on('pong!',(additionalStuff)=>{
      console.log('server answered!', additionalStuff)
    })
    
    this.socket.on('youare',(answer)=>{
      this.setState({id:answer.id})
    })

    this.socket.on('disconnect', () => {
      this.setState({isConnected:false})
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
   

    
     this.socket.on('next',(message_from_server)=> {
       console.log(message_from_server);
    })
    

   
  }

  componentWillUnmount(){
    this.socket.close()
    this.socket = null
  }

  
    render() {
      return (
      <div className="App">

      
        {/* <div> id: {this.state.id}</div> */}
        {/* <button onClick={()=>this.socket.emit('ping!')}>ping</button> */}
       
        {/* <button onClick={()=>this.socket.emit('whoami')}>Who am I?</button> */}

        {/* <button onClick={() => this.socket.emit("give me next")}>Next</button> */}

        {/* <button onClick={() => this.socket.emit("addition")}> add </button> */}
        
        {/* <button onClick={this.add}> num</button> */}
        <div className="status">status: {this.state.isConnected ? 'connected' : 'disconnected'}</div>
      
        <div  className="title"> Chatting Room </div>

      <div  className="body">
        <input
        className="name"
        id="name"
          type="text"
          name="name"
          value="Farah Haddar"
          disabled
        />
  <div   className="inpt"  style={{textAlign:"center", position:"fixed",marginTop:"500px"}}>
        
        <input
        className="inp"
          type="text"
          name="msg"
          placeholder="Send A Message"
          onChange={this.handleTextChange}
        />
       
   
        <button className="butt" onClick={() => this.socket.emit("message",this.state.arr )}> Send</button>
        </div>

       {/* {this.state.peeps.map((user) => (
          <li>{user}</li>
        ))}  */}

             {this.state.messages.map((msg) => (
            
            <tr > 
           <div className="tddd">
            <td className="tdd">{msg.name}</td>
            <td className="td">
              {typeof msg.text === "string" ? msg.text : ""} 
              </td> 
              </div>
          </tr>
          
            ))} 
       

       </div>
</div>

    );
    
    }
}

export default App;
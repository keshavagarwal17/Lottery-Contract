import './App.css';
import lottery from './lottery';
import React, { useState, useEffect } from 'react';
import web3 from './web3';

function App() {
  const [obj, setValue] = useState({
    manager: '',
    players: [],
    balance: ''
  });

  const [inpEther,setEther] = useState('');
  const [message,setMessage] = useState('');
  const [accounts,setAccount] = useState([]);
  
  const fetchData = async() => {
    let manager = await lottery.methods.manager().call();
    let players = await lottery.methods.getPlayers().call();
    let balance = await web3.eth.getBalance(lottery.options.address);
    balance = web3.utils.fromWei(balance,'ether');
    let acc = await web3.eth.getAccounts();
    setAccount(acc);
    setValue({manager,players,balance});
  }

  const onSubmit = async(e) =>{
    e.preventDefault();
    if(inpEther <= 0.01){
      setMessage("Enter Amount must be greater than 0.01 ether");
      return;
    }
    const accounts = await web3.eth.getAccounts();
    setMessage("Waiting for your transaction to complete...");
    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei(inpEther,'ether')
    })
    setMessage("You Successfully Entered!!")
  }

  const pickWinner = async() =>{
    const accounts = await web3.eth.getAccounts();

    setMessage("Waiting for your transaction to complete...");
    
    await lottery.methods.pickWinner().send({
      from:accounts[0],
    })

    setMessage("A winner has been picked!!")
  }

  useEffect(() => {
    fetchData();
  },[]);
  
  return (
    <div className="App">
      <h2>Lotter Contract</h2>
      <p>
        This contract is managed by {obj.manager}. <br />
        There are currently {obj.players.length} people enterted, competiting to win {obj.balance} ether !!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input 
              placeholder='Enter Ether'
              type="number"
              value={inpEther}
              onChange={(e) => setEther(e.target.value)}
          />
        </div>
        <button>Enter</button>
      </form>

      
      {(accounts[0] === obj.manager) ? <div>
        <hr />
        <h4> Time to pick a winner</h4>
        <button onClick = {pickWinner}> Pick a Winner !</button>
      </div>:<></>}
      
      <hr />
      
      <h1>{message}</h1>

    </div>
  );
}

export default App;

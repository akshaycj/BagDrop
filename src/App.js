import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'

import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import {Button} from 'antd'
import Home from './Home'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      add:'',
      key:"Key",
      flight:'',
      pass:'', from:'',to:''
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.
    this.setState({key:"Key",pass:"Hashim",flight:"1234555",from:"ABC",to:"CDE"})
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance
    var retstr;
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance



        console.log("addd",instance.address);
        this.setState({add:instance.address})
        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(6, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      }).then((result) =>{

        return simpleStorageInstance.StoreData(this.state.key,this.state.pass,this.state.flight,this.state.from,this.state.to,{from:accounts[0]})
      }).then((result) =>{
        console.log("sas",true);
      })
      .then((result) => {
        return simpleStorageInstance.RetrieveData("Key")
      }).then((result) =>{

        console.log("res",result);
      })

    })
  }

  render() {
    return (
      <div >



              <Home flight={this.state.flight} pass={this.state.pass} from={this.state.from} to={this.state.to}/>
      </div>
    );
  }
}

export default App
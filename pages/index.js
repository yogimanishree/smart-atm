import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const accounts = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(accounts);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async () => {
    if (atm) {
      let tx = await atm.deposit(1);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async () => {
    if (atm) {
      let tx = await atm.withdraw(1);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>Please connect your Metamask wallet</button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={deposit}>Deposit 1 ETH</button>
        <button onClick={withdraw}>Withdraw 1 ETH</button>
        <div>
          <h2>Financial Goals</h2>
          <form onSubmit={addGoal}>
            <input
              type="text"
              placeholder="Enter your goal"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <button type="submit">Add Goal</button>
          </form>
          <ul>
            {goals.map((goal, index) => (
              <li key={index}>
                <span className="goal-number">{index + 1}.</span> {goal}
                <button onClick={() => removeGoal(index)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const addGoal = (e) => {
    e.preventDefault();
    if (newGoal.trim() !== "") {
      setGoals([...goals, newGoal]);
      setNewGoal("");
    }
  };

  const removeGoal = (index) => {
    const updatedGoals = [...goals];
    updatedGoals.splice(index, 1);
    setGoals(updatedGoals);
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Metacrafters ATM!</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
        }
        h2 {
          margin-bottom: 10px;
        }
        form {
          margin-bottom: 10px;
        }
        input[type="text"] {
          padding: 5px;
          margin-right: 10px;
        }
        button[type="submit"] {
          padding: 5px 10px;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin-bottom: 5px;
        }
        .goal-number {
          font-weight: bold;
          margin-right: 5px;
        }
        button {
          margin-left: 10px;
          padding: 3px 8px;
        }
      `}</style>
    </main>
  );
}

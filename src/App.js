import React, { useState, useEffect } from "react";
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Mint from './components/Mint';
import Web3 from 'web3';

function App() {

  const [isConnected, setIsConnected] = useState(false);
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const checkConnectedWallet = async () => {
      const userData = JSON.parse(localStorage.getItem('userAccount'));
      if (userData != null) {
        setUserInfo(userData);
        setIsConnected(true);
      }
    }

    checkConnectedWallet();
  }, []);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
    } else if (window.web3) {
      // eslint-disable-next-line
      provider = window.web3.currentProvider;
    } else {
      console.log(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
    return provider;
  };

  const onConnect = async () => {
    try {
      const currentProvider = detectCurrentProvider();
      if (currentProvider) {
        if (currentProvider !== window.ethereum) {
          console.log(
            'Non-Ethereum browser detected. You should consider trying MetaMask!'
          );
        }
        await currentProvider.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(currentProvider);
        const userAccount = await web3.eth.getAccounts();
        const chainId = await web3.eth.getChainId();
        const account = userAccount[0];
        let ethBalance = await web3.eth.getBalance(account); // Get wallet balance
        ethBalance = web3.utils.fromWei(ethBalance, 'ether'); //Convert balance to wei
        saveUserInfo(ethBalance, account, chainId);
        if (userAccount.length === 0) {
          console.log('Please connect to meta mask');
        }
      }
    } catch (err) {
      console.log(
        'There was an error fetching your accounts. Make sure your Ethereum client is configured correctly.'
      );
    }
  };

  const onDisconnect = () => {
    window.localStorage.removeItem('userAccount');
    setUserInfo({});
    setIsConnected(false);
  };

  const saveUserInfo = (ethBalance, account, chainId) => {
    const userAccount = {
      account: account,
      balance: ethBalance,
      connectionid: chainId,
    };
    window.localStorage.setItem('userAccount', JSON.stringify(userAccount)); //user persisted data
    const userData = JSON.parse(localStorage.getItem('userAccount'));
    setUserInfo(userData);
    setIsConnected(true);
  };

  return (
    <>
      <div className="wrapper">
        <header>
            <div className="container">
                <nav className="navbar navbar-expand-lg">
                    <a className="navbar-brand" href="/">
                        <img src="images/your-logo.png" alt="" />
                    </a>
                    <div className='flex'>
                      <a href="#" className="general-btn mr-10" data-bs-toggle="modal" data-bs-target="#exampleModal">
                          <span className="dashboard-icon">
                              <img src="images/grid-icon.svg" alt="" />
                              <span>13</span>
                          </span>
                          DASHBOARD
                      </a>
                      {!isConnected && <button className="general-btn" type='button' onClick={onConnect}>
                          <span className="dashboard-icon">
                              <img src="images/grid-icon.svg" alt="" />
                          </span>
                          WalletConnect
                      </button>}
                      {isConnected && <button className="general-btn" type='button' onClick={onDisconnect}>
                          <span className="dashboard-icon">
                              <img src="images/grid-icon.svg" alt="" />
                          </span>
                          Disconnect{userInfo.account.slice(0,4)}...{userInfo.account.slice(38)}
                      </button>}
                      <a href="#" className="dashboard-btn-moble mr-10" data-bs-toggle="modal" data-bs-target="#exampleModal">
                          <img src="images/grid-green-icon.svg" alt="" />
                          <span>13</span>
                      </a>
                      {!isConnected && <button className="dashboard-btn-moble bg-transparent" type='button' onClick={onConnect}>
                          <img src="images/metamask.png" alt="" />
                      </button>}
                      {isConnected && <button className="dashboard-btn-moble bg-transparent" type='button' onClick={onDisconnect}>
                          <img src="images/dismetamask.png" alt="" />
                      </button>}
                    </div>
                    
                </nav>
            </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mint" element={<Mint />} />
        </Routes>

        <footer>
            <div className="container">
                <img src="images/footer-img.png" className="footer-img" alt="" />
                <img src="images/footer-img-mobile.png" className="footer-img-mble" alt="" />
            </div>
            <div className="footer-content">
                <div className="container">
                    <div className="footer-inner">
                        <a href="#"><span>NFTS</span> WEBSITE</a>
                    </div>
                </div>
            </div>
        </footer>

    </div>

    <div className="modal fade dashboard-modal" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-body">
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    <img src="images/modal-img.png" className="modal-img" alt="" />
                    <h3>DASHBOARD</h3>
                    <p>WILL GO LIVE AFTER THE MINT IS COMPLATE</p>
                </div>
            </div>
        </div>
    </div>
    </>
  );
}

export default App;

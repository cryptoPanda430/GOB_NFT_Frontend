import React, { useState } from "react";
import { useEffect } from "react";
import {ContractAddress, ContractABI} from '../ContractABI'
import { ethers } from 'ethers';

function Mint() {

    const [amount, setAmount] = useState(1) 
    const [isConnected, setIsConnected] = useState(false);
    const [userInfo, setUserInfo] = useState({});
    const [maxSupply, setMaxSupply] = useState();
    const [totalSupply, setTotalSupply] = useState()
    const { ethereum } = window;

    useEffect(() => {
        const checkConnectedWallet = async () => {
            const userData = JSON.parse(localStorage.getItem('userAccount'));
            if (userData != null) {
                setUserInfo(userData);
                setIsConnected(true);
            }
            if(ethereum) {
        
                const provider = new ethers.providers.Web3Provider(ethereum);
                const singer = provider.getSigner();
                try {
                    const contract = new ethers.Contract(ContractAddress, ContractABI, singer);

                    let maxamount = await contract.maxSupply()
                    let totalamount = await contract.totalSupply()
                    setMaxSupply(parseInt(maxamount));
                    setTotalSupply(parseInt(totalamount));
                    console.log("~~~~~~~~~~~~~~~~~~~~~", maxamount, totalamount);
                } catch (error) {
                    alert("Contract Error!");
                }
            }
        }
        checkConnectedWallet();
    }, [])

    const addAmount = () => {
        setAmount(amount + 1);
    }

    const minusAmount = () => {
        if(amount === 1) {
            setAmount(1);
        }
        else {
            setAmount(amount - 1);
        }
    }

    const mintNow = async () => {
        if(ethereum) {
        
            const provider = new ethers.providers.Web3Provider(ethereum);
            const singer = provider.getSigner();
            try {
                const contract = new ethers.Contract(ContractAddress, ContractABI, singer);
                let gasPrice = await provider.getGasPrice();
                // gasprice.wait();
                // console.log("Current gas price", gasPrice, provider?.provider?.selectedAddress);
                // gasPrice.mul(2);
                const transaction = await contract.mint( amount , { value: ethers.utils.parseEther("0.05").mul(amount)})
                //sends 0.1 eth
                // const transaction = await contract.maxSupply();
                const res = await transaction.wait()
                console.log('~~~~~~~~~~~~~~~~~~~~~~', res);
                if(res)
                    alert('Minting Success!')
                setTotalSupply(totalSupply + amount);
                
            } catch (error) {
                alert("Contract Error!");
            }
        }
    }

  return (
    
    <div className="content">
        <section className="nft-mint-sec-wrap">
            <div className="container">
                <div className="nft-mint-sec-row">
                    <div className="nft-mint-img-col" data-aos="fade-right" data-aos-duration="800">
                        <div className="nft-mint-img">
                            <img src="images/nft-mint-img.png" alt="" />
                        </div>
                    </div>
                    <div className="nft-mint-content-col" data-aos="fade-left" data-aos-duration="800">
                        <div className="nft-mint-content">
                            <h2>NFT MINT SECTION</h2>
                            <span>{totalSupply} / {maxSupply} MINTED</span>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse consectetur,
                                risus vel aliquet hendrerit, odio mi rutrum nibh, nec aliquam massa est sit amet
                                purus. Suspendisse semper pretium libero, sed hendrerit augue lobortis id. Donec
                                porttitor </p>
                            <span id="countdown"></span>
                            <div className="add-to-cart-wrap">
                                <div className="add-to-cart">
                                    <button type="button" className="plus" onClick={addAmount}>
                                        <img src="images/plus-icon-black.svg" alt="" />
                                    </button>
                                    <label htmlFor="amount">{amount}</label>
                                    <button type="button" className="minus" onClick={minusAmount}>
                                        <img src="images/minus-icon-black.svg" alt="" />
                                    </button>
                                </div>
                                <a href="#" className="general-btn" onClick={mintNow}>MINT NOW</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="nft-card-wrap">
            <div className="container">
                <div className="row nft-card-row">
                    <div className="col-md-6 col-lg-4 nft-card-col" data-aos="zoom-in" data-aos-duration="800">
                        <div className="nft-card">
                            <div className="nft-card-content">
                                <img src="images/nft-card-img1.png" alt="" />
                                <h4>NFTS</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiing elit. Consectetur, risus vel
                                    aliquet hendrerit, odio mi rutrum nibh.aliquam massa est sit amet purus.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 nft-card-col" data-aos="zoom-in" data-aos-duration="800"
                        data-aos-delay="200">
                        <div className="nft-card">
                            <div className="nft-card-content">
                                <img src="images/nft-card-img2.png" alt="" />
                                <h4>MINT</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiing elit. Consectetur, risus vel
                                    aliquet hendrerit, odio mi rutrum nibh.aliquam massa est sit amet purus.</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-4 nft-card-col" data-aos="zoom-in" data-aos-duration="800"
                        data-aos-delay="400">
                        <div className="nft-card">
                            <div className="nft-card-content">
                                <img src="images/nft-card-img3.png" alt="" />
                                <h4>METAVERSE</h4>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiing elit. Consectetur, risus vel
                                    aliquet hendrerit, odio mi rutrum nibh.aliquam massa est sit amet purus.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>

  );
}

export default Mint;

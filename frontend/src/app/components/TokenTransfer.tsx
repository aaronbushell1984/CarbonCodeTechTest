import {useContract, useContractRead, useSDK} from "@thirdweb-dev/react";
import React, { useState } from "react";
import { ethers } from "ethers";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function TokenTransfer() {
    const sdk = useSDK();
    const [amount, setAmount] = useState("0");
    const [amountIsValid, setAmountIsValid] = useState(true);
    const [destination, setDestination] = useState(null);
    const [destinationIsEdited, setDestinationIsEdited] = useState(false);
    const [destinationIsValid, setDestinationIsValid] = useState(false);
    const [explorerLink, setExplorerLink] = useState("");
    const [transferLoading, setTransferLoading] = useState(false);

    const [balanceAddress, setBalanceAddress] = useState<string | null>(null);
    const [balanceAddressIsEdited, setBalanceAddressIsEdited] = useState(false);
    const [balanceAddressIsValid, setBalanceAddressIsValid] = useState(false);
    const [balanceAddressLoading, setBalanceAddressLoading] = useState(false);
    const [balance, setBalance] = useState<string | null>(null);

    // TODO: Environment configuration contract address
    const contractAddress = "0x8830D3646E5432970871e60c18BF6eB2a279517b";
    const { contract } = useContract(contractAddress);

    const handleAmountChange = (e) => {
        const selectedAmount = e.target.value;
        if (selectedAmount <= 0) {
            setAmountIsValid(false);
        } else {
            setAmountIsValid(true);
        }
        setExplorerLink("");
        setAmount(((e.target.value)*10**18).toString());
    }

    const handleTransferDestinationAddressChange = (e) => {
        const selectedAddress = e.target.value;
        setDestinationIsEdited(true);
        if (selectedAddress == ethers.constants.AddressZero || !ethers.utils.isAddress(selectedAddress)) {
            setDestinationIsValid(false);
        } else {
            setDestinationIsValid(true);
        }
        setExplorerLink("");
        setDestination(e.target.value);
    }

    const handleBalanceAddressChange = (e) => {
        const selectedAddress = e.target.value;
        setBalanceAddressIsEdited(true);
        setBalance(null);
        if (selectedAddress == ethers.constants.AddressZero || !ethers.utils.isAddress(selectedAddress)) {
            setBalanceAddressIsValid(false);
        } else {
            setBalanceAddressIsValid(true);
        }
        setBalanceAddress(e.target.value);
    }

    const handleTransferSubmit = async (e) => {
        e.preventDefault();
        setTransferLoading(true);
        setExplorerLink("");
        try {
            const { receipt }  = await contract.call("transfer", [destination, amount]);
            if (receipt.status === 1 && receipt.transactionHash) {
                // TODO: configuration for any explorer centrally
                const explorerUrl = "https://mumbai.polygonscan.com/tx/"
                setExplorerLink(`${explorerUrl}${receipt.transactionHash}`)
            }
        } catch (error) {
            alert("transfer failed - check wallet")
        }
        setTransferLoading(false);
    }

    const handleBalanceSubmit = async (e) => {
        e.preventDefault();
        setBalanceAddressLoading(true);
        try {
            const data = await contract.call("balanceOf", [balanceAddress]);
            const tokens = data/10**18;
            setBalance(tokens?.toString());
        } catch (error) {
            alert("balance retrieval failed - check wallet")
            setBalanceAddressIsValid(false);
            setBalanceAddressIsEdited(false);
        }
        setBalanceAddressLoading(false);
    }

    return (
        <>
            <div className="w-full max-w-xs">
                <form
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={(e) => handleBalanceSubmit(e)}
                >
                    <div className="mb-4">
                        {(!balanceAddressLoading ) ? (
                            <h3 className="block text-center text-gray-700 text-m font-bold mb-2">Balances</h3>
                        ) : (
                            <h3 className="block text-center text-violet-700 text-m font-bold mb-2 animate-pulse">Getting Balance...</h3>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="balanceAddress">
                            Address
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${balanceAddressIsEdited && !balanceAddressIsValid ? 'border-red-500' : ''}`}
                            id="balanceAddress"
                            type="text"
                            placeholder="0x..."
                            disabled={balanceAddressLoading}
                            onChange={(e) => handleBalanceAddressChange(e)}
                        />
                        { balance ? (
                            <p className="text-violet-500 text-xs italic">Token Balance: <strong>{balance}</strong></p>
                        ) : (balanceAddressIsEdited && !balanceAddressIsValid) ? (
                            <p className="text-red-500 text-xs italic">Please choose a valid address</p>
                        ) : (
                            ""
                        )}

                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 min-w-full rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                            type="submit"
                            disabled={!balanceAddressIsValid || balanceAddressLoading}
                        >
                            {balanceAddressLoading ? (
                                <LoadingSpinner />
                            ) : (
                                'Check Balance'
                            )}
                        </button>
                    </div>

                </form>
            </div>

            <div className="w-full max-w-xs">
                <form
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={(e) => handleTransferSubmit(e)}
                >
                    <div className="mb-4">
                        {(!transferLoading ) ? (
                            <h3 className="block text-center text-gray-700 text-m font-bold mb-2">Transfer Tokens</h3>
                        ) : (
                            <h3 className="block text-center text-violet-700 text-m font-bold mb-2 animate-pulse">Pending Transfer...</h3>
                        )}

                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                            Amount
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 ${!amountIsValid ? 'border-red-500' : ''}`}
                            id="amount"
                            type="number"
                            step="1"
                            placeholder="1"
                            min="1"
                            disabled={transferLoading}
                            onChange={(e) => handleAmountChange(e)}
                        />
                        {!amountIsValid && (
                            <p className="text-red-500 text-xs italic">Please choose a valid amount</p>
                        )}
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                            Destination
                        </label>
                        <input
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${destinationIsEdited && !destinationIsValid ? 'border-red-500' : ''}`}
                            id="destination"
                            type="text"
                            placeholder="0x..."
                            disabled={transferLoading}
                            onChange={(e) => handleTransferDestinationAddressChange(e)}
                        />
                        {(destinationIsEdited && !destinationIsValid) && (
                            <p className="text-red-500 text-xs italic">Please choose a valid address</p>
                        )}

                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-violet-500 hover:bg-violet-700 text-white font-bold py-2 px-4 min-w-full rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 mb-4"
                            type="submit"
                            disabled={!amountIsValid || !destinationIsValid || transferLoading}
                        >
                            {transferLoading ? (
                                <LoadingSpinner />
                            )  : (
                                'Transfer'
                            )}
                        </button>
                    </div>
                    {(explorerLink !== "") && (
                        <>
                            <p className="text-green-500 text-xs italic">Success:{' '}
                                <a className="text-violet-500 text-xs underline" href={explorerLink} target="_blank">Explorer Confirmation</a>
                            </p>

                        </>
                    )}

                </form>
            </div>
        </>
    )
}
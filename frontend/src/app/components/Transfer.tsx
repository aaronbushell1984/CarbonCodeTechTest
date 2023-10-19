import { useSDK } from "@thirdweb-dev/react";
import { useState } from "react";
import { ethers } from "ethers";

export default function Transfer() {
    const sdk = useSDK();

    const [transferAmount, setTransferAmount] = useState("0");
    const [transferAmountIsValid, setTransferAmountIsValid] = useState(true);
    const [transferDestination, setTransferDestination] = useState(null);
    const [destinationIsEdited, setDestinationIsEdited] = useState(false);
    const [transferDestinationIsValid, setTransferDestinationIsValid] = useState(false);
    const [explorerLink, setExplorerLink] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAmountChange = (e) => {
        const selectedAmount = e.target.value;
        if (selectedAmount <= 0) {
            setTransferAmountIsValid(false);
        } else {
            setTransferAmountIsValid(true);
        }
        setExplorerLink(null);
        setTransferAmount(e.target.value);
    }

    const handleTransferDestinationAddressChange = (e) => {
        const selectedAddress = e.target.value;
        setDestinationIsEdited(true);
        if (selectedAddress == ethers.constants.AddressZero || !ethers.utils.isAddress(selectedAddress)) {
            setTransferDestinationIsValid(false);
        } else {
            setTransferDestinationIsValid(true);
        }
        setExplorerLink(null);
        setTransferDestination(e.target.value);
    }

    const handleTransferSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const txResult = await sdk.wallet.transfer(transferDestination, transferAmount);
            const receipt = await txResult.receipt;
            setLoading(false);
            if (receipt.status === 1 && receipt.transactionHash) {
                // TODO: configuration for any explorer centrally
                const explorerUrl = "https://mumbai.polygonscan.com/tx/"
                setExplorerLink(`${explorerUrl}${receipt.transactionHash}`)
            }
        } catch (error) {
            alert("transfer failed - check wallet")
            setLoading(false);
            setTransferAmountIsValid(false);
            setTransferDestinationIsValid(false);
            setDestinationIsEdited(false);
        }
    }

    return (
        <div className="w-full max-w-xs">
            <form
                className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                onSubmit={(e) => handleTransferSubmit(e)}
            >
                <div className="mb-4">
                    {(!loading ) ? (
                        <h3 className="block text-center text-gray-700 text-m font-bold mb-2">Transfer</h3>
                    ) : (
                        <h3 className="block text-center text-green-700 text-m font-bold mb-2 animate-pulse">Pending Transfer...</h3>
                    )}

                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                        Amount
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 ${!transferAmountIsValid ? 'border-red-500' : ''}`}
                        id="amount"
                        type="number"
                        step="0.00001"
                        placeholder="0.00001"
                        min="0"
                        disabled={loading}
                        onChange={(e) => handleAmountChange(e)}
                    />
                    {!transferAmountIsValid && (
                        <p className="text-red-500 text-xs italic">Please choose a valid amount</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="destination">
                        Destination
                    </label>
                    <input
                        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline ${destinationIsEdited && !transferDestinationIsValid ? 'border-red-500' : ''}`}
                        id="destination"
                        type="text"
                        placeholder="0x..."
                        disabled={loading}
                        onChange={(e) => handleTransferDestinationAddressChange(e)}
                    />
                    {(destinationIsEdited && !transferDestinationIsValid) && (
                        <p className="text-red-500 text-xs italic">Please choose a valid address</p>
                    )}

                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-gray-400 mb-4"
                        type="submit"
                        disabled={!transferAmountIsValid || !transferDestinationIsValid || loading}
                    >
                        Transfer
                    </button>
                </div>
                {(explorerLink !== "") && (
                    <>
                        <p className="text-green-500 text-xs italic">Success:{' '}
                            <a className="text-blue-500 text-xs underline" href={explorerLink} target="_blank">Explorer Confirmation</a>
                        </p>

                    </>
                )}

            </form>
        </div>
    )
}
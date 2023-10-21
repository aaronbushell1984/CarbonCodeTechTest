"use client";

// Use components/ provider due to add use-client for App Router
// See: https://portal.thirdweb.com/react/getting-started
import { ThirdwebProvider } from "./components/ThirdwebProvider";
import { ConnectWallet, coinbaseWallet, metamaskWallet, walletConnect, WalletConfig } from "@thirdweb-dev/react";
import { useState } from "react";
import NativeTransfer from "@/app/components/NativeTransfer";
import TokenTransfer from "@/app/components/TokenTransfer";

export default function Home() {
  const [isNative, setIsNative] = useState(true);

  const toggleTransfer = () => {
    if (isNative) {
      setIsNative(false);
    } else {
      setIsNative(true);
    }
  }

  return (
      <ThirdwebProvider
          activeChain="mumbai"
          clientId="72768a8a6a8072084620b1c8b4fe56c4"
          supportedWallets={[metamaskWallet(), coinbaseWallet(), walletConnect()] as WalletConfig<any>[]}
      >
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
            <p
                className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 cursor-pointer hover:bg-violet-500"
                onClick={toggleTransfer}
            >
              {(isNative) ? "Carbon Tokens" : "Native Transfers"}
            </p>
            <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
              <ConnectWallet />
            </div>
          </div>
          {(isNative) ? (
              <NativeTransfer />
          ) : (
              <TokenTransfer />
          )}


          <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
            <a
                href="https://github.com/aaronbushell1984/CarbonCodeTechTest"
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold text-violet-500`}>
                Source{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                Find source code and README information to run locally
              </p>
            </a>

            <a
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                onClick={toggleTransfer}
            >
              <h2 className={`mb-3 text-2xl font-semibold text-violet-500`}>
                Interact{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                Transfer and obtain address balances of assets
              </p>
            </a>

            <a
                href="https://portal.thirdweb.com/"
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold text-violet-500`}>
                Thirdweb{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                Explore Thirdweb framework documentation
              </p>
            </a>

            <a
                href="https://mumbai.polygonscan.com/token/0x8830D3646E5432970871e60c18BF6eB2a279517b#code"
                className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
                target="_blank"
                rel="noopener noreferrer"
            >
              <h2 className={`mb-3 text-2xl font-semibold text-violet-500`}>
                Explorer{' '}
                <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
              </h2>
              <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
                View and interact with verified contract on Polygonscan
              </p>
            </a>
          </div>
        </main>
      </ThirdwebProvider>
  )
}

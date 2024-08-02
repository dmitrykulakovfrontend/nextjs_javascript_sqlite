import "@/styles/globals.css";

import {Inter} from "next/font/google";
import {cn} from "@/lib/utils";
import {SessionProvider} from "next-auth/react";

const fontInter = Inter({subsets: ["latin"], variable: "--font-inter"});

export default function App({Component, pageProps}) {
    return (
        <SessionProvider>
            <div
                className={cn(
                    "min-h-screen bg-background font-inter antialiased",
                    fontInter.variable
                )}
            >
                <Component {...pageProps} />
            </div>
        </SessionProvider>
    );
}

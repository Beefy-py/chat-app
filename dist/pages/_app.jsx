"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("next-auth/react");
const api_1 = require("@/utils/api");
require("@/styles/globals.css");
const script_1 = __importDefault(require("next/script"));
const MyApp = ({ Component, pageProps: { session, ...pageProps }, }) => {
    return (<>
      {" "}
      <react_1.SessionProvider session={session}>
        <Component {...pageProps}/>
      </react_1.SessionProvider>
      <script_1.default src="https://kit.fontawesome.com/8e5bc578dd.js" crossOrigin="anonymous"></script_1.default>
    </>);
};
exports.default = api_1.api.withTRPC(MyApp);

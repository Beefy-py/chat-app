"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const document_1 = require("next/document");
function Document() {
    return (<document_1.Html className="h-screen bg-gray-50">
      <document_1.Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5"/>
      </document_1.Head>
      <body className="h-full">
        <document_1.Main />
        <document_1.NextScript />
      </body>
    </document_1.Html>);
}
exports.default = Document;

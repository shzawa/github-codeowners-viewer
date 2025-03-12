// ==UserScript==
// @name show-codeowners-on-files-changed
// @namespace    https://gist.github.com/shzawa/c5ba5fc3908bea7f7927894f03bb20fa
// @version      1.0
// @description  Files changed のページで CODEOWNER を最初から表示してくれる君
// @author       shzawa
// @match        https://github.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// ==/UserScript==

'use strict';

const headers = Array.from(document.querySelectorAll('.file-header'))
headers.forEach(header => {
    const ownedByUserDescription = header.querySelector(".file-info > .Link--secondary > span").getAttribute('aria-label')
    header.append(ownedByUserDescription, document.createElement("div"))
})

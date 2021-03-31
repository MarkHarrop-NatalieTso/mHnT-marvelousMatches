const marvelApp = {};
const NUMBER_CHARACTERS = 8;

marvelApp.apiUrl = "http://gateway.marvel.com/v1/public/characters";
marvelApp.apiKey = "a3134eefb2e9287cec66be10c3f7e87f";
marvelApp.privKey = "2ba98ab85aadbb6df982e71ce51d61e40fd027bd";
marvelApp.characterIdArray = [
    1009368,
    1009220,
    1009351,
    1009664,
    1009417,
    1009407,
    1009189,
    1009697,
    1009610,
    1009187,
    1009577,
    1009562,
    1009282,
    1009652,
    1010743,
    1009338,
    1009718,
    1009465,
    1009504,
    1009265
]

// MD5 stuff found on the internet courtesy of Chris Coyier
var MD5 = function (string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
    }
    function AddUnsigned(lX, lY) {
        var lX4, lY4, lX8, lY8, lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
    function F(x, y, z) { return (x & y) | ((~x) & z); }
    function G(x, y, z) { return (x & z) | (y & (~z)); }
    function H(x, y, z) { return (x ^ y ^ z); }
    function I(x, y, z) { return (y ^ (x | (~z))); }
    function FF(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function GG(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function HH(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function II(a, b, c, d, x, s, ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1 = lMessageLength + 8;
        var lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
        var lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
        var lWordArray = Array(lNumberOfWords - 1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while (lByteCount < lMessageLength) {
            lWordCount = (lByteCount - (lByteCount % 4)) / 4;
            lBytePosition = (lByteCount % 4) * 8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount - (lByteCount % 4)) / 4;
        lBytePosition = (lByteCount % 4) * 8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
        lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
        lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
        return lWordArray;
    };
    function WordToHex(lValue) {
        var WordToHexValue = "", WordToHexValue_temp = "", lByte, lCount;
        for (lCount = 0; lCount <= 3; lCount++) {
            lByte = (lValue >>> (lCount * 8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length - 2, 2);
        }
        return WordToHexValue;
    };
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
    var x = Array();
    var k, AA, BB, CC, DD, a, b, c, d;
    var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
    var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
    var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
    var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
    for (k = 0; k < x.length; k += 16) {
        AA = a; BB = b; CC = c; DD = d;
        a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
        d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
        c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
        b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
        a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
        d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
        c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
        b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
        a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
        d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
        c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
        b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
        a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
        d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
        c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
        b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
        a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
        d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
        c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
        b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
        a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
        d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
        c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
        b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
        a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
        d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
        c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
        b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
        a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
        d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
        c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
        b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
        a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
        d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
        c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
        b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
        a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
        d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
        c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
        b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
        a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
        d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
        c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
        b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
        a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
        d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
        c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
        b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
        a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
        d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
        c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
        b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
        a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
        d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
        c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
        b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
        a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
        d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
        c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
        b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
        a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
        d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
        c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
        b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
        a = AddUnsigned(a, AA);
        b = AddUnsigned(b, BB);
        c = AddUnsigned(c, CC);
        d = AddUnsigned(d, DD);
    }
    var temp = WordToHex(a) + WordToHex(b) + WordToHex(c) + WordToHex(d);
    return temp.toLowerCase();
}
marvelApp.ts = new Date().getTime();
marvelApp.hash = MD5(marvelApp.ts + marvelApp.privKey + marvelApp.apiKey).toString();

// function to get data from API
marvelApp.getCharacter = async (characterId) => {
    const url = new URL(`${marvelApp.apiUrl}/${characterId}`);
    url.search = new URLSearchParams({
        ts: marvelApp.ts,
        apikey: marvelApp.apiKey,
        hash: marvelApp.hash
    });
    const response = await fetch(url)
    return response.json()
}

// function to shuffle array of info from API
marvelApp.shuffle = array => {
    // for loop swaps two objs in array at a time to *shuffle
    for (let i = 0; i < array.length; i++) {
        let j = Math.floor(Math.random() * array.length);
        let k = Math.floor(Math.random() * array.length);
        if (k == j) {
            if (k == (array.length - 1)) {
                j--;
            } else {
                j++;
            }
        };
        let temp = array[k];
        array[k] = array[j];
        array[j] = temp;
    }
    return array;
}

// function to get and store array of requested info from API
marvelApp.getCharacterArray = async quantity => {
    let characterIds = [];
    // for loop to select random ids of quantity given from character id array to be used on game board
    for (let i = 0; i < quantity; i++) {
        let characterId;

        // loop to check for duplicate id in array
        do {
            characterId = marvelApp.characterIdArray[Math.floor(Math.random() * 20)];
        } while (characterIds.includes(characterId));
        characterIds.push(characterId);
    }

    // Pull data from 8 random characters from Marvel API
    // Store character name img and id in an array
    let characterData = [];
    // for each loop to get the data needed for ids chosen above
    for (let i = 0; i < characterIds.length; i++) {
        let characterId = characterIds[i];
        let character = await marvelApp.getCharacter(characterId);
        characterData.push({
            id: character.data.results[0].id,
            imgUrl: character.data.results[0].thumbnail.path + "." + character.data.results[0].thumbnail.extension,
            name: character.data.results[0].name
            });
        characterData.push({
            id: character.data.results[0].id,
            imgUrl: character.data.results[0].thumbnail.path + "." + character.data.results[0].thumbnail.extension,
            name: character.data.results[0].name
        });
    };

    let shuffled = marvelApp.shuffle(characterData);
    marvelApp.makeCards(shuffled);
}

// 16 tiles with Marvel logo will appear 'face down' on the game board.
marvelApp.makeCards = data => {
    const gameboard = document.querySelector(".innerGameboard");

    data.forEach(dataObject => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("characterCard");

        const cardBack = document.createElement("img");
        cardBack.classList.add("backCard");
        cardBack.src = "./assets/Marvel-Logo-Square.jpeg";
        cardBack.alt = "Marvel Logo"
        
        const cardPiece = document.createElement("img");
        cardPiece.classList.add("faceCard");
        cardPiece.src = dataObject.imgUrl;
        cardPiece.alt = dataObject.name;
        cardPiece.setAttribute("id", dataObject.id);

        cardDiv.appendChild(cardBack);
        cardDiv.appendChild(cardPiece);

        gameboard.appendChild(cardDiv);
    });
}

// Once user makes first selection, stopwatch will start counting using setInterval on click event.


// add event listeners to each card
marvelApp.setUpEventListeners = () => {
    document.querySelectorAll(".characterCard").forEach(query => {
        query.addEventListener("click", function() {
        console.log('click works');

        const displayCard = () => {
            this.firstChild.classList.add("flip");
            this.lastChild.classList.add("flip");

        }
        // console.log(this);
        displayCard();
        });
    });
    
}

// function to add classes to animate card flipping over when clicked
// function displayCard() {
//     console.log(this);
//     this.firstChild.classList.add("flip");
//     this.lastChild.classList.add("flip");
// }

// Store user's two selections in two separate variables
// If values of two selections match, keep tiles face up.
// If values of two selections don't match, turn tiles back over.

function flipCard() {
    flippedCards = [];
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moveCounter();
        if (flippedCards[0].id === flippedCards[1].id) {
            matchingCards();
        } else {
            notMatchingCards();
        }
    }
}

function matchingCards() {
    flippedCards[0].classList.add("matched");
    flippedCards[1].classList.add("matched");
}

// Move counter will count +1 for every 2 cards flipped
const moveCounter = () => {
    let moves = 0;
    moves++;
    const counter = document.getElementById("count");
    counter.innerHTML = moves;
}

// When user has correctly matched all tiles, stopwatch will stop counting.

// Pop up will let user know their time and that they've completed the game.


// A button "Play Again?" will show
// Listen to play again button click event. Popup will disappear. New data will be pulled. 


marvelApp.init = async () => {
    await marvelApp.getCharacterArray(NUMBER_CHARACTERS);
    marvelApp.setUpEventListeners();
}

// A button "Play Again?" will show
// Listen to play again button click event. Popup will disappear. New data will be pulled. 


marvelApp.init = async () => {
    await marvelApp.getCharacterArray(NUMBER_CHARACTERS);
}

marvelApp.init();
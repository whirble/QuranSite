/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/script.js":
/*!***********************!*\
  !*** ./src/script.js ***!
  \***********************/
/***/ (() => {

eval("// QURAN MP3\r\nconst apiUrl = 'http://api.alquran.cloud/v1/';\r\n// ELEMENTS\r\nconst suar_container = document.querySelector('#suar_container')\r\n// DEEPL API TRANSLATE\r\nconst apiKey = '509ce6ea-977b-484c-8235-54096330815c:fx'; // Replace with your DeepL API key\r\nconst url = 'https://api-free.deepl.com/v2/translate';\r\n// TRANSLATION/TRANSLITERATION FUNCTIONS\r\nasync function translateText(text, targetLang) {\r\n    \r\n    const params = new URLSearchParams();\r\n    params.append('auth_key', apiKey);\r\n    params.append('text', text);\r\n    params.append('target_lang', targetLang); // e.g., 'EN', 'FR', 'DE'\r\n\r\n    try {\r\n        const response = await fetch(url, {\r\n            method: 'POST',\r\n            body: params,\r\n            headers: {\r\n                'Content-Type': 'application/x-www-form-urlencoded',\r\n            },\r\n        });\r\n\r\n        if (!response.ok) {\r\n            throw new Error(`Error: ${response.status} ${response.statusText}`);\r\n        }\r\n\r\n        const data = await response.json();\r\n        return data.translations[0].text; // Returns the translated text\r\n    } catch (error) {\r\n        console.error('Translation failed:', error);\r\n    }\r\n}\r\n// GET SURAH\r\nasync function GetSurah(params) {\r\n    const response = await fetch(`${apiUrl}/surah`)\r\n    const data = await response.json()\r\n    for(const surah of data.data) {\r\n        // TRANSLATION OF THE revelationType\r\n        const revelationType_ar = surah.revelationType == 'Medinan'? 'مَدَنِيَّة' : 'مَكِّيَّة'\r\n        suar_container.innerHTML += `\r\n        <div id='surahItem' data-value=${surah.number} class=\"item flex gap-2 p-2 w-1/4 border border-[#343a40] rounded cursor-pointer hover:bg-[#343a40]\">\r\n            <div class=\"item_number flex items-center justify-center text-lg font-bold p-4 bg-gray border-transparent rounded shadow\">\r\n                ${surah.number}\r\n            </div>\r\n            <div class=\"item_details flex flex-col items-start justify-start px-2 w-full\">\r\n                <div class=\"item_details_name flex items-center justify-between w-full\">\r\n                    <div class=\"item_details_name_en text-lg font-semibold\">${surah.englishName}</div>\r\n                    <div class=\"item_details_name_ar text-lg font-light font-reemKufi\">${surah.name}</div>\r\n                </div>\r\n                <div class=\"item_details_tanzil text-xs font-light text-slate-200 flex items-center justify-between w-full\">\r\n                    <div class=\"flex flex-col gap-2 items-start justify-start\">\r\n                        <p>${surah.englishNameTranslation}</p>\r\n                        <p>${surah.revelationType}</p>\r\n                    </div>\r\n                    <div class=\"flex flex-col gap-2 items-start justify-start\" dir='rtl'>\r\n                        <p dir='rtl'>${surah.numberOfAyahs} آية</p>\r\n                        <p >${revelationType_ar}</p>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        `\r\n    };\r\n}\r\nGetSurah()\r\n\r\n// Function to redirect to reading page\r\nsuar_container.addEventListener(\"click\", (event) => {\r\n    const surahItem = event.target.closest(\"#surahItem\"); // Find the clicked surahItem\r\n    if (surahItem) {\r\n        const surahNumber = surahItem.getAttribute(\"data-value\"); // The variable you want to pass\r\n        localStorage.setItem(\"surahNumber\", surahNumber); // Store it in localStorage\r\n        window.location.href = \"./read\"; // Redirect to another page\r\n    }\r\n});\r\n\r\n// Listen for the scroll event\r\nconst header = document.getElementById('header');\r\nwindow.addEventListener('scroll', () => {\r\n    // Check if the scroll position is greater than 0\r\n    if (window.scrollY > 0) {\r\n        header.classList.add('bg-[#1f2125]');\r\n    } else {\r\n        header.classList.remove('bg-[#1f2125]');\r\n    }\r\n});\n\n//# sourceURL=webpack://quraan/./src/script.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/script.js"]();
/******/ 	
/******/ })()
;
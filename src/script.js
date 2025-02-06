// QURAN MP3
const apiUrl = 'http://api.alquran.cloud/v1/';
// ELEMENTS
const suar_container = document.querySelector('#suar_container')
// DEEPL API TRANSLATE
const apiKey = '509ce6ea-977b-484c-8235-54096330815c:fx'; // Replace with your DeepL API key
const url = 'https://api-free.deepl.com/v2/translate';
// TRANSLATION/TRANSLITERATION FUNCTIONS
async function translateText(text, targetLang) {
    
    const params = new URLSearchParams();
    params.append('auth_key', apiKey);
    params.append('text', text);
    params.append('target_lang', targetLang); // e.g., 'EN', 'FR', 'DE'

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: params,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.translations[0].text; // Returns the translated text
    } catch (error) {
        console.error('Translation failed:', error);
    }
}
// GET SURAH
async function GetSurah(params) {
    const response = await fetch(`${apiUrl}/surah`)
    const data = await response.json()
    for(const surah of data.data) {
        // TRANSLATION OF THE revelationType
        const revelationType_ar = surah.revelationType == 'Medinan'? 'مَدَنِيَّة' : 'مَكِّيَّة'
        suar_container.innerHTML += `
        <div id='surahItem' data-value=${surah.number} class="item flex gap-2 p-2 w-1/4 border border-[#343a40] rounded cursor-pointer hover:bg-[#343a40]">
            <div class="item_number flex items-center justify-center text-lg font-bold p-4 bg-gray border-transparent rounded shadow">
                ${surah.number}
            </div>
            <div class="item_details flex flex-col items-start justify-start px-2 w-full">
                <div class="item_details_name flex items-center justify-between w-full">
                    <div class="item_details_name_en text-lg font-semibold">${surah.englishName}</div>
                    <div class="item_details_name_ar text-lg font-light font-reemKufi">${surah.name}</div>
                </div>
                <div class="item_details_tanzil text-xs font-light text-slate-200 flex items-center justify-between w-full">
                    <div class="flex flex-col gap-2 items-start justify-start">
                        <p>${surah.englishNameTranslation}</p>
                        <p>${surah.revelationType}</p>
                    </div>
                    <div class="flex flex-col gap-2 items-start justify-start" dir='rtl'>
                        <p dir='rtl'>${surah.numberOfAyahs} آية</p>
                        <p >${revelationType_ar}</p>
                    </div>
                </div>
            </div>
        </div>
        `
    };
}
GetSurah()

// Function to redirect to reading page
suar_container.addEventListener("click", (event) => {
    const surahItem = event.target.closest("#surahItem"); // Find the clicked surahItem
    if (surahItem) {
        const surahNumber = surahItem.getAttribute("data-value"); // The variable you want to pass
        localStorage.setItem("surahNumber", surahNumber); // Store it in localStorage
        window.location.href = "./read"; // Redirect to another page
    }
});

// Listen for the scroll event
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    // Check if the scroll position is greater than 0
    if (window.scrollY > 0) {
        header.classList.add('bg-[#1f2125]');
    } else {
        header.classList.remove('bg-[#1f2125]');
    }
});
// Firebase imports
import { db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from './db.js';

// API PARAMETERS
const apiUrl = 'http://api.alquran.cloud/v1/surah';
const surahNumber = localStorage.getItem("surahNumber");
const reciter = 'ar.alafasy';
const translator = 'en.asad';
const tafsir = 'ar.muyassar';
// AUDIO PLAYER / TEXT ELEMENTS
const audioPlayer = document.querySelector('#audioPlayer')
const ayahText = document.querySelector('#ayahText')
const ayahTextEn = document.querySelector('#ayahTextEn')
const ayahDetails = document.querySelector('#ayahDetails')
const description = document.querySelector('#desc')
const surahName = document.querySelector('#surahName')
const AyahsContainer = document.querySelector('#Ayahs_container')
const tafasirContainer = document.querySelector('#tafasir_container')
const tafsirContent = document.getElementById("tafsir_Content");
const tafsirTitle = document.getElementById("tafsir_title");
const toggleButton = document.getElementById("toggleButton");
const recentReadsContainer = document.getElementById("recent_reads");

// USER IP ADRESS RETRIEVE
async function getIPAddress() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      return data.ip;
    } catch (error) {
      console.error("Error fetching IP address:", error);
      return null;
    }
}  

// FUNCTION THAT ADDS/RETRIEVE SURAH FOR RECENT READS COLLECTION
async function addRecentRead(surahName, surahNumber) {
    const ipAddress = await getIPAddress(); // Fetch IP address
    const date = new Date().toISOString();  // Get the current date in ISO format
  
    // Add a document to the "recentReads" collection
    try {
        // Check if the read is already inserted in the same day
        // -----------------------------------------------------------
        // Normalize the current date to the start of the day (midnight)
        const startOfDay = new Date(date);startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00
    
        // Normalize the current date to the end of the day (just before midnight)
        const endOfDay = new Date(date);endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
    
        // Reference to the "recentReads" collection
        const recentReadsRef = collection(db, "recentReads");
    
        // Create a query to find documents with dates in the same day
        const q = query(recentReadsRef,
            where("date", ">=", startOfDay.toISOString()), // Start of the day
            where("date", "<=", endOfDay.toISOString()),   // End of the day
            where("surahNumber", "==", surahNumber)
        );
    
        // Execute the query
        const querySnapshot = await getDocs(q);
    
        // Check if there is already a document in the same day
        if (querySnapshot.empty) {
            await addDoc(collection(db, "recentReads"), {
                ipAddress: ipAddress,
                surahName: surahName,
                surahNumber: surahNumber,
                date: date
              });
              console.log("Document added to recentReads!");
        }else {
            console.log("A read with the same date already exists.");
        }
        
    } catch (e) {
      console.error("Error adding document:", e);
    }

    // Retrieve docs to the "recentReads" collection
    try {
      // Reference to the "recentReads" collection
      const recentReadsRef = collection(db, "recentReads");
      
      // Create a query to find documents where ipAddress equals the retrieved IP
      const q = query(recentReadsRef, where("ipAddress", "==", ipAddress), orderBy("date", "desc"));
      
      // Execute the query
      const querySnapshot = await getDocs(q);

      // Process and log each document's data
      querySnapshot.forEach((doc) => {
        // Function to determine the date category for today, yesterday, last week, ...
        const inputDate = new Date(doc.data().date);
        const today = new Date();
        const dayDifference = Math.floor((today - inputDate) / (1000 * 60 * 60 * 24));

        let dateCateg;  // Declare dateCateg here so it’s accessible in the entire function
        if (dayDifference === 0) {dateCateg = "Today";} 
        else if (dayDifference === 1) {dateCateg = "Yesterday";} 
        else if (dayDifference <= 7) {dateCateg = "Last Week";} 
        else if (inputDate.getFullYear() === today.getFullYear()) {dateCateg = inputDate.toLocaleDateString('en-US', { month: 'long'});} 
        else {dateCateg = inputDate.toLocaleDateString('en-US', { year: 'numeric' });}

        let categ = document.getElementById(dateCateg)
        if(!categ) {
          categ = document.createElement('div')
          categ.id = dateCateg
          categ.classList.add("w-full", 'flex', 'flex-col', 'items-start', 'justify-start', 'gap-2', 'pb-2');
          categ.innerHTML = `<h3 class='text-md font-semibold text-gray-400 px-2'>${dateCateg}</h3>`
          recentReadsContainer.appendChild(categ)
        }
        categ.innerHTML += `
        <div  id='readSurah' data-value=${doc.data().surahNumber} class="item flex p-2 w-full border border-[#343a40] rounded cursor-pointer hover:bg-[#343a40]">
          <div class="item_details flex flex-col items-start justify-start px-2 w-full">
              <div class="item_details_name flex items-center justify-between w-full">
                  <div class="item_details_name_en text-lg font-semibold">Al-Mursalaat (The Emissaries)</div>
                  <div class="item_details_name_ar text-lg font-light font-reemKufi" dir='rtl'>${doc.data().surahName}</div>
              </div>
          </div>
        </div>
        `;
      });
  } catch (error) {
      console.error("Error retrieving recent reads:", error);
  }
}  

// TAFSIR TOGGLE
toggleButton.addEventListener("click", function() {
    tafsirContent.classList.toggle("hidden"); // Toggle the Tailwind 'hidden' class
    
    if (!tafsirContent.classList.contains("hidden")) {
      tafsirContent.scrollIntoView({ behavior: "smooth" }); // Smooth scroll to content if it's shown
      toggleButton.innerHTML = `<i class="fa-solid fa-angle-up"></i>`
    }else{
        toggleButton.innerHTML = `<i class="fa-solid fa-angle-down"></i>`
    }
});

async function playSurah(params) {

    // SURAH AUDIO RETRIEVE
    const response = await fetch(`${apiUrl}/${surahNumber}/${reciter}`)
    const data = await response.json()
    const ayahs = data.data.ayahs; // Store Ayahs in a variable
    
    // SURAH TRANSLATION RETRIEVE
    const translationResponse = await fetch(`${apiUrl}/${surahNumber}/${translator}`)
    const translationData = await translationResponse.json()
    const translatedAyahs = translationData.data.ayahs; // Store Translated Ayahs in a variable
    
    // SURAH TAFASIR RETRIEVE
    const tafssirResponse = await fetch(`${apiUrl}/${surahNumber}/${tafsir}`)
    const tafssirData = await tafssirResponse.json()
    const ayahsTafassir = tafssirData.data.ayahs; // Store Translated Ayahs in a variable

    // ADD TO RECENT READS
    addRecentRead(data.data.name,data.data.number)

    // SURAH NAME/DESCRIPTION INSERT
    const revelationType = data.data.revelationType == 'Medinan' ?'مَدَنِيَّة' :'مَكِّيَّة'
    surahName.innerHTML = `
    <div class="">${data.data.name}</div>
    <div class="">-</div>
    <div class="">${data.data.englishName} (${data.data.englishNameTranslation})</div>`
    description.innerHTML = `
    <div class="desc_info flex items-center justify-center py-2 px-4 rounded-full bg-white hover:bg-[#f0f0f0] cursor-pointer">${revelationType}</div>
    <div class="desc_info flex items-center justify-center py-2 px-4 rounded-full bg-white hover:bg-[#f0f0f0] cursor-pointer">${data.data.numberOfAyahs} آية</div>
    <div class="desc_info flex items-center justify-center py-2 px-4 rounded-full bg-white hover:bg-[#f0f0f0] cursor-pointer">تلاوة ${data.data.edition.name}&nbsp;<span><i class="fa-solid fa-angle-down"></i></span></div>
    <div class="desc_info flex items-center justify-center py-2 px-4 rounded-full bg-white hover:bg-[#f0f0f0] cursor-pointer">ترجمة ${translationData.data.edition.englishName}&nbsp;(${translationData.data.edition.language})&nbsp;<span><i class="fa-solid fa-angle-down"></i></span></div>
    `

    // SIDEBAR AYAHS INSERT
    for (const ayah of ayahs) {
        AyahsContainer.innerHTML += `
        <div class="ayah_container w-full h-12 p-0 hover:bg-[#343a40] border border-[#343a40] rounded flex items-center justify-between cursor-pointer shadow">
            <div class="ayah_number bg-[#343a40] text-[#fff] text-lg font-extrabold w-[20%] h-full rounded-tl rounded-bl flex items-center justify-center shadow-[10px_0px_10px_0px_#1f2125] z-10">${ayah.numberInSurah}</div>
            <div class="ayah text-sm text-white py-4 pr-4 w-[80%] h-full whitespace-nowrap overflow-hidden z-0" dir="rtl">${ayah.text}</div>
        </div>`
    }
    const sidebarAyahsArray = document.querySelectorAll('#Ayahs_container .ayah_number')

    
    // Function to play the next Ayah
    let currentAyahIndex = 0; // Index to track current Ayah
    function playNextAyah() {
        if (currentAyahIndex < ayahs.length) {
            // Reset all ayah indicators to their original numbers
            sidebarAyahsArray.forEach((ayahElement, index) => {
                ayahElement.innerHTML = ayahs[index].numberInSurah; // Set back to the ayah number
            });
            // Update the indicator for the current ayah
            sidebarAyahsArray[currentAyahIndex].innerHTML = `<i class="fa-solid fa-play [text-shadow:0px_0px_10px_rgba(255,255,255,0.8),0px_0px_100px_rgba(255,255,255,0.6),0px_0px_100px_rgba(255,255,255,0.4)]"></i>`
            // set ayahs tafassir
            ayahTafsir(currentAyahIndex)
            // Set ayahs text and audio
            ayahText.innerHTML = ayahs[currentAyahIndex].text
            ayahTextEn.innerHTML = translatedAyahs[currentAyahIndex].text
            ayahDetails.innerHTML = `
            <div class="p-2 rounded-full bg-[#f0f0f0] text-black">ربع الحزب ${ayahs[currentAyahIndex].hizbQuarter}</div>
            <div class="p-2 rounded-full bg-[#f0f0f0] text-black">صفحة ${ayahs[currentAyahIndex].page}</div>
            <div class="p-2 rounded-full bg-[#f0f0f0] text-black">الآية ${ayahs[currentAyahIndex].numberInSurah}</div>`
            audioPlayer.src = ayahs[currentAyahIndex].audio; // Set the source to the current Ayah's audio
            audioPlayer.load(); // Load the new audio
            audioPlayer.play(); // Play the audio

            // Increment the index after the audio ends
            currentAyahIndex++;
        } else {
            // Finished playing all Ayahs
            currentAyahIndex = 0
            playNextAyah()
        }
    }
    // Event listener for when the audio ends
    audioPlayer.addEventListener('ended', playNextAyah);

    // Start playing the first Ayah
    playNextAyah();

    // Function to set the tafsir
    function ayahTafsir(ayahIndex) {
        tafsirTitle.innerHTML = `${tafssirData.data.edition.name} - ${tafssirData.data.edition.englishName}`
        tafsirContent.innerHTML = `${ayahsTafassir[ayahIndex].text}`
    }
    
}

playSurah()

// Function to format date as "Today," "Yesterday," etc.
function formatDateToFriendlyString(dateString) {
  const inputDate = new Date(dateString);
  const today = new Date();

  // Calculate difference in days
  const dayDifference = Math.floor((today - inputDate) / (1000 * 60 * 60 * 24));

  // Determine the display format based on the difference
  if (dayDifference === 0) {
      return "Today";
  } else if (dayDifference === 1) {
      return "Yesterday";
  } else if (dayDifference <= 7) {
      return "Last week";
  } else if (today.getFullYear() === inputDate.getFullYear()) {
      // Show the month and day if it's the same year
      return inputDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  } else {
      // Show the full date for previous years
      return inputDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }
}

const header = document.getElementById('header');
// Listen for the scroll event
window.addEventListener('scroll', () => {
    // Check if the scroll position is greater than 0
    if (window.scrollY > 0) {
        header.classList.add('bg-[#1f2125]');
    } else {
        header.classList.remove('bg-[#1f2125]');
    }
});

// Function to redirect to reading page
recentReadsContainer.addEventListener("click", (event) => {
    const readSurah = event.target.closest("#readSurah"); // Find the clicked surahItem
    if (readSurah) {
        const surahNumber = readSurah.getAttribute("data-value"); // The variable you want to pass
        localStorage.setItem("surahNumber", surahNumber); // Store it in localStorage
        window.location.href = "./"; // Refresh the page
    }
});
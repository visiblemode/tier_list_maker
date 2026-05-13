// =============================================================================
// CONFIGURATION
// =============================================================================

// Colors of the tier list, in order they will be used
const colors = ['#F9F282', '#9BDAE4', '#8ABAE2', '#FAF8F9'];

// Google Sheet Data Source
const SHEET_BASE = "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vR7NTU850u2PQcbEjH36NrDDrlLXvHdM25x0-GRsOkZDKaMBrhWIq-Npxo8mxKXBVZI8z1QSu0do9Uo/pub?output=csv";
const SHEET1_GID = "920212433";  // Pokemon Name | Sleep Type | Image Name
const SHEET2_GID = "1748789333"; // Evo chains

// =============================================================================
// SHEET DATA — populated at load time from Google Sheets
// Keys are the exact strings from the sheet (e.g. "Alolan Vulpix", "Mr. Mime")
// =============================================================================

let name_to_icon = {};  // "Alolan Vulpix" -> "037-alolanvulpix"
let sleepTypes   = {};  // "Alolan Vulpix" -> "SLUMBERING"
let allEvolutions = []; // [["Vulpix", "Alolan Vulpix", "Ninetales", "Alolan Ninetales"], ...]

// =============================================================================
// SHEET FETCHING
// =============================================================================

function parseCSV(text) {
    return text.split('\n').map(row => {
        const cols = [];
        let cur = '', inQuote = false;
        for (let i = 0; i < row.length; i++) {
            const ch = row[i];
            if (ch === '"') { inQuote = !inQuote; }
            else if (ch === ',' && !inQuote) { cols.push(cur.trim()); cur = ''; }
            else { cur += ch; }
        }
        cols.push(cur.trim());
        return cols;
    });
}

async function loadSheetData() {
    const [sheet1Text, sheet2Text] = await Promise.all([
        fetch(SHEET_BASE + "&gid=" + SHEET1_GID).then(r => r.text()),
        fetch(SHEET_BASE + "&gid=" + SHEET2_GID).then(r => r.text()),
    ]);

    // --- Sheet 1: name_to_icon + sleepTypes ---
    // Keys are stored exactly as they appear in the sheet.
    const sheet1Rows = parseCSV(sheet1Text);
    const headerIdx = sheet1Rows.findIndex(row => row[0] === 'Pokemon Name');
    const dataRows = sheet1Rows.slice(headerIdx + 1);

    for (const row of dataRows) {
        const [name, sleepType, imageName] = row;
        if (!name || !sleepType || !imageName) continue;
        name_to_icon[name] = imageName.replace(/\.png$/i, '');
        sleepTypes[name]   = sleepType.toUpperCase();
    }

    // --- Sheet 2: allEvolutions ---
    // Each row is one evo chain; cells are exact sheet names.
    const sheet2Rows = parseCSV(sheet2Text);
    const evoDataRows = sheet2Rows.slice(1); // skip header row

    for (const row of evoDataRows) {
        const members = row.map(s => s.trim()).filter(s => s !== '');
        if (members.length === 0) continue;
        allEvolutions.push(members);
    }
}

// =============================================================================
// PARSE DATA
// Input: newline-separated list of pokemon names exactly as in the sheet.
// Output: array of [tierLabel, [iconNames...]] for createTierList.
// =============================================================================

function parseData(data) {
    // Newline-only separator; trim each line, drop empties, dedupe
    const lines = data.split('\n').map(s => s.trim()).filter(s => s !== '');
    const balancedList = [...new Set(lines)];

    const tiers = {
        "Dozing":     [],
        "Snoozing":   [],
        "Slumbering": [],
        "Balanced":   [],
    };

    balancedList.forEach(pokemon => {
        const iconName = name_to_icon[pokemon];
        if (!iconName) {
            console.warn("no icon found for:", pokemon);
        }

        // Always add to Balanced
        tiers["Balanced"].push(iconName);

        // Find this pokemon's evo chain (it must be the first entry in the chain)
        const evolutions = allEvolutions.find(chain => chain[0] === pokemon);

        let dozing = false, snoozing = false, slumbering = false;

        if (evolutions) {
            evolutions.forEach(evo => {
                const evoSleepType = sleepTypes[evo];
                const evoIcon = name_to_icon[evo];
                switch (evoSleepType) {
                    case "DOZING":
                        if (!dozing) tiers["Dozing"].push(evoIcon);
                        dozing = true;
                        break;
                    case "SNOOZING":
                        if (!snoozing) tiers["Snoozing"].push(evoIcon);
                        snoozing = true;
                        break;
                    case "SLUMBERING":
                        if (!slumbering) tiers["Slumbering"].push(evoIcon);
                        slumbering = true;
                        break;
                }
            });
        } else {
            console.warn("no evo chain found for:", pokemon);
        }
    });

    return Object.keys(tiers).map(tier => [tier, tiers[tier]]);
}

// =============================================================================
// CREATE TIER LIST
// =============================================================================

/**
 * @param {Array}    tiers      Output of parseData()
 * @param {number}   width      Total width in px
 * @param {number}   numCells   Max icons per row before wrapping
 * @param {string}   tierHeader Text displayed above the tier list
 * @param {string}   tierFooter (currently unused but kept for compatibility)
 */
function createTierList(tiers, width, numCells, tierHeader, tierFooter) {
    const cellWidth = width / (numCells + 1);
    const imageUrl = (imageName) => `https://www.serebii.net/pokemonsleep/pokemon/icon/${imageName}.png`;

    let html = `<div style="margin: auto; width: ${width}px;">`;

    html += `
      <div class="header-image-div" style="background-color: black; color: white; font-size: 30px; text-align: left; vertical-align: middle; padding-left: 20px; height: ${cellWidth}px; line-height: ${cellWidth}px;">
        ${tierHeader}
      </div>`;

    html += `<div style="display: table; width: 100%; table-layout: fixed;">`;

    tiers.forEach((tier, index) => {
        const [tierLabel, images] = tier;
        html += `
        <div style="display: table-row;">
          <div style="display: table-cell; background-color: ${colors[index]}; text-align: center; vertical-align: middle; width: ${cellWidth-2}px; height: ${cellWidth}px;">${tierLabel}</div>
          <div class="blackcell" style="display: table-cell; border: 1px solid white; box-sizing: border-box; background-color: black; display: flex; flex-wrap: wrap;">`;

        html += `<img src="legendary-mythicals-icon2.png" style="flex: 1 0 ${100 / numCells}%; max-width: ${cellWidth}px;">`;

        images.forEach(imageName => {
            html += `<img src="${imageUrl(imageName)}" style="flex: 1 0 ${100 / numCells}%; max-width: ${cellWidth}px;">`;
        });

        html += `</div></div>`;
        html += `
      <div class="footer-image-div" style="background-color: black; color: white; font-size: 13px; text-align: left; vertical-align: middle; height: ${cellWidth/7}px; line-height: ${cellWidth/3.5}px;">
      </div>`;
    });

    html += `</div></div>`;
    return html;
}

// =============================================================================
// INIT
// =============================================================================

document.addEventListener('DOMContentLoaded', async function() {
    const width = 800;
    const cells = 8;
    const footerText = '';
    let headerText = document.getElementById('headerInput').value;
    const statusEl = document.getElementById('loadingStatus');

    statusEl.innerText = 'Loading Pokémon data...';
    try {
        await loadSheetData();
        statusEl.innerText = '';
    } catch (e) {
        statusEl.innerText = 'Failed to load sheet data. (' + e.message + ')';
        console.error('Sheet load failed:', e);
        return;
    }

    let tiersArray = parseData(document.getElementById('inputTextArea').value);
    document.getElementById('tierList').innerHTML = createTierList(tiersArray, width, cells, headerText, footerText);

    document.getElementById('headerInput').addEventListener('input', function() {
        headerText = this.value;
        document.getElementById('tierList').innerHTML = createTierList(tiersArray, width, cells, headerText, footerText);
    });

    document.getElementById('inputTextArea').addEventListener('input', function() {
        tiersArray = parseData(this.value);
        document.getElementById('tierList').innerHTML = createTierList(tiersArray, width, cells, headerText, footerText);
    });
});
// Fetches Pokemon data from Google Sheets and populates the globals
// name_to_icon, sleepTypes, allEvolutions — replacing the static .js files.

const SHEET_BASE = "https://docs.google.com/spreadsheets/u/1/d/e/2PACX-1vR7NTU850u2PQcbEjH36NrDDrlLXvHdM25x0-GRsOkZDKaMBrhWIq-Npxo8mxKXBVZI8z1QSu0do9Uo/pub?output=csv";
const SHEET1_URL = SHEET_BASE + "&gid=920212433";  // Pokemon Name | Sleep Type | Image Name
const SHEET2_URL = SHEET_BASE + "&gid=1748789333"; // Evo chains

function parseCSV(text) {
    return text.split('\n').map(row => {
        // Handle quoted fields
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

// Converts sheet display name like "Alolan Vulpix" to internal key "ALOLAN_VULPIX"
function toKey(name) {
    return name.trim().toUpperCase().replace(/\s+/g, '_');
}

async function loadSheetData() {
    const [sheet1Text, sheet2Text] = await Promise.all([
        fetch(SHEET1_URL).then(r => r.text()),
        fetch(SHEET2_URL).then(r => r.text()),
    ]);

    // --- Sheet 1: name_to_icon + sleepTypes ---
    const sheet1Rows = parseCSV(sheet1Text);

    // Find the header row (contains "Pokemon Name")
    const headerIdx = sheet1Rows.findIndex(row => row[0] === 'Pokemon Name');
    const dataRows = sheet1Rows.slice(headerIdx + 1);

    for (const row of dataRows) {
        const [rawName, sleepType, imageName] = row;
        if (!rawName || !sleepType || !imageName) continue;

        const key = toKey(rawName);
        const imageBase = imageName.replace(/\.png$/i, '');

        name_to_icon[key] = imageBase;
        sleepTypes[key] = sleepType.toUpperCase();
    }

    // --- Sheet 2: allEvolutions ---
    const sheet2Rows = parseCSV(sheet2Text);

    // Skip header row ("Candy", "Other Evolutions", ...)
    const evoDataRows = sheet2Rows.slice(1);

    for (const row of evoDataRows) {
        const members = row.map(toKey).filter(k => k !== '');
        if (members.length === 0) continue;

        // Check if this chain already exists in allEvolutions (from the static .js file)
        const alreadyExists = allEvolutions.some(chain =>
            chain[0] === members[0] && chain.length === members.length
        );
        if (!alreadyExists) {
            allEvolutions.push(members);
        }
    }
}

# Mathcord Sleep Sprint Tier List Maker

**The webapp:** https://visiblemode.github.io/tier_list_maker

This tool generates the monthly sprint tier list image. You paste in a list of Pokémon, it sorts them into Dozing / Snoozing / Slumbering / Balanced rows automatically.

---

## How the data works

There's a Google Sheet that the webapp reads from every time it loads. 

It has two tabs:

- **Tab 1 (Pokémon list):** every Pokémon in the game, with their sleep type and icon filename
- **Tab 2 (Evolutions):** evolution chains, which determine which icons show up in which rows

When a new Pokémon is added to Pokémon Sleep, someone needs to update the sheet. 
The webapp will pick it up automatically — no code changes needed.

---

## Every month: generating the tier list

1. Go to **https://visiblemode.github.io/tier_list_maker**
2. Update the header text (e.g. "Mathcord Sleep Sprint List | May 2026")
3. Paste the list of Pokémon for this month's sprint, one per line:
   ```
   Pikachu
   Farfetch'd
   Toxtricity Low Key Form
   Alolan Vulpix
   Mr. Mime
   ```
4. The tier list renders instantly. Screenshot it.

**Important:** names must be spelled and capitalized exactly as they appear in the sheet. `Alolan Vulpix` works. `alolan vulpix`, `ALOLAN VULPIX`, and `AlolanVulpix` do not.

---

## When new Pokémon are added to the game

You'll need edit access to the Google Sheet. Ask in Mathcord if you don't have it.

### Tab 1 — add the new Pokémon

Add a new row with three values:

| Pokemon Name | Sleep Type | Image Name |
|---|---|---|
| Fuecoco | Snoozing | 909.png |
| Paldean Wooper | Dozing | 194-paldeanwooper.png |

**Sleep Type** must be exactly one of: `Dozing`, `Snoozing`, `Slumbering`

**Image Name** is the filename from Serebii. The pattern is almost always `[3-digit dex number].png`. You can confirm the exact filename by right-clicking the icon on [Serebii's Pokémon Sleep page](https://www.serebii.net/pokemonsleep/pokemon.shtml) and inspecting the image URL — take everything after the last `/`.

Regional forms and special cases look like `037-alolanvulpix.png` or `849-toxtricityampedform.png` — just use whatever the actual filename is on Serebii.

**Columns D and E** are used for data validation. 
The **Image Preview** column shows a pokemon icon with a valid Image Name.
The **Is Used Only Once in "Evolutions" Sheet?** column returns **TRUE** if the evolution has been logged on the second sheet, since the webapp will break if a Pokemon has no evolution chain, or is part of multiple chains. 

### Tab 2 — add the evolution chain

Add a new row. Put the **candy Pokémon first** (the one users will paste into the webapp), then the rest of the chain in evolution order.

```
Fuecoco    Crocalor    Skeledirge
```

If it's a solo Pokémon with no evolutions, just one cell:
```
Comfey
```

For branching evolutions like Eevee, list all branches across the row:
```
Eevee    Espeon    Glaceon    Flareon    Sylveon    Jolteon    Leafeon    Umbreon    Vaporeon
```

**Data validation on Tab 2 forces users to use the exact names used on Tab 1.** 

---

## Troubleshooting

**The webapp shows "Failed to load sheet data"**
The Google Sheet might not be published. In the sheet: File → Share → Publish to web → make sure both tabs are published.

**A Pokémon shows up as a broken image**
The image name in Tab 1 is probably wrong. Double-check the filename on Serebii. Check the **Image Preview** column on Tab 1 to see if the file is rendering correctly.

**A Pokémon doesn't appear in the Dozing/Snoozing/Slumbering rows (only Balanced)**
It's either missing from Tab 2, or the name in Tab 2 column A doesn't exactly match the name in Tab 1.

**A name I pasted isn't showing up at all**
Check that the spelling and capitalization match Tab 1 exactly. Common culprits: `Mr. Mime` (has a period), `Farfetch'd` (has an apostrophe), regional forms like `Alolan Vulpix` (two words, capital A).

**Something's broken and I don't know why**
Open the browser console (F12 → Console tab) and look for red errors or yellow warnings — they'll say which Pokémon name it couldn't find. Screenshot it and post in Mathcord.

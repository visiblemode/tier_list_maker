/**
 * Function to create a tier list.
 * 
 * @param {*} colors       Found in js/constants.js. Used to determine the order of colors from top to bottom row.
 * @param {*} tiers        The tierlist data. Format like below, a lists of lists where each list represents one tier.
 *                         The first item in the list is the tier name to be displayed.
 *                         The second item is a list of partial URLs to display each image.
 *                               Example: [['S', ['009'], ['A', ['094', '248'], ['B', ['076']]
 * @param {*} width        Max width, in pixels, of the entire tier list.
 * @param {*} numCells     Max number of items per row before wrapping to next line within that tier.
 * @param {*} tierHeader   The string that will be displayed on top of the tier list.
 * @param {*} useLocal     If true, uses local images to render the icons. If false, uses Serebii.
 *                         I kinda recommend false since Serebii almost definitely uses Cloudflare
 *                          or whatever so it doesn't actually cost him bandwidth to use his URLs.
 * 
 * @returns HTML that renders the entire tier list
 */
function createTierList(colors, tiers, width, numCells, tierHeader, tierFooter, useLocal=false) {
    const cellWidth = width / (numCells + 1); // +1 for the label cell
    const imageUrl = (imageName) => useLocal ? `pokemon_icons/${imageName}.png` : `https://www.serebii.net/pokemonsleep/pokemon/icon/${imageName}.png`;
    let html = `<div style="margin: auto; width: ${width}px;">`;
  
    // Add header
    html += `
      <div class="header-image-div" style="background-color: black; color: white; font-size: 30px; text-align: left; vertical-align: middle; padding-left: 20px; height: ${cellWidth}px; line-height: ${cellWidth}px;">
        ${tierHeader}
      </div>`;
  
    // Start the tier list
    html += `<div style="display: table; width: 100%; table-layout: fixed;">`;
  
    tiers.forEach((tier, index) => {
      const [tierLabel, images] = tier;
      html += `
        <div style="display: table-row;">
          <div style="display: table-cell; background-color: ${colors[index]}; text-align: center; vertical-align: middle; width: ${cellWidth-2}px; height: ${cellWidth}px;">${tierLabel}</div>
          <div class="blackcell" style="display: table-cell; border: 1px solid white; box-sizing: border-box; background-color: black; display: flex; flex-wrap: wrap;">`;
  
      // Add in Legendaries and Mythicals
      html += `<img src="legendary-mythicals-icon.png" style="flex: 1 0 ${100 / numCells}%; max-width: ${cellWidth}px;">`;

      images.forEach(imageName => {
        html += `<img src="${imageUrl(imageName)}" style="flex: 1 0 ${100 / numCells}%; max-width: ${cellWidth}px;">`;
      });
  
      html += `</div></div>`;

      html += `
      <div class="footer-image-div" style="background-color: black; color: white; font-size: 13px; text-align: left; vertical-align: middle; height: ${cellWidth/7}px; line-height: ${cellWidth/3.5}px;">
      </div>`;
    });
    html += `</div>`

    // html += `
    // <div class="footer-image-div" style="background-color: black; color: white; font-size: 13px; text-align: left; vertical-align: middle; height: ${cellWidth/3.5}px; line-height: ${cellWidth/3.5}px;">
    //   ${tierFooter}
    // </div>`;

    html += `</div>`;
    return html;
}
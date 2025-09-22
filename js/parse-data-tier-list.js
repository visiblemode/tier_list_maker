/**
 * This is a shitty, quickly written function to turn your data from this format:
 * #1 [S 3136.8] BLASTOISE (2 Milk, 3 Cacao) (SWEET_SCENT_CHOCOLATE_CAKE,CONTRARY_CHOCOLATE_MEAT_SALAD,DREAM_EATER_BUTTER_CURRY)",
 *  "#2 [S 3051] ABSOL (2 Cacao, 5 Cacao) (CONTRARY_CHOCOLATE_MEAT_SALAD,HUSTLE_PROTEIN_SMOOTHIE,DREAM_EATER_BUTTER_CURRY)",
 *  "#3 [A 2489.2] GENGAR (2 Herb, 4 Mushroom) (SPORE_MUSHROOM_CURRY,SPORE_MUSHROOM_SALAD,NEROLIS_RESTORATIVE_TEA)",
 *  "#4 [A 2431] TYRANITAR (2 Ginger, 5 Soybean) (HUSTLE_PROTEIN_SMOOTHIE,NINJA_SALAD,BULK_UP_BEAN_CURRY)",
 *  "#5 [B 2189.3] GOLEM (2 Soybean, 5 Soybean) (HUSTLE_PROTEIN_SMOOTHIE,BULK_UP_BEAN_CURRY,NINJA_SALAD)",
 *
 * to this intermediary format:
 * [['S', ['BLASTOISE'].
 *  ['A', ['GENGAR', 'TYRANITAR'],
 *  ['B', ['GOLEM']]
 * 
 * ...which is then returned like this:
 * [['S', ['009'].
 *  ['A', ['094', '248'],
 *  ['B', ['076']]
 * 
 * You don't need to use this function, I just wrote it quickly to get the
 * data massaged into the format I needed for the CREATETIERLIST function.
 */
function parseData(data) {
    const tiers = {}; // Initialize tiers
    const tierRegex = /\[\s*([SABCDEF])\s+\d+\.?\d*\s*\]/;
    const nameRegex = /] ([A-Z]+[A-Z\s]*) \(/; // Regex to capture the name

    data.forEach(item => {
        const tierMatch = item.match(tierRegex);
        const nameMatch = item.match(nameRegex);

        if (tierMatch && nameMatch) {
            const tier = tierMatch[1];
            const name = nameMatch[1].trim();
            const icon = name_to_icon[name];

        	if (!(tier in tiers)) {
        		tiers[tier] = [icon]
        	} else {
            	tiers[tier].push(icon);
        	}
        }
    });

    // Convert to array format
    return Object.keys(tiers).map(tier => [tier, tiers[tier]]);
}
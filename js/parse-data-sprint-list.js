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

function parsePokemonList(input) {
    // Replace multiple line breaks with a single line break
    let cleanedInput = input.replace(/\s+/g, '\n');

    // Split the input string by line breaks, trim each element, and filter out empty strings
    return new Set(cleanedInput.split('\n').map(pokemon => pokemon.trim()).filter(pokemon => pokemon !== ''));
}

function parseData(data) {
    const balancedList = parsePokemonList(data)
    const tiers = {
        "Dozing": [],
        "Snoozing": [],
        "Slumbering": [],
        "Balanced": [],
    };

    balancedList.forEach(pokemon => { // pokemon: 'Cyndaquil'
        const iconName = name_to_icon[pokemon.toUpperCase()];
        // add to the balanced list right away
        tiers["Balanced"].push(iconName)

        // special case: Eevee
        if (pokemon === 'Eevee') {
            tiers["Dozing"].push(iconName);
            tiers["Snoozing"].push(iconName);
            tiers["Slumbering"].push(iconName);
        } else {
            // evolutions: ['CYNDAQUIL', 'QUILAVA', 'TYPHLOSION']
            const evolutions = allEvolutions.find((element) => element[0] === pokemon.toUpperCase());

            let dozing = false
            let snoozing = false
            let slumbering = false

            if (evolutions) {
                evolutions.forEach((evolution) => {
                    const evolutionSleepType = sleepTypes[evolution]
                    const iconName = name_to_icon[evolution];
                    switch (evolutionSleepType) {
                        case "DOZING":
                            if (!dozing) {
                                tiers["Dozing"].push(iconName)
                            }
                            dozing = true
                            break;
                        case "SNOOZING":
                            if (!snoozing) {
                                tiers["Snoozing"].push(iconName)
                            }
                            snoozing = true
                            break;
                        case "SLUMBERING":
                            if (!slumbering) {
                                tiers["Slumbering"].push(iconName)
                            }
                            slumbering = true
                            break;
                    }
                })
            } else {
                console.log("cannot find evolutions for", pokemon)
            }
        }
    });

    // Convert to array format
    return Object.keys(tiers).map(tier => [tier, tiers[tier]]);
}
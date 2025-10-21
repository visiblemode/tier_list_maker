import requests
import os

# The dictionary mapping Pokémon names to their icon IDs
name_to_icon = {
    "ABOMASNOW": "460",
    "ABSOL": "359",
    "ALTARIA": "334",
    "AMPHAROS": "181",
    "ARBOK": "024",
    "ARCANINE": "059",
    "BANETTE": "354",
    "BAYLEEF": "153",
    "BELLSPROUT": "069",
    "BLASTOISE": "009",
    "BONSLY": "438",
    "BULBASAUR": "001",
    "BUTTERFREE": "012",
    "CATERPIE": "010",
    "CHARIZARD": "006",
    "CHARMANDER": "004",
    "CHARMELEON": "005",
    "CHIKORITA": "152",
    "CLEFABLE": "036",
    "CLEFAIRY": "035",
    "CLEFFA": "173",
    "CROAGUNK": "453",
    "CROCONAW": "159",
    "CUBONE": "104",
    "CYNDAQUIL": "155",
    "DELIBIRD": "225",
    "DIGLETT": "050",
    "DITTO": "132",
    "DODRIO": "085",
    "DODUO": "084",
    "DUGTRIO": "051",
    "EEVEE": "133",
    "EKANS": "023",
    "ESPEON": "196",
    "FERALIGATR": "160",
    "FLAAFFY": "180",
    "FLAREON": "136",
    "GASTLY": "092",
    "GENGAR": "094",
    "GEODUDE": "074",
    "GLACEON": "471",
    "GOLDUCK": "055",
    "GOLEM": "076",
    "GRAVELER": "075",
    "GROWLITHE": "058",
    "GULPIN": "316",
    "HAUNTER": "093",
    "HERACROSS": "214",
    "HOUNDOOM": "229",
    "HOUNDOUR": "228",
    "IGGLYBUFF": "174",
    "IVYSAUR": "002",
    "JIGGLYPUFF": "039",
    "JOLTEON": "135",
    "KANGASKHAN": "115",
    "LARVITAR": "246",
    "LEAFEON": "470",
    "LUCARIO": "448",
    "MAGNEMITE": "081",
    "MAGNETON": "082",
    "MAGNEZONE": "462",
    "MANKEY": "056",
    "MAREEP": "179",
    "MAROWAK": "105",
    "MEGANIUM": "154",
    "MEOWTH": "052",
    "METAPOD": "011",
    "MIMEJR": "439",
    "MRMIME": "122",
    "ONIX": "095",
    "PERSIAN": "053",
    "PICHU": "172",
    "PIKACHU": "025",
    "PIKACHU_HOLIDAY": "025-holiday",
    "PIKACHU_HALLOWEEN": "025-halloween",
    "PINSIR": "127",
    "PRIMEAPE": "057",
    "PSYDUCK": "054",
    "PUPITAR": "247",
    "QUILAVA": "156",
    "RAICHU": "026",
    "RATICATE": "020",
    "RATTATA": "019",
    "RIOLU": "447",
    "SABLEYE": "302",
    "SEALEO": "364",
    "SHUPPET": "353",
    "SLAKING": "289",
    "SLAKOTH": "287",
    "SLOWBRO": "080",
    "SLOWKING": "199",
    "SLOWPOKE": "079",
    "SNOVER": "459",
    "SPHEAL": "363",
    "SQUIRTLE": "007",
    "STEELIX": "208",
    "SUDOWOODO": "185",
    "SWABLU": "333",
    "SWALOT": "317",
    "SYLVEON": "700",
    "TOGEKISS": "468",
    "TOGEPI": "175",
    "TOGETIC": "176",
    "TOTODILE": "158",
    "TOXICROAK": "454",
    "TYPHLOSION": "157",
    "TYRANITAR": "248",
    "UMBREON": "197",
    "VAPOREON": "134",
    "VENUSAUR": "003",
    "VICTREEBEL": "071",
    "VIGOROTH": "288",
    "WALREIN": "365",
    "WARTORTLE": "008",
    "WEEPINBELL": "070",
    "WIGGLYTUFF": "040",
    "WOBBUFFET": "202",
    "WYNAUT": "360",
    "RALTS": "280",
    "KIRLIA": "281",
    "GARDEVOIR": "282",
    "GALLADE": "475",
    "DRATINI": "147",
    "DRAGONITE": "149",
    "DRAGONAIR": "148",
    "STUFFUL": "759",
    "BEWEAR": "760",
    "DEDENNE": "702",
    "RAIKOU": "243",
    "COMFEY": "764",
    "VULPIX": "037",
    "NINETALES": "038",
    "ENTEI": "244",
    "SUICUNE": "245",
    "CRAMORANT": "845",
    "SPRIGATITO": "906",
    "FLORAGATO": "907",
    "MEOWSCARADA": "908",
    "FUECOCO": "909",
    "CROCALOR": "910",
    "SKELEDIRGE": "911",
    "QUAXLY": "912",
    "QUAXWELL": "913",
    "QUAQUAVAL": "914",
}

def download_pokemon_images(name_to_icon):
    base_url = "https://www.serebii.net/pokemonsleep/pokemon/shiny/"
    # base_url = "https://www.serebii.net/pokemonsleep/pokemon/"

    # Directory to save the downloaded images
    save_dir1 = "pokemon_shiny_images_with_suffix"
    save_dir2 = "pokemon_images_by_id_no_leading_zeroes"
    os.makedirs(save_dir1, exist_ok=True)
    os.makedirs(save_dir2, exist_ok=True)

    for name, icon_id in name_to_icon.items():
        icon_id_stripped_leading_zeroes = icon_id.lstrip("0")
        # Construct the full URL for the image
        image_url = f"{base_url}{icon_id_stripped_leading_zeroes}.png"
        # The path to save the image file
        save_path1 = os.path.join(save_dir1, f"{name.lower()}_shiny.png")
        # save_path1 = os.path.join(save_dir1, f"{icon_id}.png")
        save_path2 = os.path.join(save_dir2, f"{icon_id_stripped_leading_zeroes}.png")

        # Request the image from the web
        response = requests.get(image_url)
        # Check if the request was successful (HTTP status code 200)
        if response.status_code == 200:
            # Write the image to a file
            with open(save_path1, 'wb') as file:
                file.write(response.content)
            with open(save_path2, 'wb') as file:
                file.write(response.content)
            print(f"Downloaded and saved {name} as {save_path1}")
        else:
            print(f"Failed to download {name} from {image_url}")

# Call the function to start the download process
download_pokemon_images(name_to_icon)

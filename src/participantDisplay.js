import tacticiansJSON from "./15.4.1/data/en_US/tft-tactician.json";
import traitsJSON from "./15.4.1/data/en_US/tft-trait.json";
import championsJSON from "./15.4.1/data/en_US/tft-champion.json";
import itemsJSON from "./15.4.1/data/en_US/tft-item.json";

function DisplayTest(props) {
  function getTacticianImage(id) {
    let imagePath = tacticiansJSON.data[id].image.full;
    let altString = tacticiansJSON.data[id].name;
    return (
      <img
        src={require(`./15.4.1/img/tft-tactician/${imagePath}`)}
        alt={altString}
        height={"150px"}
      />
    );
  }

  function getStageRound(inputRounds) {
    let stage = Math.ceil(inputRounds / 7);
    let round = inputRounds - ((stage - 2) * 7 + 4);
    return (
      <div>
        {stage} - {round}
      </div>
    );
  }

  function getGameTime(gameSeconds) {
    let minutes = Math.floor(gameSeconds / 60);
    let seconds = Math.trunc(gameSeconds - minutes * 60);

    if (seconds < 10) {
      seconds = "0" + seconds.toString();
    }

    return (
      <div>
        {minutes}:{seconds}
      </div>
    );
  }

  function getBoardValue(units) {
    let valueArray = units.map((unit) => {
      if (unit.rarity === 0) {
        if (unit.tier === 1) {
          return 1;
        } else {
          return Math.pow(3, unit.tier - 1);
        }
      } else if (unit.rarity === 1) {
        if (unit.tier === 1) {
          return 2;
        } else {
          return 2 * Math.pow(3, unit.tier - 1);
        }
      } else if (unit.rarity === 2) {
        if (unit.tier === 1) {
          return 3;
        } else {
          return 3 * Math.pow(3, unit.tier - 1);
        }
      } else if (unit.rarity === 4) {
        if (unit.tier === 1) {
          return 4;
        } else {
          return 4 * Math.pow(3, unit.tier - 1);
        }
      } else if (unit.rarity === 6) {
        if (unit.tier === 1) {
          return 5;
        } else {
          return 5 * Math.pow(3, unit.tier - 1);
        }
      } else {
        if (unit.tier === 1) {
          return 6;
        } else {
          return 6 * Math.pow(3, unit.tier - 1);
        }
      }
    });

    const boardValue = valueArray.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    );

    return <div>Board Value: {boardValue}</div>;
  }

  function getTraitImage(traitObject) {
    let imagePath = traitsJSON.data[traitObject.name].image.full;
    let altString = traitObject.name;

    let traitColor;

    // coloring for "normal" traits
    if (traitObject.style === 1) {
      traitColor = "#CD7F32"; // Bronze
    } else if (traitObject.style === 2) {
      traitColor = "#C0C0C0"; // Silver
    } else if (traitObject.style >= 3) {
      traitColor = "#FFD700"; //Gold
    } else if (
      // Hardcoded conditions for "true" Prismatic traits
      (traitObject.name === "TFT13_Rebel" && traitObject.num_units >= 9) ||
      (traitObject.name === "TFT13_Squad" && traitObject.num_units >= 10) ||
      (traitObject.name === "TFT13_Warband" && traitObject.num_units >= 9)
    ) {
      traitColor = "#B6FFFD"; // Prismatic
    }

    //coloring for "special" traits from high cost units or anomolies
    if (traitObject.tier_total === 1) {
      traitColor = "#FFA500"; // Orange
    }

    return (
      <>
        <h2 style={{ display: "inline" }}>{traitObject.num_units}</h2>
        <img
          src={require(`./15.4.1/img/tft-trait/${imagePath}`)}
          alt={altString}
          style={{ backgroundColor: traitColor }}
        />
      </>
    );
  }

  function getTraitsImages(traits) {
    let filteredTraits = traits.filter((trait) => trait.tier_current > 0);

    // sort first by trait style then number of units if necessary
    function sortingFunc(a, b) {
      if (a.style > b.style) {
        return -1;
      } else if (a.style < b.style) {
        return 1;
      } else {
        if (a.num_units > b.num_units) {
          return -1;
        } else if (a.num_units < b.num_units) {
          return 1;
        } else {
          return 0;
        }
      }
    }

    let sortedTraits = filteredTraits.toSorted(sortingFunc);

    let traitImageArray = sortedTraits.map((trait) => {
      return (
        <>
          {getTraitImage(trait)}
          <span> </span>
        </>
      );
    });

    return traitImageArray;
  }

  function getItemImage(itemString) {
    let imagePath;

    if (itemString.includes("Emblem")) {
      imagePath = itemsJSON.data["TFT13_EmblemItems/" + itemString].image.full;
    } else if (itemString.endsWith("Radiant")) {
      imagePath = itemsJSON.data["Set5_RadiantItems/" + itemString].image.full;
    } else if (itemString.includes("TFT7")) {
      imagePath =
        itemsJSON.data["TFT7_ShimmerscaleItems/" + itemString].image.full;
    } else if (itemString.includes("Crime")) {
      imagePath =
        itemsJSON.data["TFT13_Crime_Illegal_Items/" + itemString].image.full;
    } else {
      imagePath = itemsJSON.data[itemString].image.full;
    }

    let altString = itemString;
    return (
      <img
        src={require(`./15.4.1/img/tft-item/${imagePath}`)}
        alt={altString}
        height={"75px"}
      />
    );
  }

  function getItemsImages(itemList) {
    let itemImageArray = itemList.map((item) => {
      return getItemImage(item);
    });

    return itemImageArray;
  }

  //Uppercase TFT13_J in tft13_jinx, for example, to fix image path grabbing for certain units
  function caseCorrection(character_id) {
    return (
      character_id.charAt(0).toUpperCase() +
      character_id.charAt(1).toUpperCase() +
      character_id.charAt(2).toUpperCase() +
      character_id.slice(3, 6) +
      character_id.charAt(6).toUpperCase() +
      character_id.slice(7)
    );
  }

  function getChampionImage(championObject) {
    // Special case to handle Sion summon
    if (championObject.character_id === "TFT13_Sion") {
      let starsImage = null;
      if (championObject.tier === 2) {
        starsImage = (
          <img src={require("./manualAssets/2stars.png")} alt={"2 stars"} />
        );
      } else if (championObject.tier === 3) {
        starsImage = (
          <img src={require("./manualAssets/3stars.png")} alt={"3 stars"} />
        );
      } else if (championObject.tier === 4) {
        starsImage = (
          <img src={require("./manualAssets/4stars.png")} alt={"4 stars"} />
        );
      }

      return [
        <img
          src={require("./15.4.1/img/champion/Sion.png")}
          alt={"Sion"}
          style={{
            border: "solid",
            borderColor: "black",
            height: "70px",
            width: "70px",
          }}
        />,
      ].concat(starsImage);
    }

    // Special case to handle Jayce's forges
    if (championObject.character_id === "TFT13_JayceSummon") {
      return (
        <img
          src={require("./manualAssets/tft13_jaycesummon.png")}
          alt={"HextechForge"}
          style={{
            border: "solid",
            borderColor: "black",
            height: "70px",
            width: "70px",
            objectFit: "cover",
            objectPosition: "50% 25%",
          }}
        />
      );
    }

    // Get champion's item assests if they have any equipped
    let itemImages;
    if (championObject.itemNames.length) {
      itemImages = getItemsImages(championObject.itemNames);
    }

    let fixedCharacter_id = caseCorrection(championObject.character_id);

    let imagePath;

    // Handle different assest location for 6-costs
    if (championObject.rarity === 8) {
      imagePath =
        championsJSON.data[
          `Maps/Shipping/Map22/Sets/TFTSet13_Evolved/Shop/${fixedCharacter_id}`
        ].image.full;
    } else {
      imagePath =
        championsJSON.data[
          `Maps/Shipping/Map22/Sets/TFTSet13/Shop/${fixedCharacter_id}`
        ].image.full;
    }

    let altString = championObject.character_id;

    let borderColor;

    if (championObject.rarity === 0) {
      borderColor = "#808080";
    } else if (championObject.rarity === 1) {
      borderColor = "#00FF00";
    } else if (championObject.rarity === 2) {
      borderColor = "#0000FF";
    } else if (championObject.rarity === 4) {
      borderColor = "#CC00FF";
    } else if (championObject.rarity === 6) {
      borderColor = "#FFFF00";
    } else {
      borderColor = "#B6FFFD";
    }

    let starsImage = null;
    if (championObject.tier === 2) {
      starsImage = (
        <img src={require("./manualAssets/2stars.png")} alt={"2 stars"} />
      );
    } else if (championObject.tier === 3) {
      starsImage = (
        <img src={require("./manualAssets/3stars.png")} alt={"3 stars"} />
      );
    } else if (championObject.tier === 4) {
      starsImage = (
        <img src={require("./manualAssets/4stars.png")} alt={"4 stars"} />
      );
    }

    return [
      <img
        src={require(`./15.4.1/img/tft-champion/${imagePath}`)}
        alt={altString}
        style={{
          border: "solid",
          borderColor: borderColor,
          height: "70px",
          width: "70px",
          objectFit: "cover",
          objectPosition: "90% 25%",
        }}
      />,
    ]
      .concat(starsImage)
      .concat(itemImages);
  }

  function getChampionsImages(champions) {
    function sortingFunc(a, b) {
      if (a.rarity < b.rarity) {
        return -1;
      } else if (a.rarity > b.rarity) {
        return 1;
      } else {
        return 0;
      }
    }

    let sortedChampions = champions.toSorted(sortingFunc);

    let championImageArray = sortedChampions.map((champion) => {
      return <div>{getChampionImage(champion)}</div>;
    });

    return championImageArray;
  }

  return (
    <div>
      <h1>
        {props.participantExample.placement}.{" "}
        {props.participantExample.riotIdGameName}#
        {props.participantExample.riotIdTagline}
      </h1>
      {getTacticianImage(props.participantExample.companion.item_ID)}

      <div>
        <div>Level: {props.participantExample.level}</div>
        {getStageRound(props.participantExample.last_round)}
        {getGameTime(props.participantExample.time_eliminated)}
        <div>
          Damage Done: {props.participantExample.total_damage_to_players}
        </div>
        {getBoardValue(props.participantExample.units)}
        <div>
          Players eliminated: {props.participantExample.players_eliminated}
        </div>
      </div>

      <h1>Traits</h1>
      {getTraitsImages(props.participantExample.traits)}

      <h1>Board</h1>
      {getChampionsImages(props.participantExample.units)}
    </div>
  );
}

export default DisplayTest;

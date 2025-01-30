import { useState } from "react";
import ParticiapantDisplay from "./participantDisplay.js";

let apiKey = "RGAPI-375afa2c-457e-47c6-b381-e0cfcfc85e40"; // Changes daily, get new from https://developer.riotgames.com/

// STEPS TO GET SINGLE GAME DATA
// 1. Look up player by gameName (Xeroxly) and tagLine (6317) with /riot/account/v1/accounts/by-riot-id/{gameName}/{tagLine} to get PUUID
// 2. Look up match list by PUUID with /tft/match/v1/matches/by-puuid/{puuid}/ids to get list of matchID's
// 3. Look up specifc match details by matchID with /tft/match/v1/matches/{matchId} to get single game data

function APITest() {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [puuid, setPuuid] = useState("");

  const [matchIDList, setMatchIDList] = useState([]);

  const [gameID, setGameID] = useState("");
  const [gameData, setGameData] = useState({});

  const [displayData, setDisplayData] = useState(false);

  function handlePUUIDLookup() {
    fetch(
      `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${apiKey}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setPuuid(data.puuid);
      });
  }

  function handleMatchIDLookup() {
    fetch(
      // Only fetching 20 games now per url "count"
      `https://americas.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=0&count=20&api_key=${apiKey}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setMatchIDList(data);
      });
  }

  function handleGameIDLookup() {
    fetch(
      `https://americas.api.riotgames.com/tft/match/v1/matches/${gameID}?api_key=${apiKey}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        // leaving out data.metadata currently from result. (Object w/ 2 JSONs inside (metadata and info))
        setGameData(data.info);
      })
      .then(() => {
        setDisplayData(true);
      });
  }

  function displayGame(gameDataJSON) {
    function sortingFunc(a, b) {
      if (a.placement < b.placement) {
        return -1;
      } else if (a.placement > b.placement) {
        return 1;
      }
    }

    console.log(gameDataJSON);

    if (displayData) {
      let orderedParticipants = gameDataJSON.participants.toSorted(sortingFunc);

      return orderedParticipants.map((participant) => {
        return (
          <>
            <ParticiapantDisplay participantExample={participant} />
            <h1>
              ---------------------------------------------------------------------------
            </h1>
          </>
        );
      });
    }
  }

  return (
    <div>
      <h1>Name Format is gameName#tagLine</h1>
      <div>
        (Mine is Xeroxly#6317 where Xeroxly is my gameName and 6317 is my
        tagLine)
      </div>
      <br />

      <div>
        <label>Enter your gameName: </label>
        <input
          type="text"
          id="gameName"
          value={gameName}
          onChange={(event) => {
            setGameName(event.target.value);
          }}
        />
      </div>
      <br />
      <div>
        <label>Enter your tagLine: </label>
        <input
          type="text"
          id="tagLine"
          value={tagLine}
          onChange={(event) => {
            setTagLine(event.target.value);
          }}
        />
      </div>
      <br />
      <input type="button" value={"Lookup PUUID"} onClick={handlePUUIDLookup} />
      <br />
      <br />
      {puuid ? (
        <div>
          <div>Your PUUID is: {puuid}</div>
          <br />
          <input
            type="button"
            value={"Lookup MatchIDs"}
            onClick={handleMatchIDLookup}
          />
        </div>
      ) : null}

      {matchIDList ? (
        <div>
          <h2>Your recent match IDs are: </h2>
          {matchIDList.map((id) => {
            return <div key={id}>{id}</div>;
          })}
          <br />
        </div>
      ) : null}

      <div>
        <label>Lookup game details by ID: </label>
        <input
          type="text"
          id="gameID"
          value={gameID}
          onChange={(event) => {
            setGameID(event.target.value);
          }}
        />
      </div>
      <br />
      <input
        type="button"
        value={"Lookup Match by ID"}
        onClick={handleGameIDLookup}
      />
      <br />
      <h1>
        ---------------------------------------------------------------------------
      </h1>
      {displayGame(gameData)}
    </div>
  );
}

export default APITest;

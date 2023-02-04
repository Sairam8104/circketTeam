const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const dbPath = path.join(__dirname, "cricketTeam.db");
const app = express();
app.use(express.json());
let db = null;
const installDb = async () => {
  try {
    db = await open({ filename: dbPath, driver: sqlite3.Database });
    app.listen(3000, () => {
      console.log("server is running at http://localhost:3000");
    });
  } catch (e) {
    console.log(`Db error ${e.message}`);
  }
};
installDb();

app.get("/players/", async (request, response) => {
  const getAllPlayersDetails = `SELECT player_id as playerId,
  player_name as playerName,
  jersey_number as jerseyNumber,
  role as role FROM cricket_team ORDER BY player_id`;
  const playersArray = await db.all(getAllPlayersDetails);
  response.send(playersArray);
});

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;

  const addPlayerQuery = `
    INSERT INTO 
    cricket_team ( player_name,
        jersey_number,
        role) 
    VALUES ('${playerName}',${jerseyNumber},'${role}');`;
  const dbResponse = await db.run(addPlayerQuery);
  response.send("Player Added to Team");
});

app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerDetails = `SELECT player_id as playerId,
  player_name as playerName,
  jersey_number as jerseyNumber,
  role as role FROM cricket_team WHERE player_id = ${playerId};`;

  const player = await db.get(getPlayerDetails);
  response.send(player);
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const updatePlayerDetails = `UPDATE cricket_team SET 
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role='${role}'
    WHERE player_id = ${playerId};`;

  await db.run(updatePlayerDetails);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerDetails = `DELETE FROM 
    cricket_team WHERE player_id = ${playerId};`;

  await db.run(deletePlayerDetails);
  response.send("Player Removed");
});

module.exports = app;

import React, { useState, useEffect } from "react";
import playersData from "./players";

const App = () => {
  const [gridSize, setGridSize] = useState(3);
  const [playersList, setPlayersList] = useState([]);
  const [grid, setGrid] = useState([]);
  const [gridColors, setGridColors] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [totalPlayersUsed, setTotalPlayersUsed] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState("easy");
  const [playerDifficulty, setPlayerDifficulty] = useState(100);
  const [selectedTime, setSelectedTime] = useState(0);
  const [wildCardAvailable, setWildCardAvailable] = useState(true);
  const [isHovered, setIsHovered] = useState(null);

  const timerOptions = [0, 3, 4, 5, 7, 10];

  // Dark mode state
  const [darkMode, setDarkMode] = useState(false);

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (
      selectedTime > 0 &&
      gameStarted &&
      currentPlayerIndex < playersList.length
    ) {
      setTimeLeft(selectedTime);
      const interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            skipPlayer();
            return selectedTime;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(0);
    }
  }, [currentPlayerIndex, selectedTime, gameStarted, playersList.length, skipPlayer]); // ADDED DEPENDENCIES HERE


  const generateGridItems = () => {
    let gridItems = [];
    const usedItems = new Set();
    const filteredPlayers = playersData.filter(
      (player) => player.id <= playerDifficulty
    );
    if (filteredPlayers.length === 0) {
      alert(
        "No players found for the selected difficulty. Please increase the difficulty level."
      );
      return [];
    }

    const iplTeams = {
      "Mumbai Indians": "mi.png",
      "Chennai Super Kings": "csk.png",
      "Royal Challengers Bangalore": "rcb.png",
      "Kolkata Knight Riders": "kkr.png",
      "Delhi Capitals": "dc.png",
      "Punjab Kings": "pun.png",
      "Rajasthan Royals": "rr.png",
      "Sunrisers Hyderabad": "srh.png",
      "Gujarat Titans": "gt.png",
      "Lucknow Super Giants": "lsg.png",
      "Deccan Chargers": "deccan.png",
      "Kochi Tuskers Kerala": "kochi.jpeg",
      "Pune Warriors India": "pune.jpeg",
      "Rising Pune Supergiant": "pune.jpeg",
      "Gujarat Lions": "gt.png",
      "Delhi Daredevils": "dd.png",
    };

    while (gridItems.length < gridSize * gridSize) {
      const randomPlayer =
        filteredPlayers[Math.floor(Math.random() * filteredPlayers.length)];
      let newItem = null;

      switch (difficultyLevel) {
        case "easy":
          newItem = randomPlayer.iplTeams[0];
          break;
        case "medium":
          let mediumType = Math.floor(Math.random() * 2);
          newItem =
            mediumType === 0 ? randomPlayer.nation : randomPlayer.iplTeams[0];
          break;
        case "hard":
          let hardType = Math.floor(Math.random() * 6);
          switch (hardType) {
            case 0:
              newItem = randomPlayer.nation;
              break;
            case 1:
              newItem = randomPlayer.iplTeams[0];
              break;
            case 2:
              newItem =
                randomPlayer.trophies.length > 0
                  ? randomPlayer.trophies[0]
                  : randomPlayer.nation;
              break;
            case 3:
              newItem = `${randomPlayer.iplTeams[0]} + ${randomPlayer.nation}`;
              break;
            case 4:
              newItem =
                randomPlayer.trophies.length > 0
                  ? `${randomPlayer.iplTeams[0]} + ${randomPlayer.trophies[0]}`
                  : randomPlayer.iplTeams[0];
              break;
            case 5:
              newItem =
                randomPlayer.trophies.length > 0
                  ? `${randomPlayer.nation} + ${randomPlayer.trophies[0]}`
                  : randomPlayer.nation;
              break;
            default:
              newItem = randomPlayer.iplTeams[0];
          }
          break;
        default:
          newItem = randomPlayer.iplTeams[0];
      }

      if (newItem && !usedItems.has(newItem)) {
        if (iplTeams[newItem]) {
          gridItems.push({ team: newItem, image: iplTeams[newItem] });
        } else {
          gridItems.push({ team: newItem, text: newItem });
        }
        usedItems.add(newItem);
      }

      if (usedItems.size === gridSize * gridSize) break;
    }
    return gridItems;
  };

  const startGame = () => {
    const gridItems = generateGridItems();
    if (gridItems.length === 0) return;

    let playerCount = gridSize === 3 ? 25 : gridSize === 4 ? 50 : 75;
    const filteredPlayers = playersData.filter(
      (player) => player.id <= playerDifficulty
    );
    let shuffledPlayers = [...filteredPlayers].sort(() => Math.random() - 0.5);
    setPlayersList(shuffledPlayers.slice(0, playerCount));

    setGrid(gridItems);
    setGridColors(Array(gridSize * gridSize).fill("#4a004a"));
    setCurrentPlayerIndex(0);
    setScore(0);
    setTotalPlayersUsed(0);
    setGameOver(false);
    setTimeLeft(selectedTime);
    setGameStarted(true);
    setWildCardAvailable(true);
    setIsHovered(null);
  };

  const handleGridClick = (index) => {
    if (gameOver || currentPlayerIndex >= playersList.length) return;

    let newGrid = [...grid];
    let newGridColors = [...gridColors];
    let player = playersList[currentPlayerIndex];

    let gridItem = newGrid[index];

    if (
      gridItem.team === player.nation ||
      player.iplTeams.includes(gridItem.team) ||
      player.trophies.includes(gridItem.team) ||
      gridItem.team.includes(`${player.iplTeams[0]} + ${player.nation}`) ||
      gridItem.team.includes(`${player.iplTeams[0]} + ${player.trophies[0]}`) ||
      gridItem.team.includes(`${player.nation} + ${player.trophies[0]}`)
    ) {
      newGrid[index] = { team: player.name, text: player.name };
      newGridColors[index] = "#28a745";
      setScore((prevScore) => prevScore + 1);
    } else {
      newGridColors[index] = "#dc3545";
      setTimeout(() => {
        newGridColors[index] = "#4a004a";
        setGridColors([...newGridColors]);
      }, 1000);
      setCurrentPlayerIndex((prev) => prev + 1);
    }

    setGrid(newGrid);
    setGridColors(newGridColors);
    setTotalPlayersUsed((prevTotal) => prevTotal + 1);
    setCurrentPlayerIndex((prev) => prev + 1);

    if (
      score + 1 === gridSize * gridSize ||
      totalPlayersUsed + 1 >= playersList.length
    ) {
      setGameOver(true);
    }
  };

  const skipPlayer = () => {
    if (currentPlayerIndex < playersList.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setTotalPlayersUsed((prevTotal) => prevTotal + 1);
    }
  };

  const useWildCard = () => {
    if (wildCardAvailable) {
      const player = playersList[currentPlayerIndex];
      const newGrid = grid.map((gridItem, index) => {
        if (
          gridItem.team === player.nation ||
          player.iplTeams.includes(gridItem.team) ||
          player.trophies.includes(gridItem.team) ||
          gridItem.team.includes(`${player.iplTeams[0]} + ${player.nation}`) ||
          gridItem.team.includes(
            `${player.iplTeams[0]} + ${player.trophies[0]}`
          ) ||
          gridItem.team.includes(`${player.nation} + ${player.trophies[0]}`)
        ) {
          return { team: player.name, text: player.name };
        }
        return gridItem;
      });

      const newGridColors = gridColors.map((_, index) => {
        if (
          grid[index].team === player.nation ||
          player.iplTeams.includes(grid[index].team) ||
          player.trophies.includes(grid[index].team) ||
          grid[index].team.includes(
            `${player.iplTeams[0]} + ${player.nation}`
          ) ||
          grid[index].team.includes(
            `${player.iplTeams[0]} + ${player.trophies[0]}`
          ) ||
          grid[index].team.includes(`${player.nation} + ${player.trophies[0]}`)
        ) {
          return "#28a745";
        }
        return gridColors[index];
      });

      const correctMatches = newGrid.filter(
        (item) => item.text === player.name
      ).length;
      setScore((prevScore) => prevScore + correctMatches);

      setGrid(newGrid);
      setGridColors(newGridColors);
      setWildCardAvailable(false);
      setTotalPlayersUsed((prevTotal) => prevTotal + 1);
      setCurrentPlayerIndex((prev) => prev + 1);

      if (
        score + correctMatches === gridSize * gridSize ||
        totalPlayersUsed + 1 >= playersList.length
      ) {
        setGameOver(true);
      }
    }
  };

  useEffect(() => {
    if (gameOver) {
      alert(
        `Game Over! Your final score is ${score} out of ${gridSize * gridSize}.`
      );
    }
  }, [gameOver, score, gridSize]);

  const gridItemStyle = {
    width: "150px",
    height: "150px",
    border: "4px solid #fdd835",
    backgroundColor: "#2e7d32",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "1.6rem",
    fontWeight: "bold",
    borderRadius: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
    transition: "width 0.3s ease, height 0.3s ease",
  };

  const gridItemHoverStyle = {
    width: "170px",
    height: "170px",
  };

  const labelStyle = {
    fontSize: "1.5rem",
    marginBottom: "10px",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    borderRadius: "15px",
  };

  const getGridColumns = () => {
    if (window.innerWidth <= 480) {
      return 1;
    } else if (window.innerWidth <= 768) {
      return 2;
    } else {
      return gridSize;
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // Force a re-render to update the grid columns
      setGrid([...grid]);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [grid]);

  // Define styles based on dark mode
  const appStyle = {
    textAlign: "center",
    color: darkMode ? "#eee" : "yellow",
    fontFamily: "'Poppins', sans-serif",
    padding: "20px",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: darkMode ? "#000" : "#380438", // Changed to solid black
  };

  const headingStyle = {
    fontSize: "4rem",
    fontWeight: "bold",
    textShadow: "2px 2px #000",
    letterSpacing: "2px",
    marginBottom: "20px",
    color: darkMode ? "#fff" : "#FFD700",
  };

  const optionsPanelStyle = {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: darkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.5)",
    padding: "20px",
    borderRadius: "10px",
  };

  const labelTextStyle = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "10px",
    color: darkMode ? "#ddd" : "#FFFFFF",
  };

  const selectStyle = {
    padding: "10px",
    fontSize: "1.5rem",
    borderRadius: "8px",
    border: "none",
    marginBottom: "15px",
    backgroundColor: darkMode ? "#555" : "#FFFFFF",
    color: darkMode ? "#eee" : "#333333",
  };

  const buttonStyle = {
    padding: "12px 20px",
    fontSize: "1.5rem",
    backgroundColor: "yellow",
    color: "#1e0031",
    border: "none",
    cursor: "pointer",
    borderRadius: "10px",
    fontWeight: "bold",
    marginBottom: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
  };

  return (
    <div style={appStyle}>
      <h1 style={headingStyle}>🏏 Cricket Bingo 🏆</h1>

      {/* Dark Mode Toggle */}
      <button onClick={toggleDarkMode} style={buttonStyle}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <div style={optionsPanelStyle}>
        <label style={labelTextStyle}>
          Grid Size:
          <select
            onChange={(e) => setGridSize(parseInt(e.target.value))}
            style={selectStyle}
          >
            <option value="3">3x3</option>
            <option value="4">4x4</option>
          </select>
        </label>

        <label style={labelStyle}>
          Select Timer (seconds):
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(parseInt(e.target.value))}
            style={selectStyle}
          >
            <option value={0}>Disable Timer</option>
            {timerOptions.slice(1).map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </label>

        <label style={labelStyle}>
          Player Difficulty (ID &lt;= ):
          <input
            type="number"
            value={playerDifficulty}
            onChange={(e) => setPlayerDifficulty(parseInt(e.target.value))}
            style={{
              padding: "5px",
              fontSize: "1.2rem",
              borderRadius: "5px",
              border: "1px solid #ccc",
              marginLeft: "5px",
              width: "80px",
            }}
          />
        </label>

        <label style={labelStyle}>Difficulty Level:</label>
        <select
          onChange={(e) => setDifficultyLevel(e.target.value)}
          style={selectStyle}
        >
          <option value="easy">Easy (IPL Teams)</option>
          <option value="medium">Medium (Nation & IPL Teams)</option>
          <option value="hard">Hard (All Combinations)</option>
        </select>

        <button onClick={startGame} style={buttonStyle}>
          Start Game 🚀
        </button>
      </div>

      {gameStarted && (
        <>
          {selectedTime > 0 && (
            <h2
              style={{ fontSize: "2rem", color: "red", marginBottom: "10px" }}
            >
              ⏳ Time Left: {timeLeft}s
            </h2>
          )}

          <h2
            style={{
              fontSize: "2.2rem",
              marginBottom: "10px",
              color: "#FFFFFF",
            }}
          >
            Current Player:{" "}
            <span style={{ color: "cyan" }}>
              {playersList[currentPlayerIndex]?.name || "None"}
            </span>
          </h2>
          <h3
            style={{
              fontSize: "2rem",
              color: "#FFA500",
              marginBottom: "10px",
            }}
          >
            🎯 Score: {score} | 📋 Remaining Players:{" "}
            {playersList.length - currentPlayerIndex}
          </h3>

          <div>
            <button
              onClick={skipPlayer}
              style={{
                padding: "14px 30px",
                fontSize: "1.5rem",
                backgroundColor: "red",
                color: "white",
                borderRadius: "12px",
                marginBottom: "15px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
                marginRight: "10px",
              }}
            >
              ⏭ Skip
            </button>

            <button
              onClick={useWildCard}
              disabled={!wildCardAvailable}
              style={{
                padding: "14px 30px",
                fontSize: "1.5rem",
                backgroundColor: wildCardAvailable ? "purple" : "gray",
                color: "white",
                borderRadius: "12px",
                marginBottom: "15px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
            >
              Wild Card ({wildCardAvailable ? "1 Use" : "Used"})
            </button>
          </div>

          <div
            className="grid-container"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${getGridColumns()}, 150px)`,
              gap: "15px",
              justifyContent: "center",
              margin: "30px auto",
            }}
          >
            {grid.map((item, index) => (
              <div
                key={index}
                className={`grid-item`}
                style={{
                  ...gridItemStyle,
                  ...(isHovered === index ? gridItemHoverStyle : {}),
                  backgroundColor: gridColors[index],
                }}
                onMouseEnter={() => setIsHovered(index)}
                onMouseLeave={() => setIsHovered(null)}
                onClick={() => handleGridClick(index)}
              >
                {item.image ? (
                  <img
                    src={`${process.env.PUBLIC_URL}/${item.image}`}
                    alt={item.team}
                    style={imageStyle}
                  />
                ) : (
                  item.text
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {gameOver && (
        <h2 style={{ fontSize: "3rem", color: "gold" }}>Game Over!</h2>
      )}
    </div>
  );
};

export default App;

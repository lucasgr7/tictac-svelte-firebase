<script>
  import { createNewGame, syncGame } from "../firebase/functions";
  import { createEventDispatcher, onMount } from "svelte";

  let session = {};
  let winner = '';
  let positionalWinner = [];
  let userId = localStorage.getItem("userId");
  const dispatch = createEventDispatcher();

  function handleClickCell(element) {
    dispatch("move", {
      position: element.target.id,
    });
  }

  $: isPositionTaken = (position) => {
    if (session.moves) {
      return session.moves.find((move) => move.position == position) != null;
    }
    return false;
  };

  $: hasWinner = () => {
    // check if any of the players cross a line in the board
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      const positionPlayerX = session.moves?.filter(x => x.playerIndex === 0).map(x => parseInt(x.position));
      const positionPlayerO = session.moves?.filter(x => x.playerIndex === 1).map(x => parseInt(x.position));
      if (positionPlayerX?.includes(a) && positionPlayerX?.includes(b) && positionPlayerX?.includes(c)) {
        winner = 'X';
        positionalWinner = [a, b, c];
        return true;
      }
      if (positionPlayerO?.includes(a) && positionPlayerO?.includes(b) && positionPlayerO?.includes(c)) {
        winner = 'O';
        positionalWinner = [a, b, c];
        return true;
      }

    }
    return false;
  }

  $: hasColorOnPosition = (position) => {
    if (positionalWinner.includes(position)) {
      return 'red';
    }
    return 'black';
  }

  function handleNewGame(){
    createNewGame(userId);
  }

  onMount(() => {
    const gameId = localStorage.getItem("gameId");
    if (gameId) {
      // subscribe to a game events
      syncGame((update) => {
        session = update;
      }, gameId);
    }
  });
</script>
<main>
  {#if hasWinner()}
    <h1>Game Over</h1>
    <h2>Winner: {winner}</h2>
    {positionalWinner}
        
    <div>
      <button on:click={handleNewGame}>Start New Game</button>
    </div>
  {:else}
    <h1>Game is on</h1>
  {/if}
  <div class="board">
    {#each Array(9) as _, index (index)}
      <div class="cell" style:background-color={hasColorOnPosition(index)} on:click={handleClickCell} id={index}>
        <span class="small">{index}</span>
        {#if isPositionTaken(index)}
          {#if session?.moves?.find((move) => move.position == index).playerIndex == 0}
            X
          {:else}
            O
          {/if}
        {/if}
      </div>
    {/each}
  </div>
</main>

<style>
  main{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .board {
    /* display elements into 3 columns */
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    grid-gap: 10px;
    width: 300px;
    height: 300px;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
  }
  .cell {
    width: 100px;
    height: 100px;
    border: 1px solid black;
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 50px;
    cursor: pointer;
  }
  span.small{
    font-size: 10px;
    top: 0;
  }
</style>

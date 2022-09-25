<script lang="ts">
  import { onMount } from "svelte/internal";
  import { useStore } from "../store";
  import { createNewGame, syncGame, updateGame } from "../firebase/functions";
  import Board from "./Board.svelte";

  let session = {
    id: null,
    players: [],
    turn: null,
    moves: []
  };
  let store = null;
  const STATES = {
    WAITING_OHTER_PLAYER: 0,
    TURN_ACTIVE: 1,
    TURN_WAITING: 2,
    GAME_OVER: 3,
  };
  let currentState = 0;

  useStore.subscribe((value) => {
    store = value;
  });

  // watchers
  $: gameDataStringfy = JSON.stringify(session, null, 2);
  $: gameIsOn = () => {
    if(session == null) return false;
    if(session.players.length < 2) return false;
    return true;
  }
  // detect if is my turn
  $: isMyTurn = () => {
    if(session == null) return false;
    if(session.turn == store.userId) {
      currentState = STATES.TURN_ACTIVE;
      return true;
    }
    currentState = STATES.TURN_WAITING;
    return false;
  }

  // actions
  function handlePlayerMove({detail: {position}}) {
    if(currentState === STATES.TURN_ACTIVE) {
      // find player from session by index
      const playerIndex = session.players.findIndex((p) => p === store.userId);
      // update session
      if(!session.moves) session.moves = [];
      session.moves.push({playerIndex, position});
      // update turn
      const nextPlayerIndex = (playerIndex + 1) % 2;
      session.turn = session.players[nextPlayerIndex];
      // update db
      updateGame(session);
    }
  }

  // life cycle
  onMount(() => {
    const gameId = localStorage.getItem("gameId");
    if (gameId) {
      // subscribe to a game events
      syncGame((update) => {
        session = update;
      }, gameId)
    }
  });
</script>

<h1>jogo da velha</h1>
<h4>Game Id: <input type="text" bind:value={session.id} readonly /></h4>

{#if isMyTurn() }
  <h3>Seu turno</h3>
{:else }
  <h3>Turno do outro jogador</h3>
{/if}

<Board on:move={handlePlayerMove} />


<style>
  pre{
    /*  align from left to right */
    display: grid;
    justify-content: start;
    margin-top: 50px;

  }
</style>

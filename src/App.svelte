<script>
  import { db } from "./firebase/firebaseClient";
  import { ref, set, get, onValue } from "firebase/database";
  import { generateUUID, useStore, usePlayer, useGame } from "./store";
  import {
    createNewGame,
    enterGame,
    generateRandomName,
    getUser,
    registerNewUser,
    syncGame,
  } from "./firebase/functions";
  import { onMount } from "svelte/internal";
  import Game from "./components/Game.svelte";
  import _ from 'lodash';

  let userId = null;
  let playerName = "...";
  let isPlaying = false;
  let roomCode = "";

  useStore.subscribe((value) => {
    userId = value.userId;
    if (!userId) {
      userId = generateUUID();
      let username = generateRandomName();
      registerNewUser(userId, username);
      localStorage.setItem("userId", userId);
    } else {
      getUser(userId).then((snap) => {
        const u = snap.val();
        usePlayer.set({ name: u.username });
      });
    }
  });

  usePlayer.subscribe((value) => {
    playerName = value.name;
  });

  // functions
  function handleStartNewGame() {
    createNewGame(userId)
  }

  function handleClickEnterGame() {
    enterGame(userId, roomCode)
  }

  onMount(() => {
    isPlaying = localStorage.getItem("gameId") != null ? true : false;
  });
</script>

<section>
  {#if !isPlaying}
    <div>
      <button on:click={handleStartNewGame}>Start New Game</button>
    </div>
    <div>
      <input
        type="text"
        bind:value={roomCode}
        placeholder="Enter a room code"
      />
      <button on:click={handleClickEnterGame}>Enter game</button>
    </div>
  {/if}
  <br />
  Bem vindo {playerName}

  {#if isPlaying}
    <Game />
  {/if}
</section>

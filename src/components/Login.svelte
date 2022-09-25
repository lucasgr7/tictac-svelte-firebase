<script>

  import { savePlayer, createRoom, enterRoom } from "./api";
  import { supabase } from "./supabaseClient";
  import { game} from './store';
  import { onMount } from "svelte/internal";
  import Game from "./Game.svelte";
  
  let username = localStorage.getItem('username');
  let userId = localStorage.getItem('userId');
  let roomCode = localStorage.getItem('roomId');
  let hasRoom = (localStorage.getItem('roomId') != null);

  const getPlayers = async () => {
    try {      
      const { data, error, status } = await supabase
        .from('users')
        .select('name')
        .maybeSingle();
      
      if (error && status !== 406) throw error

      if (data) {
        username = data.name;
        console.log(username);
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message)
      }
    }
  }

  function handleSavePlayer() {
    savePlayer(username);
    username = localStorage.getItem('username');
    userId = localStorage.getItem('userId');
  }

  function handleCreateGameRoom() {
    createRoom();
     hasRoom = (localStorage.getItem('roomId') != null);
  }

  //watch changes in the store
  $: game.subscribe((value) => {
    hasRoom = (localStorage.getItem('roomId') != null);
    
    if(!hasRoom) {
      roomCode = value.gameSessionId;
    }
  });

  
  function handleEnterGameRoom() {
    enterRoom(roomCode);
     
  }
</script>
<!-- input with event when press the key ENTER -->

{#if hasRoom == false}
  {#if userId == null}
  <div >
    <input type="text" bind:value={username} placeholder="Digite seu nome" />
    <button on:click={handleSavePlayer}>SALVAR</button>
  </div>
  {/if}

  <!-- input user name -->
  {#if userId != null}
    <div>
      <h1>Olá {username}</h1>
    </div>
    <button on:click={handleCreateGameRoom}>CRIAR SALA</button>
    <br>
    <br>
    <input type="text" bind:value={roomCode} placeholder="Código da Sala" />
    <br>
    <button on:click={handleEnterGameRoom}>ENTRAR NA SALA</button>
  {/if}
{/if}

{#if hasRoom}
  <div>
    <h1>Código da sala: {roomCode}</h1>
  </div>
  <Game />
{/if}

<style>
 h1 {
    color: pink;
    /* glowing effect */

  }

  button {
    width: 200px;
  }
</style>
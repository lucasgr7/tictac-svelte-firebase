
import { supabase } from "./supabaseClient";
import { useGame } from './store';

// function generates UUID
function generateUuid() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

// function returns randomly 0 or 1
function getRandomInt() {
  return Math.floor(Math.random() * 2);
}

export async function savePlayer(username) {
  const uuid = generateUuid();
  localStorage.setItem('userId', uuid);
  localStorage.setItem('username', username);

  //create user in supabase
  supabase
    .from('users')
    .insert([
      { uuid: uuid, name: username, wins: 0, losts: 0 },
    ])
    .then(({ data, error }) => {
      console.log(data, error)
    })
}

export async function createRoom() {
  const creator = localStorage.getItem('userId');

  // create gameroom in supabase and return representation

  supabase
    .from('gameroom')
    .insert([
      { useruuid1: creator, grid: [], turn: getRandomInt() },
    ])
    .select('*')
    .then(({ data, error }) => {
      console.log(data, error)

      if (data) {
        loginRoom(data);
      }
    }
  )

}

export async function enterRoom(code) {
  const userId = localStorage.getItem('userId');

  // update gameroom in supabase
  supabase
    .from('gameroom')
    .update([
      { useruuid2: userId },
    ])
    .eq('id', code)
    .select('*')
    .then(({ data, error }) => {
      console.log(data, error)
      if (error) {
        alert('Sala não existe');
      }

      if (data) {
        loginRoom(data);
      }
    }
  )
}

function loginRoom(data) {
  console.log(data);
  const gameSessionId = data[0].id;

  useGame.update((game) => {
    localStorage.setItem('roomId', gameSessionId);
    game.gameSessionId = gameSessionId;
    return game;
  });
}
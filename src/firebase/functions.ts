
import { db } from "../firebase/firebaseClient";
import { ref, set, get, onValue } from "firebase/database";
import { generateUUID } from "../store";
import _ from 'lodash';

// create a function generate a random name
export function generateRandomName() {
  const adjectives = ["Amazing", "Beautiful", "Charming", "Delightful", "Elegant", "Fancy", "Gorgeous", "Handsome", "Icy", "Jolly", "Kind", "Lively", "Magnificent", "Nice", "Obedient", "Polite", "Quaint", "Reliable", "Sparkling", "Tasty", "Ugliest", "Vivacious", "Wonderful", "Xenial", "Young", "Zany"];
  const animals = ["Alligator", "Bear", "Cat", "Dog", "Elephant", "Frog", "Giraffe", "Horse", "Iguana", "Jaguar", "Koala", "Lion", "Monkey", "Narwhal", "Octopus", "Pig", "Quail", "Raccoon", "Snake", "Tiger", "Unicorn", "Vulture", "Walrus", "Xerus", "Yak", "Zebra"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective} ${animal}`;
}

export function registerNewUser(uuid, name) {
  //register new user into firebase
  set(ref(db, 'users/' + uuid), {
    username: name
  });
}

export function getUser(uuid) {
  return get(ref(db, 'users/' + uuid))
}


export function syncGame(callback, gameId) {
  onValue(ref(db, "games/" + gameId), (snapshot) => {
    const data = snapshot.val();
    callback(data);
    console.log("game data: ", data);
  })
};

export function updateGame(session){
  set(ref(db, "games/" + session.id), session);
}

export function createNewGame(userId){  
    // generate uuid
    const gameId = generateUUID();
    // saves locally
    localStorage.setItem("gameId", gameId);
    // saves on db
    set(ref(db, "games/" + gameId), {
      id: gameId,
      players: [userId],
      turn: userId,
    });
}

export function enterGame(userId, roomCode){
  const gameId = roomCode;
  // saves locally
  localStorage.setItem("gameId", gameId);
  // saves on db
  syncGame((update)=> {
    update.players.push(userId);
    update.players = _.uniq(update.players);
    set(ref(db, "games/" + gameId), update);
  }, gameId);
}
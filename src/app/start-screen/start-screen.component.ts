import { Component, OnInit } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { addDoc, collection, getFirestore, getDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent implements OnInit {

  constructor(private router: Router, private afApp: FirebaseApp) { }

  ngOnInit(): void { }

  async newGame() {
    //startgame
    let game = new Game();

    const db = getFirestore();
    const collRef = collection(db, "games");

    const docRef = await addDoc(collRef, game.addtoJson());
    console.log("Document written with ID: ", docRef.id);
    let params = await getDoc(docRef);
    // this.route.params.subscribe(async (params):Promise<void> => {
    let gameId = params.id;
    this.router.navigateByUrl('/game/' + gameId);
  }
}

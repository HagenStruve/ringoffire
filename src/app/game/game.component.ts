import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, addDoc, getFirestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']

})
export class GameComponent implements OnInit {
  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  games$: Observable<any>;

  constructor(public dialog: MatDialog, private firestore: Firestore) {


    const coll = collection(this.firestore, 'games');
    this.games$ = collectionData(coll);

    this.games$.subscribe((test) => {
      console.log('test ist', test)
    })
  }

  ngOnInit(): void {
    this.newGame();
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop()!;
      this.pickCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      setTimeout(() => {
        this.game.playerCard.push(this.currentCard);
        this.pickCardAnimation = false;
        this.saveGame();
      }, 1000)
    }
  }

  async newGame() {
    this.game = new Game();
    // const db = getFirestore();

    // const docRef = await addDoc(collection(db, "games"), {
    //   addtoJson(){}
    // });
    // console.log("Document written with ID: ", docRef.id);


    // const coll = collection(this.firestore, 'games');
    // this.games$ = collectionData(coll);

    // this.games$.setDoc(doc(db, "cities", "new-city-id"), data);

    // this.firestore.collection('games').add({'Hallo: Welt'})
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  saveGame() {
    updateDoc(this.docRef, this.game.addtoJson())
  }
}

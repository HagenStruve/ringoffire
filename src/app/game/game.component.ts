import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import {MatDialog} from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, addDoc } from '@angular/fire/firestore';
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
  
  constructor( public dialog: MatDialog, private firestore: Firestore ) {


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

      setTimeout(() => {
        this.game.playerCard.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000)
    }
  }

  newGame() {
    this.game = new Game();

    const coll = collection(this.firestore, 'games');
    this.games$ = collectionData(coll);

    this.games$.addDoc({'Hallo: Welt'});

    // this.firestore.collection('games').add({'Hallo: Welt'})
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
     this.game.players.push(name);
    }
    });
  }
}

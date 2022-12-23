import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, addDoc, getFirestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

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

  gameId;
  docRef: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog, private firestore: Firestore) {


    const coll = collection(this.firestore, 'games');
    this.games$ = collectionData(coll);

    this.games$.subscribe((test) => {
      console.log('test ist', test)
    })
  }

  async ngOnInit(): Promise<void> {
    this.newGame();

    const db = getFirestore();

    this.route.params.subscribe(async (params): Promise<void> => {
      this.gameId = params['id'];
      console.log(params);

      const docRef = doc(db, "games", this.gameId);
      const docSnap = await getDoc(docRef);
      let game: any = docSnap.data();

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        this.game.currentPlayer = game.currentPlayer;
        this.game.playerCard = game.playerCard;
        this.game.players = game.players;
        this.game.stack = game.stack;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    });


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

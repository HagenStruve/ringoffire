import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collectionData, collection, addDoc, getFirestore, updateDoc, doc, getDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']

})
export class GameComponent implements OnInit {

  game!: Game;

  games$: Observable<any>;

  gameId;
  docRef: any;
  gameOver = false;

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

      this.games$.subscribe(async () => {
        this.docRef = doc(db, "games", this.gameId);
        const docSnap = await getDoc(this.docRef);
        let game: any = docSnap.data();

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
          this.game.currentPlayer = game.currentPlayer;
          this.game.playerCard = game.playerCard;
          this.game.players = game.players;
          this.game.player_imges = game.player_imges;
          this.game.stack = game.stack;
          this.game.pickCardAnimation = game.pickCardAnimation;
          this.game.currentCard = game.currentCard;
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      });
    });

  }

  takeCard() {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else
      if (!this.game.pickCardAnimation == this.game.players.length > 1) {
        this.game.currentCard = this.game.stack.pop()!;
        this.game.pickCardAnimation = true;

        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        this.saveGame();

        setTimeout(() => {
          this.game.playerCard.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }, 1000)
      }
  }


  async newGame() {
    this.game = new Game();
    this.gameOver = false;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent, {
    });

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_imges.push('1.webp');
        this.saveGame();
      }
    });
  }

  saveGame() {
    updateDoc(this.docRef, this.game.addtoJson())
  }

  editPlayer(playerID) {
    const dialogRef = this.dialog.open(EditPlayerComponent, {
    });


    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerID, 1);
          this.game.player_imges.splice(playerID, 1);
        } else
          this.game.player_imges[playerID] = change;
      }
    });
    this.saveGame();
  }
}

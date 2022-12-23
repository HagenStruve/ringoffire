export class Game {
    public players: string[] = [];
    public stack: string[] = [];
    public playerCard: string[] = [];
    public currentPlayer:number = 0;
  static currentPlayer: number;
  static playerCard: string[];
  static players: string[];
  static stack: string[];

    constructor() {
        for (let i = 1; i < 14; i++) {
            this.stack.push('spade_' + i);
            this.stack.push('hearts_' + i);
            this.stack.push('clubs_' + i);
            this.stack.push('diamonds_' + i);
        }

        shuffle(this.stack);
       
    }

     public addtoJson(): any {
         return {
            players: this.players,
            stack: this.stack,
            playerCard: this.playerCard,
            currentPlayer: this.currentPlayer
        }
    }
}


function shuffle(array: any[]) {
    let currentIndex = array.length, temporaryValue,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
  }
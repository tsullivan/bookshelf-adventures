Bookshelf adventures
A world where bookshelves can have adventures.

Dev Journal

**7/8/2023**
This is a chatbot game where you tell the computer what mini-game you want to play.
The computer keeps track of where you are in any game, and your overall scores.
Games:
1. Pong-based game
2. Frogger-based game
3. Kung-Fu game
4. Tank game
5. Book-collecting game

The chatbot understands all the commands from our old chatbot, such as repeat and the other adventure games like the Hiking game and The Batcave.

---------------------------------------------

The bookshelves can have different powers like Ness and Lukas
New story mode
    End boss hates bookshelves
    He is beaten by falling on him 5 times
    The currency is pages
    Shops with purchasable items

---------------------------------------------

When you're playing a story, the computer can show pictures and play sounds, like a Monkey Island Game.
    Pictures can have subtitles

Characters
    Player's name is Shelfie
    Pet notebook in a fishbowl, with fins, name Shelvfish
    The dad's name is Shufty and the mom's name is Sondra.
    Their friend is named Sneaker and they wear tennis shoes
    The enemy is called Shelfless.


**7/9/2023**
I plan to use the `switchMap` operator to fork control to a different pipeline. Here is an example code snippet:

```typescript
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

const observable = of(1, 2, 3);
observable.pipe(
  switchMap((value) => {
    if (value === 2) {
      return of('two');
    }
    return of(value);
  })
).subscribe(console.log);
```

In this example, the observable emits values `1`, `2`, and `3`. The `switchMap` operator checks if the value is equal to `2`. If it is, it returns an observable that emits the string `'two'`. If it's not equal to `2`, it returns an observable that emits the original value.

Source: Conversation with Bing, 7/9/2023
(1) Form Handling using RxJS and TypeScript - This Dot Labs. https://www.thisdot.co/blog/form-handling-using-rxjs-and-typescript/.
(2) typescript - How to use forkjoin to return combined responses of two .... https://stackoverflow.com/questions/71928988/how-to-use-forkjoin-to-return-combined-responses-of-two-independent-api-calls-in.
(3) How do I persist a value across RxJS 6 pipe operators?. https://stackoverflow.com/questions/65366435/how-do-i-persist-a-value-across-rxjs-6-pipe-operators.
(4) forkJoin - Learn RxJS. https://www.learnrxjs.io/learn-rxjs/operators/combination/forkjoin.
(5) Typescript Pipeline Operator for chained function calls. https://flaming.codes/posts/pipeline-operator-in-typescript-chained-function-calls.

---------------------------------------------

https://github.com/sxzz/unplugin-vue/blob/main/examples/esbuild/build.js


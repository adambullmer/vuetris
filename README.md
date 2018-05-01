Vuetris
=======

Simple Tetris clone written in VueJs

Controls
--------
|| Key || Key Name   || Description ||
| `←`  | Left Arrow  | Translate active piece left |
| `→`  | Right Arrow | Translate active piece right |
| `↓`  | Down Arrow  | Soft drop (translate active piece down) |
| `↑`  | Up Arrow    | Hard drop (translate active piece down until collission) |
| `⇧`  | Shift       | Rotate active piece clockwise |
| `⌃`  | Control     | Rotate active piece counter-clockwise |
| `␣`  | Space Bar   | Un/Pause Game |
| `⌧`  | Escape      | End Game |

Installation
------------

- `yarn install`
- `yarn server`
- open [http://127.0.0.1:8080/game](http://127.0.0.1:8080/game)

Improvements and Features
-------------------------

- [ ] Wall Kicks
- [ ] T-Spin Detection
- [ ] Sleeker animations
- [x] Better UI and layout for game
- [ ] Animate game over
- [x] mobile ui components
- [ ] Repeating commands on held keys (and components)
- [ ] Pause/Unpause active game
- [x] End current game (not by losing)
- [ ] Local/Global Leader Boards
- [ ] Preview hard drop position
- [ ] Adjustable starting level
- [ ] Instructions / Controlls Screen
- [ ] Held piece swap
- [ ] Sound Effects / Music

Advanced Features
-----------------

- [ ] Per-pixel movement
- [ ] Animate movement (motion blur)
- [ ] Hold actions for buttons
- [ ] Hold Action for hard drop (On end press, stop hard dropping)

Known Bugs
----------

- Rendering bugs around the up next pieces, and actually previewing them
- Variant speeds around hard dropping a piece

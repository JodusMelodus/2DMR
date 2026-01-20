fallSpeed = 100;
game_paused = false;

document.addEventListener('contextmenu', event => event.preventDefault());

class Player {
    constructor(name = "", cords = [], hotbar = [dirt_block, dirt_block, grass_block, grass_block, grass_block, obsidian_block, grass_block, grass_block, grass_block], hotbarItems = [1, 1, 3, 5, 8, 13, 21, 2, 5], health = 20) {
        this.name = name;
        this.x_cord = cords[0];
        this.y_cord = cords[1];
        this.hotbar = hotbar;
        this.hotbarItems = hotbarItems;
        this.health = health;
        this.blockLookingAt = [];
        this.selectedSlot = 0;
        this.image = `textures/${name}.png`;
    }
}

class Mob {
    constructor(name = "", cords = [], health = 10) {
        this.name = name;
        this.x_cord = cords[0];
        this.y_cord = cords[1];
        this.health = health;
        this.health_base = 10;
        this.image = `textures/${name}.png`;
    }
}

class Block {
    constructor(name = "", break_time = 0, breakable = true, solid = true, transparent = false, falling_block = false) {
        this.name = name;
        this.break_time = break_time;
        this.breakable = breakable;
        this.solid = solid;
        this.transparent = transparent;
        this.falling_block = falling_block;
        this.image = `textures/${name}.png`;
    }
}

const dirt_block = new Block("dirt_block", 10, true, true, false, false);
const grass_block = new Block("grass_block", 10, true, true, false, false);
const air_block = new Block("air_block", 0, false, false, true, false);
const obsidian_block = new Block("obsidian_block", 100, true, true, false, false);
const bedrock_block = new Block("bedrock_block", 0, false, true, false, false);
const player = new Player("player1", [5, 6]);
const pig = new Mob("pig", [8, 8]);
const cow = new Mob("cow", [9, 8]);
const chicken = new Mob("chicken", [10, 8]);

entities = [player, pig, cow, chicken];

gameArr = [[dirt_block, dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block],
[dirt_block, grass_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block, air_block]]

function randint(min, max) {
    return Math.floor(Math.random() * (max + 1 - min)) + min;
}

function update() {
    if (game_paused == false) {

        for (let e = 0; e < entities.length; e++) {
            gameArr[entities[e].x_cord][entities[e].y_cord] = entities[e];
        }

        for (let r = 1; r < gameArr.length + 1; r++) {
            for (let c = 1; c < gameArr[0].length + 1; c++) {

                let screenCord = document.getElementById(`${r};${c}`);
                let gameArrCord = gameArr[r - 1][c - 1];

                if (screenCord.children.length > 0) {
                    screenCord.children[0].remove();
                }
                if (screenCord.classList.length > 0) {
                    screenCord.removeAttribute("class");
                }

                if (gameArrCord instanceof Player) {
                    let player = gameArrCord;
                    if (player.health != 0) {
                        var IMG = document.createElement("img")
                        IMG.src = player.image;
                        screenCord.appendChild(IMG);
                    }
                }
                if (gameArrCord instanceof Mob) {
                    let mob = gameArrCord;
                    if (mob.health > 0) {
                        var IMG = document.createElement("img")
                        IMG.src = mob.image;
                        screenCord.appendChild(IMG);
                    }
                }
                if (gameArrCord instanceof Block) {
                    let block = gameArrCord;
                    var IMG = document.createElement("img")
                    IMG.src = block.image;
                    screenCord.appendChild(IMG);
                }
            }
        }

        for (let item = 0; item < player.hotbar.length; item++) {
            let slot = document.getElementById(`hotslot${item}`);

            if (slot.children.length > 0) {
                slot.children[0].remove()
            }

            if (player.hotbarItems[item] != 0) {
                let hotslotItem = player.hotbar[item];
                slot.innerHTML = (player.hotbarItems[item]);
                var IMG = document.createElement("img");
                IMG.src = hotslotItem.image;
                slot.appendChild(IMG);
            }
            else {
                try {
                    slot.innerHTML = (player.hotbarItems[item]);
                    player.hotbar[item] = null;
                    slot.children[0].remove();
                } catch (error) { }
            }
        }
        hotbarUpdate(player.selectedSlot);

        sessionStorage.setItem("player", JSON.stringify(player));

        document.getElementById("player_cords").innerHTML = `Coords : (${player.x_cord} ; ${player.y_cord})`;
        document.getElementById("player_look_cords").innerHTML = `Coords looking at : (${player.blockLookingAt[0]};${player.blockLookingAt[1]})`;
    }
}

function updateEntities() {
    for (let r = 1; r < gameArr.length + 1; r++) {
        for (let c = 1; c < gameArr[0].length + 1; c++) {
            if ((gameArr[r - 1][c - 1] instanceof Mob) == true) {
                let mob = gameArr[r - 1][c - 1];
                fall(mob);

                let choice = randint(1, 3);

                switch (choice) {
                    case 1:
                        move(mob, "a");
                        break;
                    case 2:
                        move(mob, "d");
                        break;
                    case 3:
                        let choice = randint(1, 2);
                        jump(mob);
                        if (choice == 1) {
                            move(mob, "a");
                        } else {
                            move(mob, "d");
                        }
                        break;
                    default:
                        break;
                }
            }
        }
    }
}

function jump(Entity) {
    if (game_paused == false) {
        let blockAbove = gameArr[Entity.x_cord][Entity.y_cord + 1];
        let blockBelow = gameArr[Entity.x_cord][Entity.y_cord - 1];
        if ((blockAbove.solid == false) && (blockBelow.solid == true)) {
            gameArr[Entity.x_cord][Entity.y_cord] = air_block;
            Entity.y_cord = Entity.y_cord + 1;
            update();
            setTimeout(function () {
                fall(Entity);
            }, fallSpeed);
        }
        update();
    }
}

function fall(Entity) {
    if (game_paused == false) {
        try {
            let blockUnder = gameArr[Entity.x_cord][Entity.y_cord - 1];
            if (blockUnder.solid == false) {
                gameArr[Entity.x_cord][Entity.y_cord] = air_block;
                Entity.y_cord = Entity.y_cord - 1;
                update();
                setTimeout(function () {
                    fall(Entity);
                }, fallSpeed);
            }
        } catch (error) { }
    }

}

function move(Entity, direction) {
    if (game_paused == false) {
        let cords = [Entity.x_cord, Entity.y_cord];
        gameArr[cords[0]][cords[1]] = air_block;

        if (direction == "a") {
            try {
                let blockLeft = gameArr[Entity.x_cord - 1][Entity.y_cord];
                if (blockLeft.solid == false) {
                    Entity.x_cord = Entity.x_cord - 1;
                }
            } catch (error) { }
        } else {
            try {
                if (direction == "d") {
                    let blockRight = gameArr[Entity.x_cord + 1][Entity.y_cord];
                    if (blockRight.solid == false) {
                        Entity.x_cord = Entity.x_cord + 1;
                    }
                }
            } catch (error) { }
        }
        update();
        setTimeout(function () {
            fall(Entity);
        }, fallSpeed);
    }
}

function rightClick() {
    if (game_paused == false) {
        let gameArrLookingCord = gameArr[player.blockLookingAt[0]][player.blockLookingAt[1]];

        if (gameArrLookingCord instanceof Block) {
            let block = gameArrLookingCord;
            if (block.breakable == true) {
                let x = player.hotbar.indexOf(block);
                if (x != -1) {
                    player.hotbarItems[x] += 1;
                    gameArr[player.blockLookingAt[0]][player.blockLookingAt[1]] = air_block;
                } else {
                    let emptySlot = player.hotbar.indexOf(null);
                    player.hotbar[emptySlot] = block;
                    player.hotbarItems[emptySlot] = 1;
                    gameArr[player.blockLookingAt[0]][player.blockLookingAt[1]] = air_block;
                }
            }
        }
        if (gameArrLookingCord instanceof Mob) {
            let mob = gameArrLookingCord;
            if (mob.health > 0) {
                mob.health = mob.health - 5;
            }
        }
    }
}

function placeBlock() {
    if (game_paused == false) {
        let block = gameArr[player.blockLookingAt[0]][player.blockLookingAt[1]];
        if (block.solid == false && player.hotbarItems[player.selectedSlot] != 0) {
            gameArr[player.blockLookingAt[0]][player.blockLookingAt[1]] = player.hotbar[player.selectedSlot];
            player.hotbarItems[player.selectedSlot] -= 1;
        }
    }
}

document.onmousedown = function (e) {
    if (game_paused == false) {
        if (e.button == 0) {
            rightClick();
        } else if (e.button == 2) {
            placeBlock();
        } else if (e.button == 1) {
            pickBlock();
        }
        update();
        setTimeout(function () {
            fall(player);
        }, fallSpeed);
    }
}

function hotbarUpdate(index) {
    if (game_paused == false) {
        document.getElementById(`hotslot${player.selectedSlot}`).classList.remove("selhotslot");
        player.selectedSlot = index;
        document.getElementById(`hotslot${player.selectedSlot}`).classList.add("selhotslot");
    }
}

function togglePause() {
    if (game_paused == false) {
        game_paused = true;
        document.getElementById("gamestate").innerHTML = "Game is paused.";
    } else {
        game_paused = false;
        document.getElementById("gamestate").innerHTML = "Playing...";
    }

}

document.onkeydown = function (e) {
    key = e.key;

    switch (key) {
        case "a":
            move(player, "a");
            player.blockLookingAt = [player.x_cord - 1, player.y_cord];
            break;
        case "d":
            move(player, "d");
            player.blockLookingAt = [player.x_cord + 1, player.y_cord];
            break;
        case "w":
            player.blockLookingAt = [player.x_cord, player.y_cord + 1];
            break;
        case "s":
            player.blockLookingAt = [player.x_cord, player.y_cord - 1];
            break;
        case " ":
            jump(player);
            player.blockLookingAt = [player.x_cord, player.y_cord - 1];
            break;
        case "A":
            player.blockLookingAt = [player.x_cord - 1, player.y_cord];
            break;
        case "D":
            player.blockLookingAt = [player.x_cord + 1, player.y_cord];
            break;
        case "W":
            player.blockLookingAt = [player.x_cord, player.y_cord + 1];
            break;
        case "S":
            player.blockLookingAt = [player.x_cord, player.y_cord - 1];
            break;
        case "1":
            hotbarUpdate(0);
            break;
        case "2":
            hotbarUpdate(1);
            break;
        case "3":
            hotbarUpdate(2);
            break;
        case "4":
            hotbarUpdate(3);
            break;
        case "5":
            hotbarUpdate(4);
            break;
        case "6":
            hotbarUpdate(5);
            break;
        case "7":
            hotbarUpdate(6);
            break;
        case "8":
            hotbarUpdate(7);
            break;
        case "9":
            hotbarUpdate(8);
            break;
        case "Escape":
            togglePause();
            break;
        case "e":
            game_paused = true;
            open("../inventory.html");
            break;
    }
    update();
};
update();

setInterval(() => {
    updateEntities();
}, 1000);
const array_size = 10;
let my_array = [];
const max_num = 100;
let key = NaN;
let search_index = -1;
let key_found = false;

let array_state = [];

const index_not_searched = 0;
const index_current_search = 1;
const index_searched = 2;
const index_key_found = 3;

const array_not_search_color = [19, 214, 71];
const array_current_search_color = [64, 230, 177];
const array_searched_color = [108, 113, 115];
const array_key_found_color = [64, 191, 230];
const array_colors = [array_not_search_color, array_current_search_color, array_searched_color, array_key_found_color];
const text_color = [255, 255, 255];

const min_size = 45;
let box_size;
let min_x_offset;
let min_y_offset;

let time_step = 100;
let time_deposit = 0;
let turn = false;
let play = false;

let speed_slider;

function preload() {

}

function setup() {
    my_canvas = createCanvas(0.9 * window.innerWidth, 0.9 * window.innerHeight);

    reset_settings();

    calculate_offset();

    textAlign(CENTER, CENTER);
    textSize(Math.floor(box_size / 3));


    //code for creating HTML elementa
    let key_input = createInput();
    let play_btn = createButton('Play!');
    let pause_btn = createButton('Pause');
    let reset_btn = createButton('Reset');
    speed_slider = createSlider(100, 1000);

    play_btn.mousePressed(() => {
        if (isNaN(key)) {
            alert('Please enter a valid key');
        } else {
            play = true;
        }
    });
    pause_btn.mousePressed(() => { play = false; });
    reset_btn.mousePressed(reset_settings);
    key_input.input(() => {
        key = Number(key_input.value());
    });

    speed_slider.style('width', '200px');
    speed_slider.input(() => {
        time_step = speed_slider.value();
    });

    /*let step_button = createButton('next');
    step_button.mousePressed(take_step);*/
}

function draw() {
    background(255);

    let y_index = 0;
    let x_index = 0;

    for (let i = 0; i < my_array.length; i++) {
        let x = x_offset + x_index * box_size;
        let y = y_offset + y_index * box_size;

        if (x + box_size > width) {
            x_index = 0;
            y_index += 1;

            x = x_offset + x_index * box_size;
            y = y_offset + y_index * box_size;
        }

        stroke(255, 255, 255);
        const index_color = array_colors[array_state[i]];
        fill(index_color[0], index_color[1], index_color[2]);
        rect(x, y, box_size, box_size);
        fill(text_color[0], text_color[1], text_color[2]);
        text('' + my_array[i], x, y, box_size, box_size);

        x_index += 1;
    }

    if (!key_found && play) {
        if (time_deposit >= time_step) {
            take_step();
            time_deposit = time_deposit - time_step;
        } else {
            time_deposit += deltaTime;
        }
    }

}

function take_step() {
    if (turn) {
        linear_search(search_index);
    } else {
        search_index += 1;
        array_state[search_index] = index_current_search;
    }

    turn = !turn;
}

function linear_search(index) {
    if (index >= 0 && index < my_array.length) {
        if (key == my_array[index]) {
            key_found = true;
            array_state[index] = index_key_found;
        } else {
            array_state[index] = index_searched;
        }
    }
}

function windowResized() {
    resizeCanvas(0.95 * window.innerWidth, 0.95 * window.innerHeight);
    calculate_offset();
    textSize(Math.floor(box_size / 3));
}

function calculate_offset() {
    box_size = 0.06 * window.innerWidth;
    if (box_size < min_size) {
        box_size = min_size;
    }
    min_x_offset = 0.07 * window.innerWidth;
    min_y_offset = 0.156 * window.innerHeight;
    if (min_x_offset + my_array.length * box_size > width - min_x_offset) {
        x_offset = min_x_offset;
    } else {
        x_offset = (width - my_array.length * box_size) / 2;
    }
    const display_arr_width = (width - 2 * x_offset);
    const display_arr_rows = Math.ceil(my_array.length * box_size / display_arr_width);

    if (min_y_offset + box_size * display_arr_rows > height - min_y_offset) {
        y_offset = min_y_offset;
    } else {
        y_offset = (height - box_size * display_arr_rows) / 2;
    }
}

function reset_settings() {
    for (let i = 0; i < array_size; i++) {
        my_array[i] = Math.floor(Math.random() * max_num);
        array_state[i] = index_not_searched;
    }

    key_found = false;
    search_index = -1;
    turn = false;
    time_deposit = 0;
    play = false;
}

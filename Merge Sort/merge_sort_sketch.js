const array_size = 20;
let my_array = [];
const max_num = 100;
let buffer_array = [];
let min_element;

let my_canvas;
let color_stack = [];
let array_color = [];
let generated_colors = [];

const min_box_height = 100;
const min_box_width = 20;
let min_x_offset = 100;
let min_y_offset = 100;
let box_height;
let box_width;
let x_offset;
let y_offset;

let iterator;
let time_step = 500;
let time_deposit = 0;

let reset_btn;

function preload() {

}

function setup() {
    my_canvas = createCanvas(window.innerWidth, 0.9 * window.innerHeight);
    init();

    reset_btn = createButton('Reset');
    reset_btn.mousePressed(init);
}

function draw() {
    background(255);

    // fill(200, 200, 200);
    // rect(0, 0, width, height / 2);

    // fill(100, 100, 100);
    // rect(min_x_offset, min_y_offset, width - 2 * min_x_offset, height / 2 - 2 * min_y_offset);
    stroke(255, 255, 255);

    let index_x = 0;
    let index_y = 0;
    for (let i = 0; i < array_size; i++) {
        fill(array_color[i][0], array_color[i][1], array_color[i][2]);
        const current_box_height = (my_array[i] / max_num) * box_height;
        let x = (x_offset) + box_width * index_x;

        if (+(x + box_width).toPrecision(6) > width - x_offset) {
            index_y += 1;
            index_x = 0;
            x = x_offset + box_width * index_x;
        }

        const y = y_offset + index_y * box_height + (box_height - current_box_height);
        rect(x, y, box_width, current_box_height);

        index_x += 1;
    }

    index_x = 0;
    index_y += 1;
    for (let i = 0; i < array_size; i++) {
        fill(54, 158, 82);
        let current_box_height = 0;
        if (buffer_array[i]) {
            current_box_height = (buffer_array[i] / max_num) * box_height;
        }
        let x = (x_offset) + box_width * index_x;

        if (+(x + box_width).toPrecision(6) > width - x_offset) {
            index_y += 1;
            index_x = 0;
            x = x_offset + box_width * index_x;
        }

        let y = y_offset + index_y * box_height + (box_height - current_box_height);
        rect(x, y, box_width, current_box_height);

        index_x += 1;
    }

    if (time_deposit >= time_step) {
        const val = iterator.next();
        time_deposit -= time_step;
    } else {
        time_deposit += deltaTime;
    }
}

function generate_array() {
    for (let i = 0; i < array_size; i++) {
        my_array[i] = Math.ceil(Math.random() * max_num);
    }
}

function calc_min_element() {
    min_element = my_array[0];
    for (let i = 1; i < array_size; i++) {
        if (my_array[i] < min_element) {
            min_element = my_array[i];
        }
    }
}

function windowResized() {
    resizeCanvas(window.innerWidth, 0.9 * window.innerHeight);
    calc_offset_box_size();
}

function calc_offset_box_size() {
    // my_array[array_size - 1] = max_num;

    min_x_offset = 0.035 * window.innerWidth;
    min_y_offset = 0.04 * window.innerHeight / 2;

    box_width = 0.035 * window.innerWidth;

    if (box_width < min_box_width) {
        box_width = min_box_width;
    }

    if (min_x_offset + box_width * array_size > width - min_x_offset) {
        x_offset = min_x_offset;
    } else {
        x_offset = (width - array_size * box_width) / 2;
    }

    const display_array_width = (width - 2 * x_offset);
    const display_array_rows = Math.ceil(array_size * box_width / display_array_width);

    box_height = (0.75 * window.innerHeight / 2) / display_array_rows;

    if (box_height < min_box_height) {
        box_height = min_box_height;
    }

    if (min_y_offset + box_height * display_array_rows > (height / 2) - min_y_offset) {
        y_offset = min_y_offset;
    } else {
        y_offset = ((height / 2) - display_array_rows * box_height) / 2;
    }
}

function* merge_sort(arr, p, q) {
    let new_color = generated_colors.pop();
    color_stack.push(new_color);
    //console.log(color_stack.length)
    for (let i = p; i <= q; i++) {
        array_color[i] = new_color;
    }
    yield;
    if (p < q) {
        let r = Math.floor((p + q) / 2);
        yield* merge_sort(arr, p, r);
        yield* merge_sort(arr, r + 1, q);
        yield* merge(arr, p, r, q);
    }
}

function* merge(arr, p, q, r) {
    let left = arr.slice(p, q + 1);
    let right = arr.slice(q + 1, r + 1);
    left.push(Infinity);
    right.push(Infinity);

    let m = 0;
    let n = 0;
    for (let i = p; i <= r; i++) {
        if (left[m] < right[n]) {
            buffer_array[i] = left[m];
            m += 1;
        } else {
            buffer_array[i] = right[n];
            n += 1;
        }
        yield;
    }

    for (let i = p; i <= r; i++) {
        arr[i] = buffer_array[i];
        yield;
    }

    color_stack.pop();
    color_stack.pop();

    let prev_color = color_stack[color_stack.length - 1];
    for (let i = p; i <= r; i++) {
        array_color[i] = prev_color;
    }
    yield;

    for (let i = p; i <= r; i++) {
        buffer_array[i] = undefined;
    }
    yield;
}

function init() {
    buffer_array = [];
    color_stack = [];
    my_array = [];
    array_color = [];
    generate_array();
    let max_num_colors = Math.pow(2, Math.ceil(Math.log2(array_size)) + 1) - 1;
    generated_colors = generate_all_random_colors(max_num_colors);
    iterator = merge_sort(my_array, 0, array_size - 1);
    iterator.next();
    calc_min_element();
    calc_offset_box_size();
}


function generate_all_random_colors(n) {
    random_list = [];
    for (let i = 0; i < n;) {
        rnd = Math.random();
        let different = true;
        for (let j = i - 1; j >= 0; j--) {
            if (Math.round(rnd * 255) == Math.round(random_list[j] * 255)) {
                different = false;
                break;
            }
        }
        if (different == true) {
            random_list[i] = rnd;
            i += 1;
        }
    }

    colors = [];
    for (let i = 0; i < n; i++) {
        colors[i] = generate_random_color(random_list[i]);
    }

    return colors;
}

function generate_random_color(rnd) {
    const golden_ration_conjugate = 0.618033988749895;
    h = rnd;
    h += golden_ration_conjugate;
    h %= 1;
    return hsv_to_rgb(h, 0.5, 0.95);
}

function hsv_to_rgb(h, s, v) {
    const h_i = Math.round(h * 6);
    const f = h * 6 - h_i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    let r, g, b;
    switch (h_i) {
        case 0:
            r = v;
            g = t;
            b = p;
            break;
        case 1:
            r = q;
            g = v;
            b = p;
            break;
        case 2:
            r = p;
            g = v;
            b = t;
            break;
        case 3:
            r = p;
            g = q;
            b = v;
            break;
        case 4:
            r = t;
            g = p;
            b = v;
            break;
        case 5:
            r = v;
            g = p;
            b = q;
            break;
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
let preview = null;
let content = null;

let backgroundColor = '#ffffff';
let foregroundColor = '000000';
let pattern = 'Default';
let patterns = {
    Default: '',
    Texture: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23<foregroundColor>' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
    Jupiter: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='52' height='52' viewBox='0 0 52 52'%3E%3Cpath fill='%23<foregroundColor>' fill-opacity='0.4' d='M0 17.83V0h17.83a3 3 0 0 1-5.66 2H5.9A5 5 0 0 1 2 5.9v6.27a3 3 0 0 1-2 5.66zm0 18.34a3 3 0 0 1 2 5.66v6.27A5 5 0 0 1 5.9 52h6.27a3 3 0 0 1 5.66 0H0V36.17zM36.17 52a3 3 0 0 1 5.66 0h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 0 1 0-5.66V52H36.17zM0 31.93v-9.78a5 5 0 0 1 3.8.72l4.43-4.43a3 3 0 1 1 1.42 1.41L5.2 24.28a5 5 0 0 1 0 5.52l4.44 4.43a3 3 0 1 1-1.42 1.42L3.8 31.2a5 5 0 0 1-3.8.72zm52-14.1a3 3 0 0 1 0-5.66V5.9A5 5 0 0 1 48.1 2h-6.27a3 3 0 0 1-5.66-2H52v17.83zm0 14.1a4.97 4.97 0 0 1-1.72-.72l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1 0-5.52l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43c.53-.35 1.12-.6 1.72-.72v9.78zM22.15 0h9.78a5 5 0 0 1-.72 3.8l4.44 4.43a3 3 0 1 1-1.42 1.42L29.8 5.2a5 5 0 0 1-5.52 0l-4.43 4.44a3 3 0 1 1-1.41-1.42l4.43-4.43a5 5 0 0 1-.72-3.8zm0 52c.13-.6.37-1.19.72-1.72l-4.43-4.43a3 3 0 1 1 1.41-1.41l4.43 4.43a5 5 0 0 1 5.52 0l4.43-4.43a3 3 0 1 1 1.42 1.41l-4.44 4.43c.36.53.6 1.12.72 1.72h-9.78zm9.75-24a5 5 0 0 1-3.9 3.9v6.27a3 3 0 1 1-2 0V31.9a5 5 0 0 1-3.9-3.9h-6.27a3 3 0 1 1 0-2h6.27a5 5 0 0 1 3.9-3.9v-6.27a3 3 0 1 1 2 0v6.27a5 5 0 0 1 3.9 3.9h6.27a3 3 0 1 1 0 2H31.9z'%3E%3C/path%3E%3C/svg%3E")`,
    Hideout: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23<foregroundColor>' fill-opacity='0.4'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
    'Graph Paper': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23<foregroundColor>' fill-opacity='0.4'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
};

let textColor = '#000';
let textSize = '2.5rem';
let textFont = '';

let tableHeaderBackgroundColor = '#fff';
let tableHeaderTextColor = '#212529';
let tableBodyBackgroundColor = '#fff';
let tableBodyTextColor = '#212529';
let tableBorderColor = '#dee2e6';

let navbarBackgroundColor = '#e3f2fd';
let navbarTextColor = '#000';

let buttonBackground = '#007bff';
let buttonTextColor = '#ffffff';

window.onload = () => {
    preview = document.getElementById('preview').parentNode;
    content = document.getElementById('content');

    changeBackgroundPattern(document.getElementById('backgroundPattern'));
    changeBackgroundColor(document.getElementById('backgroundColor'));
    changeBackgroundFColor(document.getElementById('backgroundFColor'));
    changeTextFont(document.getElementById('textFamily'));
    changeTextSize(document.getElementById('textSize'));
    changeTableHeaderBackground(
        document.getElementById('tableHeaderBackgroundColor')
    );
    changeButtonBackground(document.getElementById('buttonBackground'));
    changeButtonTextColor(document.getElementById('buttonTextColor'));
    changeTableHeaderText(document.getElementById('tableHeaderTextColor'));
    changeTableBodyBackground(
        document.getElementById('tableBodyBackgroundColor')
    );
    changeTableBodyText(document.getElementById('tableBodyTextColor'));
    changeTableBorderColor(document.getElementById('tableBorderColor'));
    changeNavbarBackgroundColor(
        document.getElementById('navbarBackgroundColor')
    );
    changeNavbarTextColor(document.getElementById('navbarTextColor'));
};

// - - - - - - - -
// BACKGROUND
// - - - - - - - -

function changeBackgroundPattern(input) {
    pattern = patterns[input.value];
    preview.style.backgroundImage = patterns[input.value].replace(
        '<foregroundColor>',
        foregroundColor
    );
}

function changeBackgroundFColor(input) {
    foregroundColor = input.value.substring(1);
    preview.style.backgroundImage = pattern.replace(
        '<foregroundColor>',
        foregroundColor
    );
}

function changeBackgroundColor(input) {
    backgroundColor = input.value;
    preview.style.backgroundColor = input.value;
}

// - - - - - - - -
// TEXT
// - - - - - - - -

function changeTextColor(input) {
    textColor = input.value;
    preview.style.color = textColor;
}

function changeTextSize(input) {
    textSize = input.value;
    content.style.fontSize = textSize;
}

function changeTextFont(input) {
    textFont = input.value;
    preview.style.fontFamily = input.value;
}

// - - - - - - - -
// TABLE
// - - - - - - - -

function changeTableHeaderBackground(input) {
    tableHeaderBackgroundColor = input.value;
    const theads = document.getElementsByTagName('thead');
    for (let thead of theads) {
        thead.style.backgroundColor = input.value;
    }
}

function changeTableHeaderText(input) {
    tableHeaderTextColor = input.value;
    const theads = document.getElementsByTagName('thead');
    for (let thead of theads) {
        thead.style.color = input.value;
    }
}

function changeTableBorderColor(input) {
    tableBorderColor = input.value;
    const tables = document.getElementsByTagName('table');
    const ths = document.getElementsByTagName('th');
    const tds = document.getElementsByTagName('td');
    for (let table of tables) {
        table.style.borderColor = input.value;
    }
    for (let th of ths) {
        th.style.borderColor = input.value;
    }
    for (let td of tds) {
        td.style.borderColor = input.value;
    }
}

function changeTableBodyBackground(input) {
    tableBodyBackgroundColor = input.value;
    const tbodys = document.getElementsByTagName('tbody');
    for (let tbody of tbodys) {
        tbody.style.backgroundColor = input.value;
    }
}

function changeTableBodyText(input) {
    tableBodyTextColor = input.value;
    const tbodys = document.getElementsByTagName('tbody');
    for (let tbody of tbodys) {
        tbody.style.color = input.value;
    }
}

function changeNavbarBackgroundColor(input) {
    navbarBackgroundColor = input.value;
    const navs = document.getElementsByTagName('nav');
    for (let nav of navs) {
        nav.style.backgroundColor = input.value;
    }
}

function changeNavbarTextColor(input) {
    navbarTextColor = input.value;
    const navs = document.getElementsByTagName('nav');
    for (let nav of navs) {
        nav.style.color = input.value;
    }
}

function changeButtonBackground(input) {
    buttonBackground = input.value;
    const buttons = document.getElementsByClassName('btn-custom');
    for (let button of buttons) {
        button.style.backgroundColor = input.value;
    }
}

function changeButtonTextColor(input) {
    buttonTextColor = input.value;
    const buttons = document.getElementsByClassName('btn-custom');
    for (let button of buttons) {
        button.style.color = input.value;
    }
}

function buildResult() {
    let styles = {
        backgroundColor,
        foregroundColor,
        pattern,
        textColor,
        textSize,
        textFont,
        buttonBackground,
        buttonTextColor,
        tableHeaderBackgroundColor,
        tableHeaderTextColor,
        tableBodyBackgroundColor,
        tableBodyTextColor,
        tableBorderColor,
        navbarBackgroundColor,
        navbarTextColor,
    };

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/styles', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                window.location.href = '/';
            } else {
                alert('Não foi possivel gerar os styles');
            }
        }
    };
    xhr.send(JSON.stringify({ styles }));
    console.log(styles);
}

existingSchemas = [];
views = [];

window.onload = () => {
    loadExistingViews();
    loadExistingSchemas();
};

function loadExistingViews() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            const existingViews = xhr.response;
            for (const view of existingViews) addExistingView(view);
        }
    };

    xhr.open('GET', '/views');
    xhr.send();
}

function loadExistingSchemas() {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            existingSchemas = xhr.response;
            renderExistingSchemas();
        }
    };

    xhr.open('GET', '/schemas');
    xhr.send();
}

function getExistingSchema(title) {
    for (var i = 0; i < existingSchemas.length; i++) {
        if (existingSchemas[i].title === title) {
            return existingSchemas[i];
        }
    }
}

function renderExistingSchemas() {
    const models = document.getElementById('models');
    models.innerHTML = existingSchemas
        .map(
            (schema) =>
                `<option value="${schema.title}">${schema.title}</option>`
        )
        .join('');
    handleModelChange(existingSchemas[0].title);
}

function handleModelChange(value) {
    const properties = document.getElementById('properties');
    properties.innerHTML = Object.keys(getExistingSchema(value).properties).map(
        (prop) => `<option value="${prop}">${prop}</option>`
    );
}

class View {
    static count = 0;

    constructor(model, property, order, limit) {
        this.id = View.count++;
        this.model = model;
        this.property = property;
        this.order = order;
        this.limit = limit;
    }

    toJSON() {
        let { model, property, order, limit } = this;
        return { model, property, order, limit };
    }

    render() {
        return `
            <tr id="view-${this.id}">
                <td class="align-middle">${this.model}</td>
                <td class="align-middle">${this.property}</td>
                <td class="align-middle">${this.order}</td>
                <td class="align-middle">${this.limit}</td>
                <td align="center"><button class="btn btn-danger btn-sm" onclick="removeView(${this.id})"> Remove </button></td>
            </tr>
    `;
    }
}

function addExistingView(view) {
    const existingViewsHTML = document.getElementById('existingViews');
    const viewObj = new View(view.model, view.property, view.order, view.limit);
    views.push(viewObj);
    existingViewsHTML.innerHTML += viewObj.render();
}

function addNewView(e, form) {
    e.preventDefault();
    const existingViewsHTML = document.getElementById('existingViews');
    const newView = new View(
        form.models.value,
        form.properties.value,
        form.order.value,
        form.limit.value
    );
    views.push(newView);
    existingViewsHTML.innerHTML += newView.render();
}

function removeView(id) {
    views.forEach((view, index) => {
        if (view.id === id) {
            views.splice(index, 1);
            return;
        }
    });
    document.getElementById(`view-${id}`).outerHTML = '';
}

function saveViews() {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/views', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                window.location.href = '/';
            } else {
                alert('Não foi possivel criar as views');
            }
        }
    };
    xhr.send(JSON.stringify({ views }));
}

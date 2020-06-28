schemaName = '';
schemaDescription = '';
properties = [];
references = [];

existingSchemas = [];

// - - - - - - - - - - -
// Existing schemas
// - - - - - - - - - - -

function loadExistingSchemas(render, schemaToEdit) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            existingSchemas = xhr.response;
            if (render) renderExistingSchemas();
            if (schemaToEdit) prefillData(schemaToEdit);
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

function renderSchemaProperties(schema) {
    let properties = [];
    for (var [name, info] of Object.entries(schema.properties)) {
        properties.push(`
            <p class="mb-0"> • ${name} </p>
            <p class="mb-0 ml-3"> ${info.description} </p>
            <p class="mb-0 ml-3"> Type: ${info.type} </p>
            <p class="mb-0 ml-3"> Unique: ${info.unique || false} </p>
            ${
                info.pattern
                    ? `<p class="mb-0 ml-3"> Pattern: ${info.pattern} </p>`
                    : ''
            }
            ${
                info.maximum
                    ? `<p class="mb-0 ml-3"> Maximum: ${info.maximum} </p>`
                    : ''
            }
            ${
                info.minimum
                    ? `<p class="mb-0 ml-3"> Minimum: ${info.minimum} </p>`
                    : ''
            }
        `);
    }
    return properties.join('');
}

function renderSchemaReferences(schema) {
    if (schema.references) {
        return schema.references
            .map(
                (reference) =>
                    `<p class="card-text"> ${reference.model} - (${reference.relation}) </p>`
            )
            .join('');
    }

    return 'No references';
}

function renderExistingSchemas() {
    const schemasHTML = existingSchemas.map(
        (schema) =>
            `
        <div class="col-12" id="schema-${schema.title}">
            <div class="card text-white bg-dark mb-3">
                <div class="card-header">
                    <button class="btn btn-danger btn-sm float-right" onclick="deleteSchema('${
                        schema.title
                    }')">
                        Delete
                    </button>
                    <button 
                        class="btn btn-primary btn-sm float-right mr-2" 
                        onclick="window.location.href = '/editor.html?schema=${
                            schema.title
                        }'">
                        Edit
                    </button>
                    <h4>${schema.title}</h4>
                    ${schema.description}
                </div>
                <div class="card-body">
                    <div class="row">
                        <div class="col-6">
                            <h5 class="card-title">Properties</h5>
                            <div class="ml-2"> 
                                ${renderSchemaProperties(schema)}
                            </div>
                        </div>
                        <div class="col-6">
                            <h5 class="card-title">References</h5>
                            <div class="ml-2"> 
                                ${renderSchemaReferences(schema)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        `
    );

    const schemasContainer = document.getElementById('schemasContainer');
    schemasContainer.innerHTML = schemasHTML.join('');
}

function deleteSchema(schemaName) {
    console.log(schemaName);
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/schemas', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                document.getElementById(`schema-${schemaName}`).outerHTML = '';
            }
        }
    };
    xhr.send(JSON.stringify({ schemaName }));
}

// - - - - - - - - - - -
// Model info
// - - - - - - - - - - -

function updateSchemaName(element) {
    schemaName = element.value;

    renderPreview();
}

function updateSchemaDescription(element) {
    schemaDescription = element.value;

    renderPreview();
}

// - - - - - - - - - - -
// Properties
// - - - - - - - - - - -

class Property {
    static count = 0;

    constructor({
        name,
        description,
        label,
        type,
        isRequired,
        unique,
        presentationMode,
        pattern,
        maximum,
        minimum,
    } = {}) {
        this.id = Property.count++;
        this.name = name || `prop-${this.id}`;
        this.description = description;
        this.label = label;
        this.type = type || 'string';
        this.isRequired = isRequired || false;
        this.unique = unique || false;
        this.presentationMode = presentationMode;
        this.pattern = pattern;
        this.maximum = maximum;
        this.minimum = minimum;
    }

    toJSON() {
        let {
            description,
            label,
            type,
            unique,
            presentationMode,
            pattern,
            maximum,
            minimum,
        } = this;
        return {
            description,
            label,
            type,
            unique,
            presentationMode,
            pattern,
            maximum,
            minimum,
        };
    }

    render() {
        console.log(this);
        return `
    <div class="card text-white bg-dark mb-3" id="property-${this.id}">
      <div class="card-header">
        <button
          type="button"
          class="btn float-right btn-danger btn-sm"
          onclick="deleteProperty(${this.id})"
        >
          Delete
        </button>
      </div>
      <div class="card-body">
        <div class="form-group row">
          <label for="prop-name-${this.id}" class="col-sm-3 col-form-label">
            Name
          </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" value="${
                this.name === undefined ? '' : this.name
            }" id="prop-name-${this.id}" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="prop-description-${
              this.id
          }" class="col-sm-3 col-form-label">
            Description
          </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" value="${
                this.description === undefined ? '' : this.description
            }" id="prop-description-${
            this.id
        }" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="prop-label-${this.id}" class="col-sm-3 col-form-label">
            Label name (in details)
          </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" value="${
                this.label === undefined ? '' : this.label
            }" id="prop-label-${this.id}" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="prop-type-${this.id}" class="col-sm-3 col-form-label">
            Type
          </label>
          <div class="col-sm-9">
            <select class="form-control" id="prop-type-${
                this.id
            }" onchange="updatePropertyValue(this)">
              <option value="string" ${
                  this.type === 'string' ? 'selected' : ''
              }>String</option>
              <option value="integer" ${
                  this.type === 'integer' ? 'selected' : ''
              }>Integer</option>
              <option value="boolean" ${
                  this.type === 'boolean' ? 'selected' : ''
              }>Boolean</option>
              <option value="color" ${
                  this.type === 'color' ? 'selected' : ''
              }>Color</option>
              <option value="date" ${
                  this.type === 'date' ? 'selected' : ''
              }>Date</option>
              <option value="datetime" ${
                  this.type === 'datetime' ? 'selected' : ''
              }>Datetime</option>
              <option value="email" ${
                  this.type === 'email' ? 'selected' : ''
              }>Email</option>
              <option value="password" ${
                  this.type === 'password' ? 'selected' : ''
              }>Password</option>
              <option value="range" ${
                  this.type === 'range' ? 'selected' : ''
              }>Range</option>
              <option value="time" ${
                  this.type === 'time' ? 'selected' : ''
              }>Time</option>
              <option value="url" ${
                  this.type === 'url' ? 'selected' : ''
              }>URL</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label for="prop-presentationMode-${
              this.id
          }" class="col-sm-3 col-form-label">
            Presentation Mode
          </label>
          <div class="col-sm-9">
            <select class="form-control" id="prop-presentationMode-${
                this.id
            }" onchange="updatePropertyValue(this)">
              <option value="image" ${
                  this.presentationMode === 'image' ? 'selected' : ''
              }>Image</option>
              <option value="video" ${
                  this.presentationMode === 'video' ? 'selected' : ''
              }>Video</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label for="prop-pattern-${this.id}" class="col-sm-3 col-form-label">
            Pattern
          </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" value="${
                this.pattern === undefined ? '' : this.pattern
            }" id="prop-pattern-${
            this.id
        }" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row" style="display: none">
          <label for="prop-maximum-${this.id}" class="col-sm-3 col-form-label">
            Maximum
          </label>
          <div class="col-sm-9">
            <input type="number" class="form-control" value="${
                this.maximum === undefined ? '' : this.maximum
            }" id="prop-maximum-${
            this.id
        }" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row" style="display: none">
          <label for="prop-minimum-${this.id}" class="col-sm-3 col-form-label">
            Minimum
          </label>
          <div class="col-sm-9">
            <input type="number" class="form-control" value="${
                this.minimum === undefined ? '' : this.minimum
            }" id="prop-minimum-${
            this.id
        }" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="prop-isRequired-${this.id}"
            onchange="updatePropertyValue(this)"
            ${this.isRequired ? 'checked' : ''}
          />
          <label class="form-check-label" for="prop-isRequired-${this.id}">
            Required property
          </label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="prop-unique-${this.id}"
            onchange="updatePropertyValue(this)"
            ${this.unique ? 'checked' : ''}
          />
          <label class="form-check-label" for="prop-unique-${this.id}">
            Unique property
          </label>
        </div>
      </div>
    </div>
    `;
    }
}

function getProperty(id) {
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].id === id) {
            return properties[i];
        }
    }
}

function addProperty(prop) {
    const newProp = prop || new Property();
    properties.push(newProp);

    const propertiesContainer = document.getElementById('properties');
    propertiesContainer.insertAdjacentHTML('beforeend', newProp.render());
    handleConstraints(newProp, newProp.type);

    renderPreview();
}

function deleteProperty(id) {
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].id === id) {
            properties.splice(i, 1);
            break;
        }
    }

    const propertyHTML = document.getElementById(`property-${id}`);
    propertyHTML.outerHTML = '';

    renderPreview();
}

function updatePropertyValue(element) {
    const [propField, propId] = element.id.split('-').splice(1);
    let property = getProperty(Number(propId));
    if (propField === 'type') {
        handleConstraints(property, element.value);
    }
    property[propField] =
        element.type === 'checkbox' ? element.checked : element.value;

    renderPreview();
}

function handleConstraints(property, type) {
    const propPresentationModeHTML = document.getElementById(
        `prop-presentationMode-${property.id}`
    );
    const propPatternHTML = document.getElementById(
        `prop-pattern-${property.id}`
    );
    const propMinHTML = document.getElementById(`prop-minimum-${property.id}`);
    const propMaxHTML = document.getElementById(`prop-maximum-${property.id}`);
    switch (type) {
        case 'string':
            property.maximum = undefined;
            property.minimum = undefined;
            propPresentationModeHTML.parentNode.parentNode.style.display =
                'flex';
            propPatternHTML.parentNode.parentNode.style.display = 'flex';
            propMaxHTML.parentNode.parentNode.style.display = 'none';
            propMinHTML.parentNode.parentNode.style.display = 'none';
            propPresentationModeHTML.value = '';
            propMaxHTML.value = '';
            propMinHTML.value = '';
            break;
        case 'url':
            property.pattern = undefined;
            property.maximum = undefined;
            property.minimum = undefined;
            propPresentationModeHTML.parentNode.parentNode.style.display =
                'flex';
            propPatternHTML.parentNode.parentNode.style.display = 'none';
            propMaxHTML.parentNode.parentNode.style.display = 'none';
            propMinHTML.parentNode.parentNode.style.display = 'none';
            propPresentationModeHTML.value = '';
            propPatternHTML.value = '';
            propMaxHTML.value = '';
            propMinHTML.value = '';
            break;
        case 'integer':
            property.presentationMode = undefined;
            property.pattern = undefined;
            propPresentationModeHTML.parentNode.parentNode.style.display =
                'none';
            propPatternHTML.parentNode.parentNode.style.display = 'none';
            propMaxHTML.parentNode.parentNode.style.display = 'flex';
            propMinHTML.parentNode.parentNode.style.display = 'flex';
            propPresentationModeHTML.value = '';
            propPatternHTML.value = '';
            break;
        default:
            property.presentationMode = undefined;
            property.pattern = undefined;
            property.maximum = undefined;
            property.minimum = undefined;
            propPresentationModeHTML.parentNode.parentNode.style.display =
                'none';
            propPatternHTML.parentNode.parentNode.style.display = 'none';
            propMaxHTML.parentNode.parentNode.style.display = 'none';
            propMinHTML.parentNode.parentNode.style.display = 'none';
            propPresentationModeHTML.value = '';
            propPatternHTML.value = '';
            propMaxHTML.value = '';
            propMinHTML.value = '';
            break;
    }
}

// - - - - - - - - - - -
// References
// - - - - - - - - - - -

function renderExistingSchemasNames(selection) {
    return existingSchemas.map(
        (schema) =>
            `<option value="${schema.title}" ${
                selection === schema.title ? 'selected' : ''
            }>${schema.title}</option>`
    );
}

function renderDefaultLabels() {
    return Object.values(existingSchemas[0].properties).map(
        (prop) =>
            `<option value="${prop.description}">${prop.description}</option>`
    );
}

class Reference {
    static count = 0;

    constructor({ model, relation, label, isRequired } = {}) {
        this.id = Reference.count++;
        this.model = model || existingSchemas[0].title;
        this.relation = relation || '1-1';
        this.label =
            label ||
            Object.values(existingSchemas[0].properties)[0].description;
        this.isRequired = isRequired === undefined ? false : isRequired;
    }

    toJSON() {
        let { model, relation, label, isRequired } = this;
        return { model, relation, label, isRequired };
    }

    render() {
        return `
    <div class="card text-white bg-dark mb-3" id="reference-${this.id}">
      <div class="card-header">
        <button
          type="button"
          class="btn float-right btn-danger btn-sm"
          onclick="deleteReference(${this.id})"
        >
          Delete
        </button>
      </div>
      <div class="card-body">
        <div class="form-group row">
          <label for="ref-model-${this.id}" class="col-sm-2 col-form-label">
            Model
          </label>
          <div class="col-sm-10">
            <select class="form-control" id="ref-model-${
                this.id
            }" onchange="updateReferenceValue(this)">
              ${renderExistingSchemasNames(this.model)}
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label for="ref-relation-${this.id}" class="col-sm-2 col-form-label">
            Relation
          </label>
          <div class="col-sm-10">
            <select class="form-control" id="ref-relation-${
                this.id
            }" onchange="updateReferenceValue(this)">
              <option value="1-1" ${
                  this.relation === '1-1' ? 'selected' : ''
              }>1-1</option>
              <option value="1-M" ${
                  this.relation === '1-M' ? 'selected' : ''
              }>1-M</option>
              <option value="M-M" ${
                  this.relation === 'M-M' ? 'selected' : ''
              }>M-M</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label for="ref-label-${this.id}" class="col-sm-2 col-form-label">
            Property to show as label
          </label>
          <div class="col-sm-10">
            <select class="form-control" id="ref-label-${
                this.id
            }" onchange="updateReferenceValue(this)">
            </select>
          </div>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="ref-isRequired-${this.id}"
            onchange="updateReferenceValue(this)"
            ${this.isRequired ? 'checked' : ''}
          />
          <label class="form-check-label" for="ref-isRequired-${this.id}">
            Required on reference insert form
          </label>
        </div>
      </div>
    </div>
    `;
    }
}

function getReference(id) {
    for (var i = 0; i < references.length; i++) {
        if (references[i].id === id) {
            return references[i];
        }
    }
}

function addReference(ref) {
    const newRef = ref || new Reference();
    references.push(newRef);

    const referencesContainer = document.getElementById('references');
    referencesContainer.insertAdjacentHTML('beforeend', newRef.render());
    handleModelChange(newRef, newRef.model, newRef.label);

    renderPreview();
}

function deleteReference(id) {
    for (var i = 0; i < references.length; i++) {
        if (references[i].id === id) {
            references.splice(i, 1);
            break;
        }
    }

    const referenceHTML = document.getElementById(`reference-${id}`);
    referenceHTML.outerHTML = '';

    renderPreview();
}

function updateReferenceValue(element) {
    const [refField, refId] = element.id.split('-').splice(1);
    let reference = getReference(Number(refId));
    if (refField === 'model') {
        handleModelChange(reference, element.value);
    }
    reference[refField] =
        element.type === 'checkbox' ? element.checked : element.value;

    renderPreview();
}

function handleModelChange(ref, value, selection) {
    const refLabels = document.getElementById(`ref-label-${ref.id}`);
    ref.label = Object.keys(getExistingSchema(value).properties)[0];
    refLabels.innerHTML = Object.keys(getExistingSchema(value).properties).map(
        (prop) =>
            `<option value="${prop}" ${
                selection === prop ? 'selected' : ''
            }>${prop}</option>`
    );
}

// - - - - - - - - - - -
// Preview
// - - - - - - - - - - -

function buildPreview() {
    let preview = {};

    // Model info
    preview.title = schemaName;
    preview.description = schemaDescription;

    // Properties
    requiredProperties = [];
    if (properties.length) {
        preview.properties = {};
        for (var i = 0; i < properties.length; i++) {
            preview.properties[properties[i].name] = properties[i].toJSON();
            if (properties[i].isRequired) {
                requiredProperties.push(properties[i].name);
            }
        }
        if (requiredProperties.length) {
            preview.properties.required = requiredProperties;
        }
    }

    // References
    for (var i = 0; i < references.length; i++) {
        preview.references = references;
    }

    return preview;
}

function renderPreview() {
    const preview = buildPreview();
    document.getElementById('preview-code').innerHTML = JSON.stringify(
        preview,
        null,
        4
    );
}

// - - - - - - - - - - -
// Schema creation
// - - - - - - - - - - -

function validateSchema(isCreation) {
    let schema = {};
    const errorContainer = document.getElementById('error-msg');

    // Model info
    if (!schemaName || schemaName === '') {
        errorContainer.textContent = 'Schema must have a name';
        $('.toast').toast('show');
        return;
    }
    if (
        isCreation &&
        existingSchemas.map((schema) => schema.title).includes(schemaName)
    ) {
        errorContainer.textContent = 'Schema with this name already exists';
        $('.toast').toast('show');
        return;
    }
    schema.title = schemaName;
    schema.description = schemaDescription;

    // Properties
    if (properties.length === 0) {
        errorContainer.textContent = 'Schema must have atleast 1 property';
        $('.toast').toast('show');
        return;
    }

    let requiredProperties = [];
    schema.properties = {};
    let mapDuplicates = {};
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].name === '') {
            errorContainer.textContent = 'All properties must have a name';
            $('.toast').toast('show');
            return;
        }
        if (mapDuplicates[properties[i].name]) {
            errorContainer.textContent =
                'Cannot have properties with the same name';
            $('.toast').toast('show');
            return;
        }
        mapDuplicates[properties[i].name] = true;

        schema.properties[properties[i].name] = properties[i].toJSON();
        if (properties[i].isRequired) {
            requiredProperties.push(properties[i].name);
        }
    }
    if (requiredProperties.length) {
        schema.properties.required = requiredProperties;
    }

    // References
    for (var i = 0; i < references.length; i++) {
        schema.references = references;
    }

    isCreation ? createSchema(schema) : editSchema(schema);
}

function createSchema(schema) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/schemas', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                window.location.href = '/schemas.html';
            } else {
                alert('Não foi possivel criar o novo schema');
            }
        }
    };
    xhr.send(JSON.stringify({ schema }));
}

// - - - - - - - - - - -
// Schema edition
// - - - - - - - - - - -

function prefillData(schemaToEdit) {
    const schema = existingSchemas.filter(
        (sch) => sch.title === schemaToEdit
    )[0];
    if (schema) {
        document.getElementById('modelName').value = schema.title;
        document.getElementById('modelDesc').value = schema.description;
        schemaName = schema.title;
        schemaDescription = schema.description;

        Object.keys(schema.properties).forEach((prop) => {
            addProperty(
                new Property({
                    name: prop,
                    ...schema.properties[prop],
                    isRequired:
                        schema.required && schema.required.includes(prop),
                })
            );
        });
        if (schema.references) {
            schema.references.forEach((ref) => {
                addReference(new Reference(ref));
            });
        }
    }
}

function editSchema(schema) {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', '/schemas', true);
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                window.location.href = '/schemas.html';
            } else {
                alert('Não foi possivel criar o novo schema');
            }
        }
    };
    xhr.send(JSON.stringify({ schema }));
}

// - - - - - - - - - - -
// Generate page
// - - - - - - - - - - -

function generate() {
    $('#generateModal').modal();
    const modalTitle = document.getElementById('generateModalTitle');
    const modalBody = document.getElementById('generateModalBody');
    const modalBodyLoading = document.getElementById(
        'generateModalBodyLoading'
    );
    modalTitle.textContent = 'A gerar website...';
    modalBody.style.display = 'none';
    modalBodyLoading.style.display = 'block';

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/generate', true);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                modalTitle.textContent = 'Gerado com sucesso!';
                modalBodyLoading.style.display = 'none';
                modalBody.style.display = 'block';
            } else {
                modalTitle.textContent = 'Não foi possivel publicar o website';
            }
        }
    };
    xhr.send();
}

// - - - - - - - - - - -
// Loading of pages
// - - - - - - - - - - -

window.onload = () => {
    switch (window.location.pathname) {
        case '/schemas.html':
            loadExistingSchemas(true);
            break;
        case '/editor.html':
            const submitBtn = document.getElementById('submitBtn');
            if (window.location.search) {
                submitBtn.textContent = 'Edit schema';
                submitBtn.onclick = () => {
                    validateSchema(false);
                };
                document.getElementById('modelName').disabled = true;
                const urlParams = new URLSearchParams(window.location.search);
                loadExistingSchemas(false, urlParams.get('schema'));
            } else {
                submitBtn.textContent = 'Create schema';
                submitBtn.onclick = () => {
                    validateSchema(true);
                };
                loadExistingSchemas(false);
            }
            renderPreview();
            break;
    }
};

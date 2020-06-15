schemaName = '';
schemaDescription = '';
properties = [];
references = [];

existingSchemas = [];

// - - - - - - - - - - -
// Existing schemas
// - - - - - - - - - - -

function loadExistingSchemas(render) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
            existingSchemas = xhr.response;
            if (render) renderExistingSchemas();
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
        return schema.references.map(
            (reference) =>
                `<p class="card-text"> ${reference.model} - (${reference.relation}) </p>`
        );
    }

    return 'No references';
}

function renderExistingSchemas() {
    const schemasHTML = existingSchemas.map(
        (schema) =>
            `
        <div class="col-12">
            <div class="card text-white bg-dark mb-3">
                <div class="card-header">
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
    schemasContainer.innerHTML = schemasHTML;
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

    constructor() {
        this.id = Property.count;
        this.name = `prop-${Property.count++}`;
        this.description = undefined;
        this.label = undefined;
        this.type = 'string';
        this.isRequired = false;
        this.isUnique = false;
        this.pattern = undefined;
        this.maximum = undefined;
        this.minimum = undefined;
    }

    toJSON() {
        let {
            description,
            label,
            type,
            isUnique,
            pattern,
            maximum,
            minimum,
        } = this;
        return {
            description,
            label,
            type,
            isUnique,
            pattern,
            maximum,
            minimum,
        };
    }

    render() {
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
            <input type="text" class="form-control" value="prop-${this.id}" id="prop-name-${this.id}" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="prop-description-${this.id}" class="col-sm-3 col-form-label">
            Description
          </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="prop-description-${this.id}" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="prop-label-${this.id}" class="col-sm-3 col-form-label">
            Label name (in details)
          </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="prop-label-${this.id}" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row">
          <label for="prop-type-${this.id}" class="col-sm-3 col-form-label">
            Type
          </label>
          <div class="col-sm-9">
            <select class="form-control" id="prop-type-${this.id}" onchange="updatePropertyValue(this)">
              <option value="string">String</option>
              <option value="integer">Integer</option>
              <option value="boolean">Boolean</option>
            </select>
          </div>
        </div>
        <div class="form-group row">
          <label for="prop-pattern-${this.id}" class="col-sm-3 col-form-label">
            Pattern
          </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="prop-pattern-${this.id}" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row" style="display: none">
          <label for="prop-maximum-${this.id}" class="col-sm-3 col-form-label">
            Maximum
          </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="prop-maximum-${this.id}" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-group row" style="display: none">
          <label for="prop-minimum-${this.id}" class="col-sm-3 col-form-label">
            Minimum
          </label>
          <div class="col-sm-9">
            <input type="text" class="form-control" id="prop-minimum-${this.id}" onkeyup="updatePropertyValue(this)"/>
          </div>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="prop-isRequired-${this.id}"
            onchange="updatePropertyValue(this)"
          />
          <label class="form-check-label" for="prop-isRequired-${this.id}">
            Required property
          </label>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="prop-isUnique-${this.id}"
            onchange="updatePropertyValue(this)"
          />
          <label class="form-check-label" for="prop-isUnique-${this.id}">
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

function addProperty() {
    const newProp = new Property();
    properties.push(newProp);

    const propertiesContainer = document.getElementById('properties');
    propertiesContainer.insertAdjacentHTML('beforeend', newProp.render());

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
    const propPatternHTML = document.getElementById(
        `prop-pattern-${property.id}`
    );
    const propMinHTML = document.getElementById(`prop-minimum-${property.id}`);
    const propMaxHTML = document.getElementById(`prop-maximum-${property.id}`);
    switch (type) {
        case 'string':
            property.maximum = undefined;
            property.minimum = undefined;
            propPatternHTML.parentNode.parentNode.style.display = 'flex';
            propMaxHTML.parentNode.parentNode.style.display = 'none';
            propMinHTML.parentNode.parentNode.style.display = 'none';
            propMaxHTML.value = '';
            propMinHTML.value = '';
            break;
        case 'integer':
            property.pattern = undefined;
            propPatternHTML.parentNode.parentNode.style.display = 'none';
            propMaxHTML.parentNode.parentNode.style.display = 'flex';
            propMinHTML.parentNode.parentNode.style.display = 'flex';
            propPatternHTML.value = '';
            break;
        case 'boolean':
            property.pattern = undefined;
            property.maximum = undefined;
            property.minimum = undefined;
            propPatternHTML.parentNode.parentNode.style.display = 'none';
            propMaxHTML.parentNode.parentNode.style.display = 'none';
            propMinHTML.parentNode.parentNode.style.display = 'none';
            propPatternHTML.value = '';
            propMaxHTML.value = '';
            propMinHTML.value = '';
            break;
    }
}

// - - - - - - - - - - -
// References
// - - - - - - - - - - -

function renderExistingSchemasNames() {
    return existingSchemas.map(
        (schema) => `<option value="${schema.title}">${schema.title}</option>`
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

    constructor() {
        this.id = Reference.count++;
        this.model = existingSchemas[0].title;
        this.relation = '1-1';
        this.label = Object.values(
            existingSchemas[0].properties
        )[0].description;
        this.isRequired = false;
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
              ${renderExistingSchemasNames()}
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
              <option value="1-1">1-1</option>
              <option value="1-M">1-M</option>
              <option value="M-M">M-M</option>
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
                ${renderDefaultLabels()}
            </select>
          </div>
        </div>
        <div class="form-check form-check-inline">
          <input
            class="form-check-input"
            type="checkbox"
            id="ref-isRequired-${this.id}"
            onchange="updateReferenceValue(this)"
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

function addReference() {
    const newRef = new Reference();
    references.push(newRef);

    const referencesContainer = document.getElementById('references');
    referencesContainer.insertAdjacentHTML('beforeend', newRef.render());

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
        handleModelChange(refId, element.value);
    }
    reference[refField] =
        element.type === 'checkbox' ? element.checked : element.value;

    renderPreview();
}

function handleModelChange(refId, value) {
    const refLabels = document.getElementById(`ref-label-${refId}`);
    refLabels.innerHTML = Object.values(
        getExistingSchema(value).properties
    ).map(
        (prop) =>
            `<option value="${prop.description}">${prop.description}</option>`
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
    for (var i = 0; i < properties.length; i++) {
        preview[properties[i].name] = properties[i].toJSON();
        if (properties[i].isRequired) {
            requiredProperties.push(properties[i].name);
        }
    }
    if (requiredProperties.length) {
        preview.required = requiredProperties;
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

function validateSchema() {
    let schema = {};

    // Model info
    if (!schemaName || schemaName === '') {
        $('.toast').toast('show');
        alert('Schema must have a name');
        return;
    }
    if (existingSchemas.map((schema) => schema.title).includes(schemaName)) {
        $('.toast').toast('show');
        alert('Schema with this name already exists');
        return;
    }
    schema.title = schemaName;
    schema.description = schemaDescription;

    // Properties
    let requiredProperties = [];
    let mapDuplicates = {};
    for (var i = 0; i < properties.length; i++) {
        if (properties[i].name === '') {
            $('.toast').toast('show');
            alert('All properties must have a name');
            return;
        }
        if (mapDuplicates[properties[i].name]) {
            $('.toast').toast('show');
            alert('Cannot have properties with the same name');
            return;
        }
        mapDuplicates[properties[i].name] = true;

        schema[properties[i].name] = properties[i].toJSON();
        if (properties[i].isRequired) {
            requiredProperties.push(properties[i].name);
        }
    }
    if (requiredProperties.length) {
        schema.required = requiredProperties;
    }

    // References
    for (var i = 0; i < references.length; i++) {
        schema.references = references;
    }

    $('.toast').toast('show');
    alert('Schema created');
    // createSchema(schema);
}

function createSchema(schema) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status == 200) {
                alert('Novo schema criado com sucesso');
            } else {
                alert('Não foi possivel criar o novo schema');
            }
        }
    };
    xhr.open('POST', '/schemas');
    xhr.send(schema);
}

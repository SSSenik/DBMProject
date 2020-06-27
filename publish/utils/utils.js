function presentationModeToHtmlString(mode, value, type) {
    switch (mode) {
        case 'image':
            return (
                value &&
                `<br><img width="345" src='${value}' alt='an image' class='img-thumbnail img-fluid rounded mx-auto d-block'>`
            );
        case 'video':
            return (
                value &&
                `
                <br>
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" width="345" src="${value}">
                    </iframe>
                </div>
            `
            );
        default:
            switch (type) {
                case 'boolean':
                    return `<input disabled class="position-static" type="checkbox" checked="${value}">`;
                case 'color':
                    return `<label style="background-color: ${value};">${value}</label>`;
                case 'range':
                    return `<label>${value}%</label>`;
                case 'time':
                    return `<label>${new Date(
                        new Date().toLocaleDateString() + ` ${value}`
                    ).toLocaleTimeString()}</label>`;
                case 'date':
                    return `<label>${new Date(
                        value
                    ).toLocaleDateString()}</label>`;
                case 'datetime':
                    return `<label>${new Date(value).toLocaleString()}</label>`;
                default:
                    return `<label>${value}</label>`;
            }
    }
}

function schemaTypeToInputType(type) {
    switch (type) {
        case 'string':
            return 'text';
        case 'boolean':
            return 'checkbox';
        case 'integer':
            return 'number';
        case 'datetime':
            return 'datetime-local';
        default:
            return type;
    }
}

function columnConstraintToHtmlAttrs(column) {
    let attrs = [];
    Object.keys(column).forEach((prop) => {
        switch (prop) {
            case 'maxLength':
                attrs.push({
                    name: 'maxlength',
                    value: column[prop],
                });
                break;
            case 'maximum':
                attrs.push({
                    name: 'max',
                    value: column[prop],
                });
                break;
            case 'minimum':
                attrs.push({
                    name: 'min',
                    value: column[prop],
                });
                break;
            case 'pattern':
                attrs.push({
                    name: 'pattern',
                    value: column[prop],
                });
                break;
            default:
                break;
        }
    });
    return attrs;
}

module.exports = {
    presentationModeToHtmlString,
    columnConstraintToHtmlAttrs,
    schemaTypeToInputType,
};

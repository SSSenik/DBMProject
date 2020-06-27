function presentationModeToHtmlString(mode, value) {
    if (!value) return '<label></label>';
    switch (mode) {
        case 'image':
            return `<br><img height="345" src='${value}' alt='an image'>`;
        case 'video':
            return `
                <br>
                <iframe width="420" height="345" src="${value}">
                </iframe>
            `;
        default:
            return `<label>${value}</label>`;
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

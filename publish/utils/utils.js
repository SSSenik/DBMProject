function presentationModeToHtmlType(mode, type) {
    switch (mode) {
        case 'image':
        case 'video':
            return 'url';
        default:
            if (mode) return mode;
            switch (type) {
                case 'string':
                    return 'text';
                case 'integer':
                    return 'number';
                case 'boolean':
                    return 'checkbox';
                default:
                    return 'string';
            }
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
    presentationModeToHtmlType,
    columnConstraintToHtmlAttrs,
};

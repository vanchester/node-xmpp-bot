var Entities = require('html-entities').XmlEntities,
    entities = new Entities();

exports.entdec = {
    name: 'entdec',
    group: 'String operations',
    about: 'Decode HTML entities',
    help: 'entdec <TEXT>',
    enabled: 1,
    aliases: ['entdecode', 'entitiesdecode', 'entitiesdec'],
    run: function(params) {
        if (!params[0]) {
            return this.help;
        }

        text = params.join(' ');
        return entities.decode(text);
    }
};

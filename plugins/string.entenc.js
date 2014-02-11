var Entities = require('html-entities').XmlEntities,
    entities = new Entities();

exports.entenc = {
    name: 'entenc',
    group: 'String operations',
    about: 'Encode HTML entities',
    help: 'entenc <TEXT>',
    enabled: 1,
    aliases: ['entencode', 'entitiesencode', 'entitiesenc'],
    run: function(params) {
        if (!params[0]) {
            return this.help;
        }

        text = params.join(' ');
        return entities.encode(text);
    }
};

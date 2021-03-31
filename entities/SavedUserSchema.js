const EntitySchema = require('typeorm').EntitySchema;
const SavedUser = require('../models/SavedUser');

module.exports = new EntitySchema({
    name: 'SavedUser',
    tableName: 'saved_users',
    target: SavedUser,
    columns: {
        uuid: {
            primary: true,
            unique: true,
            type: 'varchar',
            generated: false
        },
        auth_token: {
            type: 'varchar',
            nullable: true
        },
        refresh_token: {
            type: 'varchar',
            nullable: true
        },
        email: {
            type: 'varchar',
            nullable: true
        }
    }
});

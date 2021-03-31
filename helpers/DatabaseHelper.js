const typeorm = require('typeorm');
const conn = typeorm.createConnection();

exports.getConnection = async () => {
    return await conn;
};

exports.getRepository = async (entity) => {
    return (await conn).getRepository(entity);
}

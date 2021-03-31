module.exports = {
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "easyfees",
  password: "easyfees123",
  database: "easyfees",
  entities: [
    require('./entities/SavedUserSchema')
  ],
  synchronize: true
}

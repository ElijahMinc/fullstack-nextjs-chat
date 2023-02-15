module.exports = class UserDto {
  constructor(model) {
    this.email = model.email;
    this.name = model.name;
    this.surname = model.surname;
    this._id = model._id;
  }
};

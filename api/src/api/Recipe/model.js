var PHOTO_URI = "/recipe/";

var CATEGORIES = require("./categories.json");

module.exports = {

  connection: "default",
  identity: "recipe",

  attributes: {
    name: {
      type: "string",
      required: true
    },
    tags: "array",
    photo: {
      model: "upload",
      unique: true
    },
    user: {
      model: 'user'
    },
    description: "text",
    category: {
      type: "string",
      enum: _.pluck(CATEGORIES, "value"),
      defaultsTo: "other",
      required: true
    },
    servings: {
      type: "integer",
      required: true
    },
    preparation_time: {
      type: "integer",
      required: true
    },
    cooking_time: {
      type: "integer",
      required: true
    },
    ingredients: {
      collection: 'recipe_ingredient',
      via: 'recipe'
    },
    comments: {
      collection: "recipe_comment",
      via: "recipe"
    },
    rate: {
      type: "float",
      defaultsTo: 0
    },
    nb_rates: {
      type: "integer",
      defaultsTo: 0
    },
    directions: "array",

    toJSON: function() {
      var obj = this.toObject();
      if (obj.photo && obj.photo.uri && !obj.photo_url) obj.photo_url = obj.photo.uri();
      return obj;
    }
  },

  afterDestroy: function(ings, next) {
    var tmp = _(ings);
    Upload.destroy({id: tmp.pluck('photo').value()}).then(function() {
      return RecipeComment.destroy({id: tmp.pluck("comments").flatten().value()});
    }).then(function() {
      return RecipeIngredient.destroy({id: tmp.pluck("ingredients").flatten().value()});
    }).then(function() {
      next();
    }, next);
  },

  toPopulate: ["photo", "ingredients", "user"],

  CATEGORIES: CATEGORIES,
  PHOTO_URI: PHOTO_URI,
};

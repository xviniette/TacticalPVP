var vue;

$(function () {

    var requests = {
        users: {
            self: function (callback) {
                $.get("/users", function (data) {
                    callback(data);
                });
            },
            get: function (login, callback) {
                $.get("/users/" + login, function (data) {
                    callback(data);
                });
            }
        },
        items: {
            get: function (id, callback) {
                $.get("/items/" + id, function (data) {
                    callback(data);
                });
            },
            all: function (callback) {
                $.get("/items", function (data) {
                    callback(data);
                });
            },
            self: function (callback) {
                $.get("/items/user", function (data) {
                    callback(data);
                });
            },
            equip: function (id, callback) {
                $.get("/items/equip/" + id, function (data) {
                    callback(data);
                });
            },
            unequip: function (id, callback) {
                $.get("/items/unequip/" + id, function (data) {
                    callback(data);
                });
            }
        },
        spells: {
            get: function (id, callback) {
                $.get("/spells/" + id, function (data) {
                    callback(data);
                });
            },
            all: function (callback) {
                $.get("/spells", function (data) {
                    callback(data);
                });
            },
            self: function (callback) {
                $.get("/spells/user", function (data) {
                    callback(data);
                });
            },
            equip: function (id, callback) {
                $.get("/spells/equip/" + id, function (data) {
                    callback(data);
                });
            },
            unequip: function (id, callback) {
                $.get("/spells/unequip/" + id, function (data) {
                    callback(data);
                });
            }
        },
        drop: function (type, callback) {
            $.get("/drop/" + type, function (data) {
                callback(data);
            });
        }
    }


    vue = new Vue({
        el: "#app",
        data: {
            self: null,
            items: {
                CHARACTERISTICS: CHARACTERISTICS,
                maxlevel: MAX_ITEMS_LEVEL,
                self: [],
            },
            spells: {
                maxlevel: MAX_SPELLS_LEVEL,
                self: [],
            },
            drop: {
                DROP_GOLDS: DROP_GOLDS,
                DROP_GEMS: DROP_GEMS
            }
        },
        computed: {
            itemsLevel: function () {
                var lvl = 0;
                for (var item of this.items.self) {
                    if (item.equiped == 1) {
                        lvl += item.level;
                    }
                }
                return lvl;
            },
            spellsLevel: function () {
                var lvl = 0;
                for (var spell of this.spells.self) {
                    if (spell.equiped == 1) {
                        lvl += spell.level;
                    }
                }
                return lvl;
            },
            characteristics: function () {
                var caracs = JSON.parse(JSON.stringify(CHARACTERISTICS));

                for (var i in DEFAULT_CHARACTERISTICS) {
                    caracs[i] += DEFAULT_CHARACTERISTICS[i];
                }

                for (var item of this.items.self) {
                    if (item.equiped == 1) {
                        for (var i in item) {
                            if (caracs[i] != undefined) {
                                caracs[i] += item[i];
                            }
                        }
                    }
                }
                return caracs;
            }
        },
        methods: {
            equipItem: function (index) {
                var _this = this;
                requests.items.equip(this.items.self[index].id_i, function (data) {
                    if (!data.error) {
                        _this.items.self[index].equiped = 1;
                    }
                });
            },
            unequipItem: function (index) {
                var _this = this;
                requests.items.unequip(this.items.self[index].id_i, function (data) {
                    if (!data.error) {
                        _this.items.self[index].equiped = 0;
                    }
                });
            },
            equipSpell: function (index) {
                var _this = this;
                requests.spells.equip(this.spells.self[index].id_s, function (data) {
                    if (!data.error) {
                        _this.spells.self[index].equiped = 1;
                    }
                });
            },
            unequipSpell: function (index) {
                var _this = this;
                requests.spells.unequip(this.spells.self[index].id_s, function (data) {
                    if (!data.error) {
                        _this.spells.self[index].equiped = 0;
                    }
                });
            },
            dropping: function (type) {
                var _this = this;
                requests.drop(type, function (data) {
                    if (!data.error) {
                        requests.users.self(function (data) {
                            _this.self = data;
                        });

                        requests.items.self(function (data) {
                            _this.items.self = data;
                        });

                        requests.spells.self(function (data) {
                            _this.spells.self = data;
                        });
                    }
                });
            }
        },
        ready: function () {
            var _this = this;
            requests.users.self(function (data) {
                _this.self = data;
            });

            requests.items.self(function (data) {
                _this.items.self = data;
            });

            requests.spells.self(function (data) {
                _this.spells.self = data;
            });
        }
    });
});
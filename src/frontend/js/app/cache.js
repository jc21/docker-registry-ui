'use strict';

const RepoModel = require('../models/repo');

let cache = {
    Config: {},
    Repos:  new RepoModel.Collection(),
    Repo:   {}
};

module.exports = cache;


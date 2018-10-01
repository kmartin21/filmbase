const User = require('../models/user.model')
const movieController = require('./movie.controller')
const mongoose = require('mongoose')

exports.userCreate = (req, res) => {
    const user = new User({
        name: req.body.name,
        username: req.body.username
    })
    
    User.findOne({username: `${user.username}`}, function(err, result) {
        if (err) { 
            res.status(415).json({ error: `${err.message}` })
        }

        if (!result) {
            user.save((err, user) => {
                if (err) {
                    res.status(415).json({ error: `${err.message}` })
                }
                res.status(201).json({ userId: `${user._id}`, favoriteMovies: `${user.favoriteMovies}` })
            })
        } else {
            res.json({ userId: `${result._id}`, favoriteMovies: `${result.favoriteMovies}` })
        }
    })
}

exports.favoriteMovie = (req, res) => {
    const movieId = parseInt(req.params.id)
    const saveMoviePromise = movieController.saveMovieIfDoesNotExist(movieId, req.body)
    
    saveMoviePromise.then(() => {
        User.findOne({_id: mongoose.Types.ObjectId(req.params.userId)}, function(err, user) {
            if (err) res.status(415).json({ error: `${err.message}` })
            if (!user.favoriteMovies.find(movie => movie.movieId === movieId)) {
                const favMovie = {
                    movieId: movieId,
                    opinion: "Great movie"
                }
                User.findOneAndUpdate(req.params.userId,
                    {"$push": { "favoriteMovies": favMovie }},
                    {"new": true, upsert: true },
                    function (err, user) {
                        console.log("ERR: ", err.message)
                        if (err) res.status(415).json({ error: `${err.message}` })
                        else res.json({ msg: "Favorited movie successfully", favoriteMovies: `${user.favoriteMovies}`})
                    }
                )
            }
        })
    })
    .catch(err => res.status(415).json({ error: `${err.message}` }))
}

exports.unfavoriteMovie = (req, res) => {
    const movieId = parseInt(req.params.id)

    User.findOne({_id: mongoose.Types.ObjectId(req.params.userId)}, function(err, user) {
        if (err) res.status(415).json({ error: `${err.message}` })
        
        const index = user.favoriteMovies.indexOf(movieId)
        if (index != -1) {
            user.favoriteMovies.splice(index, 1)
            user.save((err, user) => {
                if (err) {
                    res.status(415).json({ error: `${err.message}` })
                }
                res.status(201).json({ msg: 'Successfully deleted favorited movie', favoriteMovies: `${user.favoriteMovies}` })
            })
        }
    })
}







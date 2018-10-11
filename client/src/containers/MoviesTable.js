import React, {Component} from 'react'
import Movie from '.././components/Movie'

class MoviesTable extends Component {

    constructor(props) {
        super(props)
    }

    createMovieItems() {
        const {fromSearch, moviesData} = this.props
        var finalMoviesData = fromSearch ? moviesData : moviesData.slice(0).reverse()
        return finalMoviesData.map((movieData) => {
            const movie = movieData.movie ? movieData.movie : movieData
            const title = movie.title
            const description = movie.overview ? movie.overview : movie.description
            const imageUrl = movie.image_url ? movie.image_url : movie.poster_path
            const id = movie.movieId ? movie.movieId : movie.id.toString()
            const user = !fromSearch && movieData.user ? {
                _id: movieData.user._id,
                name: movieData.user.name
            } : null

            return <li>
                <Movie id={id} user={user} title={title} description={description} imageUrl={imageUrl} />
            </li>
        })
    }

    render() {
        const movieItems = this.createMovieItems()

        return (
            <div>
                <ul>
                    {movieItems}
                </ul>
            </div>
        )
    }
}

export default MoviesTable
import React, {Component} from 'react'
import SearchBar from './SearchBar'
import MoviesTable from '../containers/MoviesTable'
import fetch from 'cross-fetch'
import auth0Client from '../oauth/Auth'

class HomePage extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isRecents: false,
            moviesData: []
        }
    }

    componentDidMount() {
        fetch(`http://localhost:7001/recent-favorites`, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(json => this.setState({ isRecents: true, moviesData: json.recentFavorites }))
        .catch(error => alert(`ERROR: ${error}`))
    }

    searchResults = (moviesData) => {
        this.setState({ isRecents: false, moviesData })
    }

    render() {
        var moviesData = this.state.moviesData
        
        if (this.state.isRecents && auth0Client.isAuthenticated()) {
            moviesData = this.state.moviesData.filter(movie => movie.user._id !== localStorage.getItem('userId'))
            debugger
        }
        return (
            <div>
                <SearchBar searchResults={this.searchResults}/>
                <h6><strong>Recently favorited by others</strong></h6>
                <MoviesTable isRecents={this.state.isRecents} moviesData={moviesData}/>
            </div>
        )
    }
}

export default HomePage
    

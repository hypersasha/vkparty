import React, {Component} from 'react';
import {List, Search, Group, Cell, Button, Link, Header, PopoutWrapper, Div, Footer} from "@vkontakte/vkui/src";
import Icon24Flash from '@vkontakte/icons/dist/24/flash';

import axios from 'axios';
import {declOfNum, SERVER_URL} from "../../../lib/Utils";
import Avatar from "../../Avatar/Avatar";
import '../../../lib/CustomEvent';
import Counter from "@vkontakte/vkui/src/components/Counter/Counter";

class PartyFilms extends Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            searchResult: [],
            popout: null,
            pickedMovie: null,
            userEditing: false
        };
        this.searchCooldown = 400;
        this.searchTimeout = null;

        this.onChange = this.onChange.bind(this);
        this.onSearchClose = this.onSearchClose.bind(this);
        this.onAddMovie = this.onAddMovie.bind(this);
        this.onStartEditing = this.onStartEditing.bind(this);
        this.AddMovie = this.AddMovie.bind(this);
        this.RemoveMovie = this.RemoveMovie.bind(this);

        window.addEventListener('AddMovieConfirmed', this.AddMovie);
    }


    /**
     * Triggers when search request changes.
     * @param search
     */
    onChange(search) {
        clearInterval(this.searchTimeout);
        if (search.trim().length > 2) {
            this.searchTimeout = setTimeout(() => {
                axios.get(SERVER_URL + '/search', {
                    params: {
                        query: search.trim()
                    }
                }).then((response) => {
                    console.log(response);
                    if (response.data && response.data.isOK && response.data.data) {
                        this.setState({
                            searchResult: response.data.data
                        });
                    }
                }).catch(e => {

                });
            }, this.searchCooldown);
        }
        if (search.trim().length === 0) {
            this.setState({search: search, searchResult: []});
        } else {
            this.setState({search});
        }
    }

    onSearchClose() {
        if (this.state.search.length === 0) {
            this.setState({
                searchResult: []
            });
        }
    }

    /**
     * Triggers when user press Add in movie tab.
     * @param mid
     */
    onAddMovie(mid) {
        if (this.props.userId >= 0 && this.props.partyId) {
            let evt = new CustomEvent('showAddMovieAlert', {
                detail: mid
            });
            window.dispatchEvent(evt);
        }
    }

    /**
     * Adds new movie to party. Calls server method.
     * @param e
     * @constructor
     */
    AddMovie(e) {
        let mid = e.detail;
        this.props.onShowScreenSpinner();
        axios.post(SERVER_URL + '/movie', {
            user_id: this.props.userId,
            pid: this.props.partyId,
            mid: mid
        }).then((response) => {
            if (response) {
                if (response.data.isOK || !response.data.isOK) {
                    this.setState({
                        searchResult: [],
                        search: ''
                    }, () => {
                        if (this.props.onFilmAdded && typeof this.props.onFilmAdded === 'function') {
                            this.props.onFilmAdded();
                        }
                    });
                }
            }
        }).catch(err => {
            if (err && err.response) {
                let evt;
                switch (err.response.status) {
                    case 403:
                        evt = new CustomEvent('showErrorAlert', {
                            detail: 'Вы уже добавили доступное количество фильмов.'
                        });
                        window.dispatchEvent(evt);
                        break;
                    case 409:
                        evt = new CustomEvent('showErrorAlert', {
                            detail: 'Этот фильм уже есть в списке.'
                        });
                        window.dispatchEvent(evt);
                        break;
                    default:
                        evt = new CustomEvent('showErrorAlert', {
                            detail: 'Не удалось добавить фильм.'
                        });
                        window.dispatchEvent(evt);
                }
            }
        });
    }

    /**
     * Removes movie from party. Calls server method.
     * Admins only.
     * @param mid
     * @constructor
     */
    RemoveMovie(mid) {
        if (this.props.onRemoveMovie && typeof this.props.onRemoveMovie === 'function') {
            this.props.onRemoveMovie(mid);
        }
        axios.delete(SERVER_URL + '/movie', {
            params: {
                pid: this.props.partyId,
                mid: mid
            }
        }).then((response) => {
            console.log(response);
            if (response) {
                if (response.data.isOK) {
                    // Do something.
                    if (this.props.onFilmAdded && typeof this.props.onFilmAdded === 'function') {
                        this.props.onFilmAdded();
                    }
                }
            }
        }).catch(err => {
            console.log(err);
        });
    }

    /**
     * Triggers, when user press Edit in movies section.
     */
    onStartEditing() {
        this.setState(prevState => ({
            userEditing: !prevState.userEditing
        }));
    }

    componentWillUnmount() {
        window.removeEventListener('AddMovieConfirmed', this.AddMovie);
    }

    render() {

        let searchResults = this.state.searchResult.map((movie) => {
            return <Cell
                multiline={true}
                size={"l"}
                key={movie.mid}
                description={movie.release + " г. Рейтинг: " + movie.score}
                before={<Avatar image={movie.poster_url} size={72} radius={"6px"} className={'rave-movie-avatar'}/>}
                bottomContent={
                    <Button size={"m"}
                            onClick={() => {this.onAddMovie(movie.mid)}}
                            level={"secondary"}>
                        Добавить
                    </Button>}>
                {movie.title}
            </Cell>
        });


        let moviesToWatch = [];
        let userMovies = [];
        if (this.props.movies) {

            userMovies = this.props.movies.filter((partyMovie) => {
                return (partyMovie.user.user_id === this.props.userId);
            });

            moviesToWatch = this.props.movies.filter((partyMovie) => {
                return (partyMovie.user.user_id !== this.props.userId);
            });

            userMovies = userMovies.map((partyMovie) => {
                return <Cell
                    multiline={true}
                    removable={this.state.userEditing}
                    onRemove={() => { this.RemoveMovie(partyMovie.movie.mid) }}
                    size={"l"}
                    key={partyMovie.movie.mid}
                    description={partyMovie.movie.release + " г. Рейтинг: " + partyMovie.movie.score}
                    before={<Avatar image={partyMovie.movie.poster_url} size={72} radius={"6px"} className={'rave-movie-avatar'}/>}
                    bottomContent={
                        <div className="party-movie">
                            <div className="party-movie--owner">
                                <Avatar size={24} image={partyMovie.user.photo}/>
                                <p>{partyMovie.user.first_name + ' ' + partyMovie.user.last_name}</p>
                            </div>
                        </div>}>
                    {partyMovie.movie.title}
                </Cell>
            });

            moviesToWatch = moviesToWatch.map((partyMovie) => {
                return <Cell
                    multiline={true}
                    removable={this.state.userEditing && this.props.isOwner}
                    onRemove={() => { this.RemoveMovie(partyMovie.movie.mid) }}
                    size={"l"}
                    key={partyMovie.movie.mid}
                    description={partyMovie.movie.release + " г. Рейтинг: " + partyMovie.movie.score}
                    before={<Avatar image={partyMovie.movie.poster_url} size={72} radius={"6px"} className={'rave-movie-avatar'}/>}
                    bottomContent={
                        <div className="party-movie">
                            <div className="party-movie--owner">
                                <Avatar size={24} image={partyMovie.user.photo}/>
                                <p>{partyMovie.user.first_name + ' ' + partyMovie.user.last_name}</p>
                            </div>
                        </div>}>
                    {partyMovie.movie.title}
                </Cell>
            });
        }

        return (<div id="movie-search" style={{paddingTop: 50}}>
            <Search value={this.state.search} theme={"default"} placeholder={"Добавить фильм"}
                    onChange={this.onChange}/>
            {this.state.searchResult.length > 0 ?
                <Group title={"Результаты поиска"} style={{marginTop: 0}}>
                    <List>
                        {searchResults}
                    </List>
                </Group> : ''
            }
            {moviesToWatch.length > 0 || userMovies.length > 0 ?
                <Group
                    style={{marginTop: 0}}
                    title={<div style={{display: 'flex', alignItems: 'center'}}><Icon24Flash /><span>Битва фильмов</span></div>}>
                    <Div style={{paddingTop: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <p style={{marginTop: 0, fontSize: '0.9em', lineHeight: '1.2em'}}>
                            Для каждого фильма подбрасывается монетка. Если выпадает <b>«Решка!»</b>, картина проигрывает и покидает битву. Победителем становится фильм, переживший все подбросы монетки.
                        </p>
                        <Button size={"xl"}
                                after={<Counter>{moviesToWatch.length + userMovies.length}</Counter>}
                                onClick={() => {this.props.onGenerateFilm(this.props.movies);}}>
                            Начать битву
                        </Button>
                    </Div>
                </Group>
                :
                ''
            }
            {userMovies.length > 0 ?
                <Group style={{marginTop: 0}}
                       description={(!this.props.isOwner ?
                           `${userMovies.length < this.props.maxMovies ? 
                               `Вы можете добавить ещё ${this.props.maxMovies - userMovies.length} ${declOfNum(this.props.maxMovies - userMovies.length, ['фильм', 'фильма', 'фильмов'])}`  
                               : `Вы добавили все ${this.props.maxMovies} ${declOfNum(this.props.maxMovies, ['фильм', 'фильма', 'фильмов'])}`}`
                           : '')}>
                    <Header level="2" aside={
                        <Link onClick={this.onStartEditing}>{this.state.userEditing ? 'Готово' : 'Изменить'}</Link>
                    }>добавленные мной</Header>
                    <List>
                        {userMovies}
                    </List>
                </Group>
                :
                <Group title={"добавленные мной"}>
                    <Div style={{paddingTop: 0}}>
                        <p style={{marginTop: 0, fontSize: '0.9em', lineHeight: '1.2em'}}>
                            Воспользуйтесь поиском, чтобы добавить свои фильмы, которые примут участие в Битве Фильмов.
                        </p>
                    </Div>
                </Group>
            }
            {moviesToWatch.length > 0 ?
                <Group title={"Добавленные друзьями"} style={{marginTop: 0}}>
                    <List>
                        {moviesToWatch}
                    </List>
                </Group> : '' }
            <Footer>{`${moviesToWatch.length + userMovies.length} ${declOfNum(moviesToWatch.length + userMovies.length, ['фильм', 'фильма', 'фильмов'])}`}</Footer>
        </div>)
    }
}

export default PartyFilms;
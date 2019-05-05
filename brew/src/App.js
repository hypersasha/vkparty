import React, {Component} from 'react';
import {
    Root,
    View,
    Panel,
    Div,
    FormStatus,
    Alert,
    ScreenSpinner,
    PopoutWrapper,
    Gallery,
    HorizontalScroll, Button, ConfigProvider
} from "@vkontakte/vkui/src";

import {platform, IOS} from './lib/platform';
import HomeScreen from "./components/Views/HomeScreen/HomeScreen";
import AddParty from "./components/Views/NewParty/AddParty";
import Party from "./components/Views/Party/Party";
import './lib/CustomEvent';

import connect from '@vkontakte/vkui-connect';
import axios from "axios";
import {SERVER_URL} from "./lib/Utils";

import Icon24Favorite from '@vkontakte/icons/dist/24/favorite';
import Icon24ThumbDown from '@vkontakte/icons/dist/24/thumb_down';
import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

const osname = platform();

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeView: 'homeScreen',
            activePanel: 'raves',
            futureParties: [],
            loadingParties: false,
            loadingPartiesFailed: false,
            popout: null,
            opens: 0,
            generatorTime: 0,
            posters: [],
            history: ['homeScreen'],
            posterIndex: 0,
            user_id: App.GetVKId() || 28455889, // 19592568, 28455889, 5397033
            user_info: null
        };

        this.OnChangeView = this.OnChangeView.bind(this);
        this.OnChangePanel = this.OnChangePanel.bind(this);
        this.GetParties = this.GetParties.bind(this);
        this.OnAddMovieClosed = this.OnAddMovieClosed.bind(this);
        this.AddMovieConfirmed = this.AddMovieConfirmed.bind(this);
        this.ShowScreenSpinner = this.ShowScreenSpinner.bind(this);
        this.ShowGenerator = this.ShowGenerator.bind(this);
        this.StartMoviesBattle = this.StartMoviesBattle.bind(this);
        this.StopMovieBattle = this.StopMovieBattle.bind(this);
        this.KillMovie = this.KillMovie.bind(this);
        this.OnPartyLeave = this.OnPartyLeave.bind(this);
        this.LeaveParty = this.LeaveParty.bind(this);

        this.generatorChecksTimer = null;

        // This event triggers, when application goes background and foreground.
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === "visible") {
                if (window.location.hash) {
                    this.OnChangePanel("party-info");
                }
                this.setState(prev => ({
                    opens: prev.opens + 1
                }));
            }
        });

        // This event triggers when app need user confirm to add film.
        window.addEventListener('showAddMovieAlert', (e) => {
            if (this.state.activeView === "homeScreen") {
                this.setState({
                    popout: <Alert
                        actionsLayout="vertical"
                        onClose={() => {
                        }}
                        actions={[{
                            title: 'Добавить',
                            autoclose: true,
                            style: 'default',
                            action: () => {
                                this.AddMovieConfirmed(e.detail)
                            }
                        }, {
                            title: 'Отмена',
                            style: 'cancel',
                            action: () => {
                                this.OnAddMovieClosed()
                            }
                        }]}>
                        <h2>Добавить фильм?</h2>
                        <p>Вы уверины, что хотите добавить этот фильм к выбору?</p>
                    </Alert>
                })
            }
        });

        // This event triggers when some screen sends Alert.
        window.addEventListener('showErrorAlert', (e) => {
            this.setState({
                popout: <Alert onClose={() => {
                    this.setState({
                        popout: null
                    })
                }} actions={[{title: 'Закрыть', autoclose: true, style: 'cancel'}]}>
                    <h2>Ошибка</h2>
                    <p>{e.detail}</p>
                </Alert>
            });
        });

        window.addEventListener('showLeavePartyAlert', this.OnPartyLeave);

        // VKWebAppGetUserInfoResult
        connect.subscribe((e) => {
            if (e.detail.type === "VKWebAppGetUserInfoResult") {
                let data = e.detail.data;
                this.setState({
                    user_info: data
                });
            }
        });
    }

    /**
     * Returns vk app user_id returned by VK on application startup.
     * @returns {number} VK user id
     * @constructor
     */
    static GetVKId() {
        let appUrl = new URL(location);
        let user_id = parseInt(appUrl.searchParams.get('vk_user_id'));
        this.GetVKInfo();
        return user_id;
    }

    /**
     * Returns vk app user information: first_name, last_name, photo_200, id.
     * @constructor
     */
    static GetVKInfo() {
        connect.send("VKWebAppGetUserInfo", {});
    }

    /**
     * Changes current active view.
     */
    OnChangeView(view_id) {
        this.setState({
            activeView: view_id
        });

        if (this.state.activeView === "homeScreen") {
            if (window.location.hash) {
                this.OnChangePanel("party-info");
            }
        }
    }

    /**
     * Changes current panel in Active View.
     * @param panel_id id of panel to show.
     * @constructor
     */
    OnChangePanel(panel_id) {
        this.setState({activePanel: panel_id });
    }

    OnAddMovieClosed() {
        this.setState(prevState => ({
            popout: null
        }));
    }

    ShowScreenSpinner(hide) {
        if (!hide) {
            this.setState({
                popout: <ScreenSpinner/>
            });
        } else {
            this.setState({
                popout: null
            });
        }
    }

    AddMovieConfirmed(confirmed_mid) {
        let confirmedEvent = new CustomEvent('AddMovieConfirmed', {
            detail: confirmed_mid
        });
        window.dispatchEvent(confirmedEvent);
    }

    /**
     * Shows movie generator popout.
     * @param movies
     * @constructor
     */
    ShowGenerator(movies) {
        let multipliedMovies = [];

        movies.forEach(movie => {
            multipliedMovies.push({
                mid: movie.movie.mid,
                title: movie.movie.title,
                poster_url: movie.movie.poster_url.replace('/w185/', '/w400/'),
                score: movie.movie.score,
                alive: true,
                winner: false
            });
        });

        // Shuffle movies array.
        function compareRandom(a, b) {
            return Math.random() - 0.5;
        }

        multipliedMovies.sort(compareRandom);

        this.setState({posters: multipliedMovies}, () => {
            // this.StartMoviesBattle();
        });
    }

    /**
     * Starts interval for killing movies.
     * @constructor
     */
    StartMoviesBattle() {
        if (!this.generatorChecksTimer) {
            this.generatorChecksTimer = setInterval(() => {
                this.NextMovie();
            }, 3000);
        }
    }

    /**
     * Stops killer interval and hides generator popout.
     * @constructor
     */
    StopMovieBattle() {
        clearInterval(this.generatorChecksTimer);
        this.generatorChecksTimer = null;
        this.setState({
            posters: [],
            posterIndex: 0
        });
    }

    /**
     * Change current movie in generator view.
     * @constructor
     */
    NextMovie() {
        // We need to remove killed movies.
        if ((this.state.posterIndex + 1) > this.state.posters.length - 1) {
            let alives = this.state.posters.filter(poster => {
                return poster.alive;
            });
            this.setState({
                posters: alives,
                posterIndex: 0
            });
        } else {
            this.setState(prevState => ({
                posterIndex: ((prevState.posterIndex + 1) > prevState.posters.length - 1 ? 0 : prevState.posterIndex + 1)
            }));
        }

        // Generates random time to kill and set timer.
        const randomTime = (Math.floor(Math.random() * (+3 - +1)) + +1) * 1000;
        setTimeout(this.KillMovie, 1500);
    }

    /**
     * Coin flip for current movie.
     * @constructor
     */
    KillMovie() {
        // Check if only 1 staying alive
        let winner = -1;
        let alives = this.state.posters.filter(poster => {
            return poster.alive;
        });

        // If its true, then get winner id.
        if (alives.length === 1) {
            clearInterval(this.generatorChecksTimer);
            winner = this.state.posters.findIndex(poster => {
                return poster.alive;
            });
            const {posters} = this.state;
            posters[winner] = {...posters[winner], winner: true};
            this.setState({
                posterIndex: winner,
                posters: posters
            });
        } else {
            // Get Current poster.
            const {posters} = this.state;
            let x = (Math.floor(Math.random() * 2) == 0);
            if (posters[this.state.posterIndex] && posters[this.state.posterIndex].alive) {
                posters[this.state.posterIndex] = {...posters[this.state.posterIndex], alive: x};
                this.setState(prevState => ({
                    posters: posters
                }));
            }
        }
    }

    /**
     * Returns all user's parties.
     * @constructor
     */
    GetParties() {
        this.setState({
            loadingParties: true
        }, () => {
            console.log('fetching');
            axios.get(SERVER_URL + '/parties', {
                params: {
                    user_id: this.state.user_id
                }
            }).then((response) => {
                console.log(response);
                if (response.data && response.data.isOK) {
                    this.setState({
                        loadingParties: false,
                        loadingPartiesFailed: false,
                        futureParties: response.data.data
                    });
                } else {
                    this.setState({
                        loadingParties: false,
                        loadingPartiesFailed: false,
                        futureParties: []
                    });
                }
            }).catch((err) => {
                this.setState({
                    loadingParties: false,
                    loadingPartiesFailed: true
                });
            });
        });
    }

    /**
     * Shows popout alert, for leave party confirmation.
     * @param e
     * @constructor
     */
    OnPartyLeave(e) {
        this.setState({
            popout: <Alert
                actionsLayout="vertical"
                onClose={() => {
                    this.setState({popout: null})
                }}
                actions={[{
                    title: 'Покинуть',
                    style: 'destructive',
                    action: () => {this.LeaveParty(e.detail)}
                }, {
                    title: 'Отмена',
                    style: 'cancel',
                    action: () => {
                        this.OnAddMovieClosed()
                    }
                }]}>
                <h2>Покинуть событие</h2>
                <p>Вы уверины, что хотите покинуть это событие?</p>
            </Alert>
        });
    }

    /**
     * Triggers after leave party confirmation.
     * @param pid
     * @constructor
     */
    LeaveParty(pid) {
        axios.delete(SERVER_URL + '/guest', {
            params: {
                pid: pid,
                guest_id: this.state.user_id
            }
        }).then((response) => {
            if (response.data.isOK) {
                this.GetParties();
                this.OnChangePanel('raves');
            } else {
                let errorEvt = new CustomEvent('showErrorAlert', {detail: 'Не удалось покинуть событие.'});
                window.dispatchEvent(errorEvt);
            }
        }).catch((error) => {
            let errorEvt = new CustomEvent('showErrorAlert', {detail: 'Не удалось покинуть событие.'});
            window.dispatchEvent(errorEvt);
        });
    }

    componentDidMount() {
        if (this.state.user_id < 0) {
            console.warn("Cannot specify your VK user id. Maybe u r using web browser?");
        } else {
            this.GetParties();
        }

        if (this.state.activeView === "homeScreen") {
            if (window.location.hash) {
                this.OnChangePanel("party-info");
            }
        }
    }

    render() {

        let popout = null;
        if (this.state.posters.length > 0) {
            let posters = this.state.posters.map(movie => {
                return <div className="generator-poster" key={movie.mid + Math.random()}
                            style={{backgroundImage: `url(${movie.poster_url})`}}>
                    <div className={`generator-poster--title ${movie.alive ? '' : 'dead'}`}>{movie.title}</div>
                    {movie.alive ? <div className="generator-poster--score"><Icon24Favorite/>
                            <div>{movie.score}</div>
                        </div>
                        :
                        <div className="generator-poster--dead">РЕШКА!</div>
                    }
                    {movie.winner ? <div className="generator-poster--winner">ОРЁЛ!</div> : ''}
                    <div className="generator-poster--cover"/>
                </div>;
            });
            popout = <PopoutWrapper v={"center"} h={"center"} style={{background: '#000000'}}>
                <Gallery slideWidth={"100%"} style={{height: "100vh", width: "100%"}}
                         slideIndex={this.state.posterIndex}>
                    {posters}
                </Gallery>
                <div className="generator-close" onClick={this.StopMovieBattle}>
                    <Icon24BrowserBack/>
                    <p>Назад к событию</p></div>
                <div className="generator-poster--intro" onAnimationEnd={() => {this.StartMoviesBattle();}}>
                    <p>Битва</p>
                    <p>Фильмов</p>
                </div>
            </PopoutWrapper>
        }

        return (
            <ConfigProvider isWebView={true}>
            <Root activeView={this.state.activeView} popout={popout}>
                    <View id={"homeScreen"}
                          popout={this.state.popout}
                          activePanel={this.state.activePanel}>
                        <HomeScreen
                            id={"raves"}
                            opens={this.state.opens}
                            parties={this.state.futureParties}
                            loading={this.state.loadingParties}
                            loadingFailed={this.state.loadingPartiesFailed}
                            userId={this.state.user_id}
                            onChangeView={this.OnChangeView}
                            onChangePanel={this.OnChangePanel}
                            onUpdateParties={this.GetParties}
                        />
                        <Panel id={"party-info"}>
                            <Party onChangePanel={this.OnChangePanel}
                                   userId={this.state.user_id}
                                   userInfo={this.state.user_info}
                                   onPartyLeave={this.OnPartyLeave}
                                   onGenerateFilm={this.ShowGenerator}
                                   onShowScreenSpinner={this.ShowScreenSpinner}/>
                        </Panel>
                    </View>
                <View id={"newParty"} activePanel={"newParty-form"}>
                    <Panel id={"newParty-form"}>
                        <AddParty onChangeView={this.OnChangeView} userId={this.state.user_id}/>
                    </Panel>
                </View>
            </Root>
            </ConfigProvider>
        );
    }
}

export default App;

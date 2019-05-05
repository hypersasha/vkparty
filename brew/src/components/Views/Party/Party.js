import React, {Component} from 'react';
import {
    FixedLayout,
    HeaderButton,
    HorizontalScroll,
    PanelHeader,
    Tabs,
    TabsItem, Footer, Tooltip
} from "@vkontakte/vkui/src";

import {SERVER_URL} from "../../../lib/Utils";

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';

import axios from 'axios';
import PanelSpinner from "@vkontakte/vkui/src/components/PanelSpinner/PanelSpinner";
import PartyInfo from "./PartyInfo";
import PartyFilms from "./PartyFilms";

class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panelScope: 'info',
            party_info: {},
            loading: true,
            loadingFailed: false,
            isBattleTooltip: localStorage.getItem('isBattleTooltip')
        };

        this.onNavBack = this.onNavBack.bind(this);
        this.UpdatePartyInfo = this.UpdatePartyInfo.bind(this);
        this.ShowScreenSpinner = this.ShowScreenSpinner.bind(this);
        this.RemoveGuest = this.RemoveGuest.bind(this);
        this.RemoveMovie = this.RemoveMovie.bind(this);
    }

    onChangeScope(new_scope) {
        this.setState({
            panelScope: new_scope
        }, () => {
            window.scrollTo({top: 0});
        })
    }

    onNavBack() {
        window.location.hash = "";
        this.props.onChangePanel('raves');
    }

    componentDidMount() {
        this.UpdatePartyInfo();
    }

    ShowScreenSpinner() {
        if (this.props.onShowScreenSpinner && typeof this.props.onShowScreenSpinner === 'function') {
            this.props.onShowScreenSpinner(false);
        }
    }

    HideScreenSpinner() {
        if (this.props.onShowScreenSpinner && typeof this.props.onShowScreenSpinner === 'function') {
            this.props.onShowScreenSpinner(true);
        }
    }

    /**
     * Updates current loaded party info.
     * @constructor
     */
    UpdatePartyInfo() {
        if (window.location.hash) {
            const pid = window.location.hash.slice(1, window.location.hash.length);
            axios.get(SERVER_URL + '/party', {
                params: {
                    pid: pid,
                    user_id: this.props.userId
                }
            }).then((response) => {
                let res = response.data;
                if (res.isOK) {
                    this.HideScreenSpinner();
                    this.setState({
                        loading: false,
                        party_info: res.data,
                        isOwner: (res.data.owner && res.data.owner.user_id === this.props.userId)
                    });
                } else {
                    this.onNavBack();
                }
            }).catch(err => {
                this.setState({
                    loading: false,
                    loadingFailed: true
                });
            })
        }
    }

    /**
     * Client prediction for guest deleting.
     * @param gid
     * @constructor
     */
    RemoveGuest(gid) {
        let newGuests = this.state.party_info.guests.filter((guest) => {
            return guest.user_id !== gid;
        });

        this.setState(prevState => ({
            party_info: {
                ...prevState.party_info,
                guests: newGuests
            }
        }));
    }

    /**
     * Client prediction for movie deleting.
     * @param mid
     * @constructor
     */
    RemoveMovie(mid) {
        let newMovies = this.state.party_info.movies.filter((movie) => {
            return movie.movie.mid !== mid;
        });

        this.setState(prevState => ({
            party_info: {
                ...prevState.party_info,
                movies: newMovies
            }
        }));
    }

    render() {
        const loading = this.state.loading;
        return (
            <div>
                <PanelHeader
                    noShadow={true}
                    left={<HeaderButton onClick={() => {
                        this.onNavBack();
                    }}><Icon24BrowserBack/></HeaderButton>}
                >
                    <div className="rave--header-title">Событие</div>
                </PanelHeader>
                <FixedLayout vertical="top">
                    <Tabs theme="header" type="buttons">
                        <HorizontalScroll>
                            <TabsItem selected={this.state.panelScope === "info"}
                                      onClick={() => {
                                          this.onChangeScope('info')
                                      }}>Информация</TabsItem>
                            <Tooltip onClose={() => {
                                localStorage.setItem('isBattleTooltip', true);
                                this.setState({
                                    isBattleTooltip: true
                                });
                            }}
                                     text={"Поможет сделать случайный выбор из фильмов, которые предложили Ваши друзья."}
                                     cornerOffset={40}
                                     isShown={!this.state.isBattleTooltip}
                                     offsetY={3}
                                     alignX={"right"}
                            >
                                <TabsItem selected={this.state.panelScope === "movies"}
                                          onClick={() => {
                                              this.onChangeScope('movies')
                                          }}>Битва фильмов</TabsItem>
                            </Tooltip>
                        </HorizontalScroll>
                    </Tabs>
                </FixedLayout>
                {loading ? <PanelSpinner height={170}/> : ''}
                {this.state.loadingFailed ?
                    <Footer style={{marginTop: 70}}>Не удаётся установить связь с сервером. Повторите попытку чуть
                        позже.</Footer> : ''}
                {this.state.panelScope === "info" && !this.state.loading && !this.state.loadingFailed ?
                    <PartyInfo date={this.state.party_info.date}
                               userId={this.props.userId}
                               userInfo={this.props.userInfo}
                               isOwner={this.state.isOwner}
                               partyId={this.state.party_info.pid}
                               owner={this.state.party_info.owner}
                               title={this.state.party_info.title}
                               private={this.state.party_info.private}
                               maxMovies={this.state.party_info.max_movies}
                               info={this.state.party_info.info}
                               guests={this.state.party_info.guests}
                               onGuestAdded={this.UpdatePartyInfo}
                               onShowScreenSpinner={this.props.onShowScreenSpinner}
                               onGuestRemoved={this.RemoveGuest}
                    /> :
                    ''}
                {this.state.panelScope === "movies" && !this.state.loading && !this.state.loadingFailed ?
                    <PartyFilms userId={this.props.userId}
                                isOwner={this.state.isOwner}
                                maxMovies={this.state.party_info.max_movies}
                                partyId={this.state.party_info.pid}
                                onFilmAdded={this.UpdatePartyInfo}
                                onShowScreenSpinner={this.props.onShowScreenSpinner}
                                onGenerateFilm={this.props.onGenerateFilm}
                                onRemoveMovie={this.RemoveMovie}
                                movies={this.state.party_info.movies}/>
                    :
                    ''}
            </div>
        );
    }
}

export default Party;
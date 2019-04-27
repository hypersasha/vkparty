import React, {Component} from 'react';
import {
    Avatar, Button, Cell,
    FixedLayout, Group,
    HeaderButton,
    HorizontalScroll, List,
    PanelHeader,
    Tabs,
    Div,
    TabsItem, Footer, Header, Link, FormStatus
} from "@vkontakte/vkui/src";

import {SERVER_URL} from "../../../lib/Utils";

import Icon24BrowserBack from '@vkontakte/icons/dist/24/browser_back';
import CreatePartyForm from "../NewParty/CreatePartyForm";

import axios from 'axios';
import PanelSpinner from "@vkontakte/vkui/src/components/PanelSpinner/PanelSpinner";
import PartyInfo from "./PartyInfo";

class Party extends Component {
    constructor(props) {
        super(props);
        this.state = {
            panelScope: 'info',
            party_info: {
                title: "Кукинг Стрэм",
                date: "2019-04-28",
                private: true
            },
            loading: true,
            loadingFailed: false
        };
        this.onNavBack = this.onNavBack.bind(this);
    }

    onChangeScope(new_scope) {
        this.setState({
            panelScope: new_scope
        })
    }

    onNavBack() {
        window.location.hash = "";
        this.props.onChangePanel('raves');
    }

    componentWillMount() {

        if (window.location.hash) {
            const pid = window.location.hash.slice(1, window.location.hash.length);
            axios.get(SERVER_URL + '/party', {
                params: {
                    pid: pid,
                    user_id: 19592568
                }
            }).then((response) => {
                console.log(response);
                let res = response.data;
                if (res.isOK) {

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
                            <TabsItem selected={this.state.panelScope === "movies"}
                                      onClick={() => {
                                          this.onChangeScope('movies')
                                      }}>Фильмы</TabsItem>
                            <TabsItem selected={this.state.panelScope === "goods"}
                                      onClick={() => {
                                          this.onChangeScope('goods')
                                      }}>Покупки</TabsItem>
                        </HorizontalScroll>
                    </Tabs>
                </FixedLayout>
                {loading ? <PanelSpinner height={170}/> : ''}
                {this.state.loadingFailed ? <Footer style={{marginTop: 70}}>Не удаётся установить связь с сервером. Повторите попытку чуть позже.</Footer> : ''}
                {this.state.panelScope === "info" && !this.state.loading && this.state.loadingFailed ?
                    <PartyInfo /> :
                    ''}
            </div>
        );
    }
}

export default Party;
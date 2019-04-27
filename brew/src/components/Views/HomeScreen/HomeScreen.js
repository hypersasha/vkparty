import React, {Component} from 'react';

import Icon24Add from '@vkontakte/icons/dist/24/add';

import {Footer, Group, HeaderButton, PanelHeader} from "@vkontakte/vkui/src";

import axios from 'axios';
import {SERVER_URL, declOfNum} from "../../../lib/Utils";

import './homescreen.less';
import PanelSpinner from "@vkontakte/vkui/src/components/PanelSpinner/PanelSpinner";
import FutureParties from "./FutureParties/FutureParties";

class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loadingFailed: false,
            futureParties: this.props.parties
        };

        this.openParty = this.openParty.bind(this);
    }

    openParty(party_id) {
        window.location.hash = party_id;
        this.props.onChangePanel('party-info');
    }

    componentDidMount() {
        axios.get(SERVER_URL + '/parties', {
            params: {
                user_id: 19592568
            }
        }).then((response) => {
            if (response.data.isOK) {
                this.setState({
                    loading: false,
                    loadingFailed: false,
                    futureParties: response.data.data
                })
            } else {
                this.setState({
                    loading: false,
                    loadingFailed: false,
                    futureParties: []
                });
            }
        }).catch((err) => {
            this.setState({
                loading: false,
                loadingFailed: true
            });
        });
    }

    render() {
        const {loading, loadingFailed, futureParties} = this.state;
        return (
            <div>
                <PanelHeader
                    left={<HeaderButton onClick={() => { this.props.onChangeView('newParty'); }}><Icon24Add/></HeaderButton>}>
                    <div className="rave--header-title">
                        <span>Мои события</span>
                    </div>
                </PanelHeader>
                {loading ? <PanelSpinner height={100}/> : ''}
                {loadingFailed ? <Footer style={{marginTop: 30}}>Не удаётся установить связь с сервером. Повторите попытку чуть позже.</Footer> : ''}
                <Group title={"ближайшие события"}>
                    {(futureParties.length === 0 && !loading && !loadingFailed ? <Footer style={{}}>Не найдено ни одного события.</Footer> : '')}
                    <FutureParties futureParties={futureParties} onOpenParty={this.openParty} />
                </Group>
                <Footer>{futureParties.length} {declOfNum(futureParties.length, ["вечеринка", "вечеринки", "вечеринок"])}</Footer>
            </div>
        )
    }

}

export default HomeScreen;
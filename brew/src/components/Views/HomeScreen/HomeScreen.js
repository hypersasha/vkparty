import React, {Component} from 'react';

import Icon24Add from '@vkontakte/icons/dist/24/add';

import {Div, Footer, FormStatus, Group, HeaderButton, Panel, PanelHeader, PullToRefresh} from "@vkontakte/vkui/src";

import {declOfNum} from "../../../lib/Utils";

import './homescreen.less';
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

    componentDidMount() {}

    render() {
        const {loading, loadingFailed, parties, onUpdateParties, ...restProps} = this.props;
        return (
            <Panel id={this.props.id}>
                <PullToRefresh onRefresh={onUpdateParties} isFetching={loading}>
                    <div>
                        {this.props.userId < 0 ? <Div>
                            <FormStatus title={"Ошибка VK App"} state={"error"}>
                                Не удалось получить Ваш ВКонтакте ID. Убедитесь, что Вы открыли приложение VK App, а не
                                веб-браузер.
                            </FormStatus>
                        </Div> : ''}
                        <PanelHeader
                            left={<HeaderButton onClick={() => {
                                this.props.onChangeView('newParty');
                            }}><Icon24Add/></HeaderButton>}>
                            <div className="rave--header-title">Вечеринки</div>
                        </PanelHeader>
                        {loadingFailed ?
                            <Footer style={{marginTop: 30}}>Не удаётся установить связь с сервером. Повторите попытку
                                чуть
                                позже.</Footer> : ''}
                        <Group title={"ближайшие события"}>
                            {(parties.length === 0 && !loading && !loadingFailed ?
                                <Footer style={{paddingBottom: 50}}>Не найдено ни одного события.</Footer> : '')}
                            <FutureParties futureParties={parties} onOpenParty={this.openParty}/>
                        </Group>
                        <Footer>{parties.length} {declOfNum(parties.length, ["вечеринка", "вечеринки", "вечеринок"])}</Footer>
                    </div>
                </PullToRefresh>
            </Panel>
        )
    }

}

export default HomeScreen;
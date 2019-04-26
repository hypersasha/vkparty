import React, {Component} from 'react';

import Icon24Add from '@vkontakte/icons/dist/24/add';
import Icon24LogoVk from '@vkontakte/icons/dist/24/logo_vk';

import {Avatar, Cell, Footer, Group, HeaderButton, List, Panel, PanelHeader} from "@vkontakte/vkui/src";

import './homescreen.less';

class HomeScreen extends Component {
    constructor(props) {
        super(props);

        this.openParty = this.openParty.bind(this);
    }

    openParty(party_id) {
        window.location.hash = party_id;
        this.props.onChangePanel('party-info');
    }

    render() {
        return (
            <div>
                <PanelHeader
                    left={<HeaderButton onClick={() => { this.props.onChangeView('newParty'); }}><Icon24Add/></HeaderButton>}>
                    <div className="rave--header-title">
                        {/*<Icon24LogoVk/>*/}
                        <span>Мои события</span>
                    </div>
                </PanelHeader>
                <Group title={"ближайшие события"}>
                    <List>
                        <Cell
                            before={<Avatar
                                src={"https://www.tasteofhome.com/wp-content/uploads/2017/10/Six-Layer-Dinner_exps6019_W101973175B07_06_3bC_RMS-2.jpg"}
                                size={72}/>}
                            expandable={true}
                            size="l"
                            description={"Николай Таранов"}
                            bottomContent={
                                <div className="rave--event-date">В эту пятницу, 22 апр.</div>
                            }
                            onClick={() => {this.openParty('4t801o5pmcbhdjrpawra3woctwckbcbe')}}
                        >
                            Кукинг стрэм
                        </Cell>
                        <Cell
                            before={<Avatar
                                className={"rave-preview-pic"}
                                src={"https://cs.pikabu.ru/post_img/2013/06/14/11/1371231426_2070153925.jpg"}
                                size={72}/>}
                            expandable={true}
                            size="l"
                            description={"Артем Скачков"}
                            bottomContent={
                                <div className="rave--event-date">В след. субботу, 5 май</div>
                            }
                        >
                            Вечер кино
                        </Cell>
                    </List>
                </Group>
                <Footer>2 вечеринки</Footer>
            </div>
        )
    }

}

export default HomeScreen;